import Country from '../models/countryModel.js';
import { fetchCountriesData, fetchExchangeRates } from './exchangeRateService.js';

class CountryService {
  async refreshAllCountries() {
    try {      
      // Fetch data from external APIs
      let countriesData, exchangeRates;

      try {
        [countriesData, exchangeRates] = await Promise.all([
          fetchCountriesData(),
          fetchExchangeRates()
        ]);
      } catch (apiError) {
        console.error('External API error:', apiError);
        throw new Error(`External data source unavailable: ${apiError.message}`);
      }

      const refreshTimestamp = new Date();
      const operations = [];
      let successCount = 0;

      for (const countryData of countriesData) {
        try {
          const currencyCode = this.extractCurrencyCodeSync(countryData.currencies);
          
          const exchangeRate = currencyCode ? exchangeRates[currencyCode] : null;
          
          const estimatedGDP = this.calculateEstimatedGDP(
            countryData.population,
            exchangeRate
          );

          const countryUpdate = {
            name: String(countryData.name || ''),
            capital: String(countryData.capital || ''),
            region: String(countryData.region || ''),
            population: Number(countryData.population) || 0,
            currency_code: currencyCode ? String(currencyCode) : null,
            exchange_rate: exchangeRate ? Number(exchangeRate) : null,
            estimated_gdp: Number(estimatedGDP) || 0,
            flag_url: String(countryData.flag || ''),
            last_refreshed_at: refreshTimestamp
          };

          // Validate types before adding to operations
          if (typeof countryUpdate.currency_code !== 'string' && countryUpdate.currency_code !== null) {
            console.warn(`Invalid currency_code type for ${countryData.name}:`, typeof countryUpdate.currency_code);
            countryUpdate.currency_code = null;
          }

          if (typeof countryUpdate.estimated_gdp !== 'number') {
            console.warn(`Invalid estimated_gdp type for ${countryData.name}:`, typeof countryUpdate.estimated_gdp);
            countryUpdate.estimated_gdp = 0;
          }

          operations.push({
            updateOne: {
              filter: { name: countryData.name },
              update: { $set: countryUpdate },
              upsert: true
            }
          });

          successCount++;

        } catch (countryError) {
          continue;
        }
      }

      // Execute bulk operations
      if (operations.length > 0) {
        const result = await Country.bulkWrite(operations, { ordered: false });
      }
      
      return {
        totalProcessed: successCount,
        refreshTimestamp
      };

    } catch (error) {
      throw error;
    }
  }

  extractCurrencyCodeSync(currencies) {
    if (!currencies || !Array.isArray(currencies) || currencies.length === 0) {
      return null;
    }
    
    const firstCurrency = currencies[0];
    if (!firstCurrency || typeof firstCurrency !== 'object') {
      return null;
    }
    
    return firstCurrency.code || null;
  }

  calculateEstimatedGDP(population, exchangeRate) {

    if (population == null || exchangeRate == null) {
      return 0;
    }
    
    // Convert to numbers
    const pop = Number(population);
    const rate = Number(exchangeRate);
    
    // Check if valid numbers
    if (isNaN(pop) || isNaN(rate) || rate === 0) {
      return 0;
    }
    
    // Generate random multiplier between 1000 and 2000
    const randomMultiplier = Math.random() * 1000 + 1000;
    
    // Calculate GDP
    const gdp = (pop * randomMultiplier) / rate;
    
    return Math.round(gdp * 100) / 100;
  }

  async getAllCountries(filters = {}, sort = {}) {
    const query = {};
    
    if (filters.region) {
      query.region = new RegExp(filters.region, 'i');
    }
    
    if (filters.currency) {
      query.currency_code = filters.currency.toUpperCase();
    }

    let sortOption = {};
    if (sort.gdp_desc) {
      sortOption.estimated_gdp = -1;
    } else if (sort.gdp_asc) {
      sortOption.estimated_gdp = 1;
    } else {
      sortOption.name = 1;
    }

    return await Country.find(query).sort(sortOption);
  }

  async getACountryByName(name) {
    return await Country.findOne({ name: new RegExp(`^${name}$`, 'i') });
  }

  async deleteCountryByName(name) {
    return await Country.findOneAndDelete({ name: new RegExp(`^${name}$`, 'i') });
  }

  async getCountryStatus() {
    const totalCountries = await Country.countDocuments();
    const lastRefreshed = await Country.findOne().sort({ last_refreshed_at: -1 });
    
    return {
      total_countries: totalCountries,
      last_refreshed_at: lastRefreshed ? lastRefreshed.last_refreshed_at : null
    };
  }
}

export default new CountryService();
