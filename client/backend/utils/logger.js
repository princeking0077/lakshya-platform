const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = process.env.LOG_DIR || path.join(__dirname, '../logs');
        this.ensureLogDir();
    }

    ensureLogDir() {
        try {
            if (!fs.existsSync(this.logDir)) {
                fs.mkdirSync(this.logDir, { recursive: true });
            }
        } catch (error) {
            console.error('Could not create log directory:', error.message);
        }
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaStr}`;
    }

    writeToFile(level, message, meta) {
        try {
            const logFile = path.join(this.logDir, `${level}.log`);
            const formattedMessage = this.formatMessage(level, message, meta) + '\n';
            fs.appendFileSync(logFile, formattedMessage);
        } catch (error) {
            // Silent fail - don't crash if logging fails
        }
    }

    error(message, meta = {}) {
        const formatted = this.formatMessage('error', message, meta);
        console.error(formatted);
        this.writeToFile('error', message, meta);
    }

    warn(message, meta = {}) {
        const formatted = this.formatMessage('warn', message, meta);
        console.warn(formatted);
        this.writeToFile('warn', message, meta);
    }

    info(message, meta = {}) {
        const formatted = this.formatMessage('info', message, meta);
        console.log(formatted);
        this.writeToFile('info', message, meta);
    }

    debug(message, meta = {}) {
        if (process.env.LOG_LEVEL === 'debug') {
            const formatted = this.formatMessage('debug', message, meta);
            console.log(formatted);
            this.writeToFile('debug', message, meta);
        }
    }
}

module.exports = new Logger();
