import { Redis } from "ioredis";

const getRedisUrl = () => {
    if (process.env.REDIS_URI) {
        return process.env.REDIS_URI;
    }
    throw new Error("REDIS_URI is not defined");
};

export const redis = new Redis(getRedisUrl());
