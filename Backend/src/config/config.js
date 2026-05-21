import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables");
}

if(!process.env.IMAGE_KIT_PRIVATE_KEY){
    throw new Error("IMAGE_KIT_PRIVATE_KEY is not defined in environment variables");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined in environment variables");
}


export const config = {
    MONGO_URI : process.env.MONGO_URI,
    IMAGE_KIT_PRIVATE_KEY : process.env.IMAGE_KIT_PRIVATE_KEY,
    JWT_SECRET : process.env.JWT_SECRET
}