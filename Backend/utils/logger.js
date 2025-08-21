const fs = require('fs');
const path = require('path');

/**
 * Simple logging utility
 * For production, consider using winston or pino
 */
class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '../logs');
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaString}\n`;
    }

    writeToFile(level, message, meta = {}) {
        const logFile = path.join(this.logDir, `${level}.log`);
        const formattedMessage = this.formatMessage(level, message, meta);
        
        fs.appendFile(logFile, formattedMessage, (err) => {
            if (err) console.error('Failed to write log:', err);
        });
    }

    info(message, meta = {}) {
        console.log(`ℹ️  ${message}`, meta);
        this.writeToFile('info', message, meta);
    }

    warn(message, meta = {}) {
        console.warn(`⚠️  ${message}`, meta);
        this.writeToFile('warn', message, meta);
    }

    error(message, meta = {}) {
        console.error(`❌ ${message}`, meta);
        this.writeToFile('error', message, meta);
    }

    debug(message, meta = {}) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🐛 ${message}`, meta);
            this.writeToFile('debug', message, meta);
        }
    }

    success(message, meta = {}) {
        console.log(`✅ ${message}`, meta);
        this.writeToFile('info', message, meta);
    }
}

module.exports = new Logger();
