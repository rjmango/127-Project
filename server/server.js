import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    "https://your-production-domain.com",
    "https://admin.your-domain.com",
    "http://localhost:8080" // Keep for local development
];

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
}));
app.use('/', router);
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log("Listening on port:", PORT);
}); 