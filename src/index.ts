import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
<<<<<<< HEAD
import usersRouter from './routes/usersRoute.js';
=======
import usersRouter from './routes/users.js';
>>>>>>> 7e1a8a41631dbd319ed5504b84dc22f44f65620c
import ticketsRouter from './routes/tickets.js';

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
