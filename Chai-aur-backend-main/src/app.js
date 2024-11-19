import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()
//MIDDLEWARE--Use for checking (login)between /instagram and res.send("PUNEET")
//we use app.use mainly in case of middleware 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))
app.use(express.json({limit:"16kb"}))// limit set to accept json
app.use(express.urlencoded({extended :true,limit:"16kb"}))// Can give nested objects
app.use(express.static('public'))//to store images,file ,folder at own server 
app.use(cookieParser())//to set and read cookies

export{app}