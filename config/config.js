import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

const envVars = process.env;

const config = {
  env: envVars.NODE_ENV,
  jwtSecret: envVars.JWT_SECRET,
  port: envVars.PORT,
  emailRegex: envVars.EMAIL_REGEX
};

export default config;
