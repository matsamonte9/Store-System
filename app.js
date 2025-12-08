require('dotenv').config();
require('express-async-error');

const express = require('express');
const connectDB = require('./db/connect');
const app = express();

// const connectDB = require('')
app.use(express.static('./public'));

// router
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

// middlewares error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.use('/api/v1/products', productsRouter);
app.use('/api/v1/orders', ordersRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, '0.0.0.0', console.log(`Server Listening on Port: ${port}`));
  } catch (error) {
    console.log(error);
  }
}

start();