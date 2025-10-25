import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectToDatabase } from './database/db.js';
import countryRouter from './routes/countryRoute.js';
import statusRouter from './routes/statusRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/countries', countryRouter);
app.use('/status', statusRouter);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Country API</h1>");
});

app.listen(PORT, () => {
    connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
});
