import express from 'express';
import { connectDB } from './config/connectDB.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
}));

// Routes
app.use('/api/auth', authRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});