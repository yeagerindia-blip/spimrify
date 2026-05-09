import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser } from "../auth/getCorrentUser.js"
import { Upload } from "../middleware/multer.js"
import { approvePayment, getAllPayment, getPendingPayments, otherUserData, profile, rejectPayment, updateWallet, winWallet, withdrawRequest } from "../auth/auth.js"
import { paymentController } from "../auth/paymentController.js"
import { isAdmin } from "../middleware/isAdmin.js"

const userRouter = express.Router()

// ✅ Sabhi routes ek hi baar mein finalize
userRouter.get("/getCurrentUser", isAuth, getCurrentUser)

// Profile update with image
userRouter.post("/updateProfile", isAuth, Upload.single("profileImage"), profile)

userRouter.get("/getOther", isAuth, otherUserData)

// ✅ Payment route fixed: Added Upload.single for screenshot
userRouter.post("/payment", isAuth, Upload.single("screenshot"), paymentController)

userRouter.get("/getAllPayment",isAuth, getAllPayment)
 
userRouter.post("/lose", isAuth, updateWallet)
userRouter.post("/win", isAuth, winWallet)

userRouter.get("/pending",isAuth,getPendingPayments)
userRouter.post("/approve",isAuth,approvePayment)
userRouter.post("/reject",isAuth,rejectPayment)
userRouter.post("/withdraw",isAuth,withdrawRequest)
export default userRouter