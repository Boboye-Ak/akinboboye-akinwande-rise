// custom.d.ts

import { Request } from "express"

declare global {
    namespace Express {
        interface Request {
            currentUser?: any,
            gottenFile?: any 
        }
    }
}


declare namespace NodeJS {
    interface ProcessEnv {
        PORT:string,
        DB_PORT:string,
        DB_USER:string,
        DB_PASS:string,
        USER_SESSION_SECRET:string,
        CLOUDINARY_CLOUD_NAME:string,
        CLOUDINARY_API_KEY:string,
        CLOUDINARY_API_SECRET:string
    }
  }
