"use strict";

var UserRouter = require('./UserRouter');

// const CategoryRouter = require('./CategoryRouter')
// const ProductRouter = require('./ProductRouter')
//  const CartRouter = require('./CartRouter')

// const OrderRouter = require('./OrderRouter')
// const PaymentRouter = require('./PaymentRouter')

var routes = function routes(app) {
  app.use('/api/v1/user', UserRouter);

  // app.use('/api/category', CategoryRouter)
  // app.use('/api/product', ProductRouter)
  // app.use('/api/cart', CartRouter)
  // app.use('/api/order', OrderRouter)
  // app.use('/api/payment', PaymentRouter)
};

module.exports = routes;