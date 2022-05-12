import { v4 as uuidv4 } from "uuid";
import * as cookie from 'cookie';


  export async function post({request}) {
    const sessionId = uuidv4();

    const headers = { 
        "Set-Cookie": cookie.serialize("session_id", sessionId, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        }),
    }; 

    
    return {
        status: 200,
        headers,
        body : {
            message: "success"
        }
    }
  }