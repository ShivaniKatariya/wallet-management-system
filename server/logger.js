const pino = require('pino');
const fs = require('fs');

const logFile = fs.createWriteStream('./logs/web.log');

const webLog = pino({ level: 'info' }, logFile);

module.exports = { webLog };
