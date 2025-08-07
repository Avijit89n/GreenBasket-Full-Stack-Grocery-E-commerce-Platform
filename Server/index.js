import dotenv from "dotenv"
import app from "./app.js"
import dbconnect from "./source/Database/dbConnect.js"
import ApiError from "./source/Utils/ApiError.js"

dotenv.config({ path: "./.env" }) 

const PORT = process.env.PORT || 5000

dbconnect() 
    .then(()=>{
        app.listen(PORT ,()=>{
            console.log("successfully listen on the port ", PORT)
        })
    })
    .catch((error)=>{
        throw new ApiError(400, "failed to connect with the database", error)
    })