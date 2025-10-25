import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const COUNTRIES_API_URL = process.env.COUNTRIES_API_URL;
const EXCHANGE_RATE_API_URL = process.env.EXCHANGE_RATE_API_URL;

export const fetchCountriesData = async () => {
    try {
      const response = await axios.get(COUNTRIES_API_URL, { timeout: 10000 });
      return response.data;
    } catch (error) {
      throw new Error(`Countries API error: ${error.message}`);
    }
  }

export const fetchExchangeRates = async () => {
    try {
      const response = await axios.get(EXCHANGE_RATE_API_URL, { timeout: 10000 });
      return response.data.rates;
    } catch (error) {
      throw new Error(`Exchange rate API error: ${error.message}`);
    }
  }

