import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
        credentials: true,
        origin: "http://localhost:8080",
    }));
app.use('/', router)
const PORT = 3000;

app.listen(PORT, ()=>{
    console.log("Listening on port:", PORT);
}); 