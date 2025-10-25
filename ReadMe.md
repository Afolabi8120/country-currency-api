# Country Currency and Exchange API

A RESTful API that fetches country data from external APIs, calculates estimated GDP based on exchange rates, and provides comprehensive CRUD operations with caching capabilities.

## Features

- Country Data Management: Fetch, store, and manage country information
- Currency Exchange Rates: Real-time exchange rate integration
- GDP Estimation: Calculate estimated GDP using population and exchange rates
- Image Generation: Automatic summary image creation
- RESTful API: Full CRUD operations with filtering and sorting
- MongoDB Integration: Cloud database with efficient caching
- Error Handling: Comprehensive error management and validation

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Image Processing:** Sharp/SVG generation
- **HTTP Client:** Axios
- **Security:** Helmet, CORS
- **Environment Management:** Dotenv

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Afolabi8120/country-currency-api.git
cd country-currency-api
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory and add your configuration:

```env
PORT = 5000
MONGODB_URI = 'mongodb://localhost:27017/url_shortner'
COUNTRIES_API_URL = 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/USD'
```

4. Run the application:

```bash
npm start
```

### API Endpoints

| Method | Endpoint           | Description                       |
|---------|---------------------|-----------------------------------|
| POST    | `/countries/refresh`      | Fetch and cache all countries data          |
| GET     | `/countries`      | Get all countries   |
| GET     | `/countries?region=:name` | Get all countries using filters |
| GET     | `/countries/:name`      | Get specific country by name   |
| GET     | `/countries/image` | Get summary image |
| DELETE     | `/countries/:name` | Delete country record |
| GET     | `/status` | API status and statistics |

