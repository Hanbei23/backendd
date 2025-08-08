import express from 'express';
import cors from 'cors';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.route.js';
import antrianRouter from './routes/antrian.route.js';
import connectToDatabase from './database/mongodb.js';
import videoRouter from './routes/video.routes.js';

const app = express();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173', 
})); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/login', authRouter);
app.use('/api/antrian', antrianRouter);
app.use('/api/link', videoRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Toyota API');
  });
  
  app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${ PORT }`);
    await connectToDatabase();
  });
  
  export default app;
