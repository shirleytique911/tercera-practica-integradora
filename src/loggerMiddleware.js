import winston from "winston";
import logger from "./logger.js";

const loggerMiddleware = function (req, res, next) {
  req.logger = logger;
  next();
};

export default loggerMiddleware;