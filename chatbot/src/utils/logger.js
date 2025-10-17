/**
 * Logger Utility
 * Simple logging utility for the chatbot
 */

class Logger {
  constructor(module = 'App') {
    this.module = module;
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @returns {string} - Formatted message
   */
  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.module}]`;

    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data)}`;
    }
    return `${prefix} ${message}`;
  }

  /**
   * Log error
   * @param {string} message - Error message
   * @param {any} data - Additional data
   */
  error(message, data = null) {
    if (this.levels[this.logLevel] >= this.levels.error) {
      console.error(this.formatMessage('error', message, data));
    }
  }

  /**
   * Log warning
   * @param {string} message - Warning message
   * @param {any} data - Additional data
   */
  warn(message, data = null) {
    if (this.levels[this.logLevel] >= this.levels.warn) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  /**
   * Log info
   * @param {string} message - Info message
   * @param {any} data - Additional data
   */
  info(message, data = null) {
    if (this.levels[this.logLevel] >= this.levels.info) {
      console.log(this.formatMessage('info', message, data));
    }
  }

  /**
   * Log debug
   * @param {string} message - Debug message
   * @param {any} data - Additional data
   */
  debug(message, data = null) {
    if (this.levels[this.logLevel] >= this.levels.debug) {
      console.log(this.formatMessage('debug', message, data));
    }
  }
}

module.exports = Logger;

