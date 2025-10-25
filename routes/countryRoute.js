import { Router } from 'express';
import { refreshCountries, getCountries, getCountryByName, deleteCountry, getCountriesImage } from '../controllers/countriesController.js';

const countryRouter = Router();

countryRouter.post('/refresh', refreshCountries);
countryRouter.get('/image', getCountriesImage);
countryRouter.get('/:name', getCountryByName);
countryRouter.delete('/:name', deleteCountry);
countryRouter.get('/', getCountries);

export default countryRouter;
