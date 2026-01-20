require('dotenv').config();
require('express-async-error');

const express = require('express');
const connectDB = require('./db/connect');

const authenticateUser = require('./middleware/auth');
const authorizedPermission = require('./middleware/permission');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const serverless = require('serverless-http');

// router
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const userManagementRouter = require('./routes/user-management');
const cartRouter = require('./routes/cart');

// middlewares error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(cookieParser());
app.use(express.static('./public'));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dashboard', authenticateUser, dashboardRouter);
app.use('/api/v1/products', authenticateUser, productsRouter);
app.use('/api/v1/orders', authenticateUser, authorizedPermission('admin', 'inventory'), ordersRouter);
app.use('/api/v1/user-management', authenticateUser, authorizedPermission('admin'), userManagementRouter);
app.use('/api/v1/cart', authenticateUser, authorizedPermission('admin', 'cashier'), cartRouter);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

let isConnected = false;
const connect = async () => {
  if (!isConnected) {
    if (!process.env.MONGO_URI) {
      return;
    }
    try {
      await connectDB(process.env.MONGO_URI);
      isConnected = true;
    } catch (err) {
    }
  }
};
connect();

module.exports = app;
module.exports.handler = serverless(app);