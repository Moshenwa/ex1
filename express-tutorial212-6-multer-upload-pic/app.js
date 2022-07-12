const express = require('express');
const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const catRouter = require('./routes/catRoutes');
const AppError = require('./utils/AppError');
const GlobalErrorHandler = require('./controllers/errorControllers')
app.use(morgan('dev'));
app.use(express.json())
app.use('/api/users', userRouter);
app.use('/api/cats', catRouter);





app.all('*',(req,     res, next) =>{
   const err = new AppError(404,`The requested url ${req.originalUrl} not found on this server `);
   next(err);
})
//error handler midleware
app.use(GlobalErrorHandler);

module.exports = app;