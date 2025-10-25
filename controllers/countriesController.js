//import { refreshAllCountries, extractCurrencyCode, calculateEstimatedGDP, getAllCountries, getACountryByName, deleteCountryByName, getCountryStatus } from '../services/countryService.js';
import CountryService  from '../services/countryService.js'
import imageGenerator from '../utils/imageGenerator.js';
import Country from '../models/countryModel.js';

export const refreshCountries = async (req, res) => {
  try {
    const result = await CountryService.refreshAllCountries();
    
    // Generate summary image
    const topCountries = await Country.find()
      .sort({ estimated_gdp: -1 })
      .limit(5);
    
    await imageGenerator.generateSummaryImage(
      result.totalProcessed,
      topCountries,
      result.refreshTimestamp
    );

    res.json({
      message: 'Countries data refreshed successfully',
      total_processed: result.totalProcessed,
      refresh_timestamp: result.refreshTimestamp
    });
  } catch (error) {
    if (error.message.includes('API error')) {
      res.status(503).json({
        error: 'External data source unavailable',
        details: error.message
      });
    } else {
      console.error('Refresh error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getCountries = async (req, res) => {
  try {
    const { region, currency, sort } = req.query;
    
    const filters = {};
    if (region) filters.region = region;
    if (currency) filters.currency = currency;

    const sortOptions = {};
    if (sort === 'gdp_desc') sortOptions.gdp_desc = true;
    if (sort === 'gdp_asc') sortOptions.gdp_asc = true;

    const countries = await CountryService.getAllCountries(filters, sortOptions);
    
    res.json(countries);
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCountryByName = async (req, res) => {
  try {
    const country = await CountryService.getACountryByName(req.params.name);
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json(country);
  } catch (error) {
    console.error('Get country error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCountry = async (req, res) => {
  try {
    const country = await CountryService.deleteCountryByName(req.params.name);
    
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    
    res.json({ message: 'Country deleted successfully' });
  } catch (error) {
    console.error('Delete country error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCountriesImage = async (req, res) => {
  try {
    const imageExists = await imageGenerator.imageExists();
    
    if (!imageExists) {
      return res.status(404).json({ error: 'Summary image not found' });
    }

    res.sendFile(imageGenerator.imagePath);
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStatus = async (req, res) => {
  try {
    const status = await CountryService.getCountryStatus();
    res.json(status);
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

