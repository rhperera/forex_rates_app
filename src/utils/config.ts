import dotenv from 'dotenv';

export class Config {
    private static instance: Config = null;
    public PORT: string;
    public REDIS_HOST_IP: string;
    public FIXER_API_KEY: string;
    public FIXER_END_POINT: string;

    private constructor() {
        dotenv.config({path: '.env'});
        this.PORT = '8090' || '8080';
        this.REDIS_HOST_IP = process.env.REDIS_HOST_IP || '127.0.0.1';
        this.FIXER_API_KEY = process.env.FIXER_API_KEY || 'API_KEY';
        this.FIXER_END_POINT = process.env.FIXER_END_POINT || '127.0.0.1';
    }

    public static getInstance = () : Config => {
        if (Config.instance === null) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}

