// logger.ts
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import pinoPretty from 'pino-pretty';

const logFilePath = path.join(__dirname, 'logs', 'logs.log');

if (!fs.existsSync(path.dirname(logFilePath))) {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const logDestination = pino.destination({
    dest: logFilePath,
    sync: true,
});

const logger = pino(
    {
        level: 'info',
    },
    pino.multistream([
        { stream: pinoPretty() },
        { stream: logDestination},
    ])
);

export default logger;
