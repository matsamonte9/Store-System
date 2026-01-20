require('dotenv').config();
require('express-async-error');

const express = require('express');
const connectDB = require('./db/connect');

const authenticateUser = require('./middleware/auth');
const authorizedPermission = require('./middleware/permission');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

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

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
      res.send('Server is alive!');
    });

    connectDB(process.env.MONGO_URI)
  .then(() => console.log('Connected to DB'))
  .catch(err => console.log('DB connection error:', err));

// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);
//     // app.listen(port, '0.0.0.0', console.log(`Server Listening on Port: ${port}`));
//   } catch (error) {
//     console.log(error);
//   }
// }

// start();