import express from 'express';
import dotenv from 'dotenv';
import { ROUTES } from '../../constants';
import logger from '../../utils/loggers/logger.util';

// Routes
import * as QuestionRoutes from './routes/question.routes';

dotenv.config(); // for process.env to work!

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json())
app.use(ROUTES.QUESTION, QuestionRoutes.default);

app.listen(PORT, () => logger.info("server running on port: " + PORT + " 🔥🔥🔥"))