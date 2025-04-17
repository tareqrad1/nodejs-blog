import express from 'express';
import { connectDB } from './config/connectDB.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

// Import routes
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';

const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
}));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});