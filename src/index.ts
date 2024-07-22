import express, { Express } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import connectToDb from '../src/config/databaseConfig';
import commonRouter from './routes/commonRoutes';
import bsaRouter from './routes/bsaRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY!;

app.use(express.json());
app.use(
    session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(morgan('dev'));
app.use(cors({
    exposedHeaders: ["*"]
}));

connectToDb();

app.use('/common', commonRouter);
app.use('/bsa', bsaRouter);

app.listen(port, () => {
    console.log(`Server is running at  http://localhost:${port}`);
});