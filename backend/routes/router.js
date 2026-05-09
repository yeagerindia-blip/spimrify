import express from "express"
import { login, logout, signup } from "../auth/auth.js"
import { otp_verified } from "../email/otp.js"

const authRouter = express.Router()
authRouter.post("/signup",signup)
authRouter.post("/otp",otp_verified)
authRouter.post("/login",login)
authRouter.get("/logout",logout)

export default authRouter 