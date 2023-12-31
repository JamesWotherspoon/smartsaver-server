const express = require('express');
require('dotenv').config();
const { RateLimitError } = require('../utils/customErrorUtils');
const useragent = require('express-useragent');
const {
  serverErrorLogger,
  clientErrorLogger,
  successResponseLogger,
} = require('../utils/loggerUtils');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const parseJson = express.json();

const cookieParse = cookieParser();

const helmetMiddleware = helmet();

const corsMiddleware = cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  allowedHeaders: 'Content-Type',
  methods: ['GET, POST, PUT, DELETE'],
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80,
  handler: (req, res, next) => {
    // If the rate is exceeded, respond with status code 429 and an error message
    throw new RateLimitError();
  },
});

const log = [
  useragent.express(),
  (req, res, next) => {
    // Store the start time for calculating response time
    req.startTime = Date.now();
    // Listen for 'finish' event on response
    res.on('finish', () => {
      const logInfo = {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip,
        browser: req.useragent.browser,
        os: req.useragent.os,
        response_status: res.statusCode,
        response_time: `${Date.now() - req.startTime}ms`,
      };
      // Log the information to the logger
      successResponseLogger.info('Response', logInfo);
    });
    next();
  },
];

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const responseError = {
    message: error.message || 'Internal Server Error',
    type: error.type || 'INTERNAL_SERVER_ERROR',
    status: error.status || 'error',
    stack: error.stack,
    originError: error.originalError,
  };
  console.log(error);
  // Log the error
  if (error.status === 'fail' || (error.status > 400 && error.status < 500)) {
    clientErrorLogger.error({
      path: req.originalUrl,
      message: responseError.message,
      type: responseError.type,
      status: responseError.status,
      originError: responseError.originError,
    });
  } else {
    serverErrorLogger.error({
      path: req.originalUrl,
      message: responseError.message,
      type: responseError.type,
      status: responseError.status,
      stack: responseError.stack,
    });
  }

  const isDev = process.env.NODE_ENV === 'development';
  console.log(isDev);
  if (isDev) {
    responseError.stack = error.stack;
    responseError.requestUrl = req.originalUrl;
    responseError.requestMethod = req.method;
  }

  res.status(statusCode).json(responseError);
};

module.exports = {
  parseJson,
  cookieParse,
  helmetMiddleware,
  corsMiddleware,
  limiter,
  log,
  errorHandler,
};
