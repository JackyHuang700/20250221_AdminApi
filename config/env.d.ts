declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    HOST: string;

    JET_LOGGER_MODE: 'CONSOLE' | 'FILE' | 'BOTH';
    JET_LOGGER_FILEPATH: string;
    JET_LOGGER_TIMESTAMP: 'TRUE' | 'FALSE';
    JET_LOGGER_FORMAT: 'LINE' | 'JSON';

    DB_CONNECTION: string;
    JWT_SECRET: string;
    SESSION_SECRET: string;
  }
}
