import { createClient } from "redis"
const redis =  await createClient({ url: process.env.REDIS_URL as string }).connect();

export {
    redis
}