import User from "../userSchema/userSchema.js";
import bcrypt from "bcrypt"
import genrateToken from "./token.js";
import { sendOTPByEmail } from "../email/sendEmail.js";
import uploadImageOnCloudinary from "../cloudinary/cloudinary.js";
export const signup = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({ message: "Please fill all details" })
        }
        const existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({ message: "Email already exist" })
        }

        if (password.length <= 5) {
            return res.status(400).json({ message: "Please create a strong password" })
        }
        const hashPass = await bcrypt.hash(password, 10)
        let otp = Math.floor(1000 + Math.random() * 9000).toString()
        const createUser = await User.create({
            userName,
            email,
            password: hashPass,
            otp,
            isVerified: false,

        })

        let token = await genrateToken(createUser._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production" ? true : false,
        })

        await sendOTPByEmail(email, otp);

        return res.status(201).json({
            message: "Signup Successfully",
            userName: createUser.userName,
            email: createUser.email,
            // otp: createUser.otp,
            role: createUser.role
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Signup error", error })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all details" })
        }
        const existEmail = await User.findOne({ email })
        if (!existEmail) {
            return res.status(400).json({ message: "Email not exist" })
        }
        const compaire = await bcrypt.compare(password, existEmail.password)
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        existEmail.otp = otp
        await existEmail.save()

        if (!compaire) {
            return res.status(400).json({ message: "Incorrect password" })
        }
        let token = genrateToken(existEmail._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production" ? true : false,
        })
        await sendOTPByEmail(email, otp)

        return res.status(200).json({
            message: "Login Successfully",
            userName: existEmail.userName,
            email: existEmail.email,
            // otp,
            isVerified: false,
            role: existEmail.role
        })
    } catch (error) {
        return res.status(500).json({ message: "Login error", error })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "Logout successfull" })
    } catch (error) {
        return res.status(500).json({ message: "Login error", error })

    }
}












// ----------------------------------------------------------------------------------------------------------








export const profile = async (req, res) => {
    try {
        let userId = req.userId
        const { userName } = req.body
        let profileImage;
        if (req.file) {
            profileImage = await uploadImageOnCloudinary(req.file.path)
        }

        let user = await User.findByIdAndUpdate(userId,
            {
                userName,
                profileImage
            }, { returnDocument: 'after' })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `profile error ${error}` })
    }
}

export const otherUserData = async (req, res) => {
    try {
        let user = await User.find({
            _id: { $ne: req.userId }
        })
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}


//----------------------------------------------------------------------------------------------------------

export const getAllPayment = async (req, res) => {
    try {
        let allUsers = await User.find()
        let list = []
        allUsers.forEach((u) => {
            if (u.payment && u.payment.length > 0) {
                list.push({
                    ...u._doc,
                    userName: u.userName,
                })
            }
        })

        res.status(200).json({ allPayment: list })
    } catch (error) {
        res.status(500).json({ message: "Error" })
    }
}
export const updateWallet = async (req, res) => {
    try {
        const { amount } = req.body; // Ye wo amount hai jo user ne bet lagayi (e.g. 10)
        const userId = req.userId;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        // Check if user has enough balance before deducting
        const checkUser = await User.findById(userId);
        if (checkUser.walletBalance < amount) {
            return res.status(400).json({ message: "Insufficient balance in wallet" });
        }

        const user = await User.findByIdAndUpdate(userId, {
            $inc: { walletBalance: -amount }, // Balance minus kiya
            $push: {
                payment: {
                    amount: -amount,
                    transactionId: `GAME-${Date.now()}`,
                    status: "approved", // Bet lag gayi
                    createdAt: new Date()
                }
            }
        }, { returnDocument: 'after' }); // 'new: true' is better for returning updated doc

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Bet placed successfully",
            userData: user // Pura user data bhejna secure hota hai
        });
    } catch (error) {
        console.error("Wallet Update Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



// export const winWallet = async (req, res) => {
//     try {
//         const { amount } = req.body; 
//         const userId = req.userId;

//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: "Invalid winning amount" });
//         }

//         // --- New Probability Logic ---
//         const winChance = Math.random() * 100;

//         if (winChance > 20) {
//             // 80% Case: Hum user ko "Jeetne" ka response denge 
//             // lekin Database mein amount 0 add karenge.
//             const user = await User.findById(userId); 
//             return res.status(200).json({
//                 success: true, 
//                 message: "Hard luck! You got 0 this time.",
//                 userData: user,
//                 winAmount: 0 // Frontend ko 0 amount bhejo
//             });
//         }
//         // --- End Logic ---

//         // 20% Case: Asli winning amount yahan add hoga
//         const user = await User.findByIdAndUpdate(userId, {
//             $inc: { walletBalance: amount },
//             $push: {
//                 payment: {
//                     amount: amount,
//                     transactionId: `WIN-${Date.now()}`,
//                     status: "approved",
//                     createdAt: new Date()
//                 }
//             }
//         }, { returnDocument: 'after' });

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Congratulations! You won.",
//             userData: user,
//             winAmount: amount
//         });
//     } catch (error) {
//         console.error("Winning update error:", error);
//         res.status(500).json({ message: "Winning update error" });
//     }
// }










// 2. Win Logic: Jab user game jeet jaye
export const winWallet = async (req, res) => {
    try {
        const { amount } = req.body; // Jeeta hua amount (e.g. 20)
        const userId = req.userId;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid winning amount" });
        }

        const user = await User.findByIdAndUpdate(userId, {
            $inc: { walletBalance: amount }, // Balance plus kiya
            $push: {
                payment: {
                    amount: amount,
                    transactionId: `WIN-${Date.now()}`,
                    status: "approved",
                    createdAt: new Date()
                }
            }
        }, { returnDocument: 'after' });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Winning amount added",
            userData: user
        });
    } catch (error) {
        console.error("Winning update error:", error);
        res.status(500).json({ message: "Winning update error" });
    }
}










// 1. Saare Pending Payments dekhne ke liye (Sirf Admin ke liye)
// ... baaki upar ka code same hai ...

// 1. Saare Pending Payments dekhne ke liye (Sirf Admin ke liye)
export const getPendingPayments = async (req, res) => {
    try {
        // Un users ko dhundo jinka koi na koi payment status 'pending' hai
        const users = await User.find({ "payment.status": "pending" });

        let pendingList = [];
        users.forEach(user => {
            user.payment.forEach(p => {
                if (p.status === "pending") {
                    pendingList.push({
                        userId: user._id,
                        userName: user.userName,
                        email: user.email,
                        paymentId: p._id, // Har payment ki unique ID
                        amount: p.amount,
                        upiId: p.upiId, // 🟢 SIRF YE LINE ADD KI HAI (Ab Admin ko UPI dikhega)
                        transactionId: p.transactionId,
                        paymentProf: p.paymentProf,
                        createdAt: p.createdAt
                    });
                }
            });
        });

        res.status(200).json({ success: true, pendingPayments: pendingList });
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending payments" });
    }
};

// ... baaki niche ka code same hai ...
// 2. Payment Approve karne ka logic
export const approvePayment = async (req, res) => {
    try {
        const { userId, paymentId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User nahi mila" });

        const paymentEntry = user.payment.find(p => p._id.toString() === paymentId);

        if (!paymentEntry) return res.status(404).json({ success: false, message: "Payment entry nahi mili" });
        if (paymentEntry.status !== "pending") return res.status(400).json({ message: "Already processed" });

        // ✅ Status update karo
        paymentEntry.status = "approved";

        // ✅ SIRF DEPOSIT PAR BALANCE BADHAO
        if (paymentEntry.type === "deposit") {
            user.walletBalance = (user.walletBalance || 0) + paymentEntry.amount;
        }
        // Note: Withdrawal mein balance pehle hi withdraw request ke waqt kat chuka hai, 
        // isliye yahan hum (+) ya (-) nahi karenge.

        await user.save();
        res.status(200).json({ success: true, message: "Approved successfully!" });

    } catch (error) {
        console.error("Approve Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const rejectPayment = async (req, res) => {
    try {
        const { userId, paymentId } = req.body; // Frontend se IDs aayengi

        // 1. User ko dhundo
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User nahi mila!" });
        }

        // 2. Uske payments array mein se wo wali payment dhundo
        const payment = user.payment.id(paymentId);

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment request nahi mili!" });
        }

        // 3. Status badal kar rejected kar do
        payment.status = "rejected";

        // 4. Save karo (taaki database update ho jaye)
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Payment Reject ho gayi hai!"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error during rejection" });
    }
};


// Example: Aapka code aisa dikhna chahiye
// Backend: withdraw controller
export const withdrawRequest = async (req, res) => {
    try {
        const { amount, upiId } = req.body;
        const user = await User.findById(req.id);


        // 1. Check karo balance hai ya nahi
        if (user.walletBalance < amount || amount < 300) {
            return res.status(400).json({ success: false, message: "Balance kam hai bhai!" });
        }

        if (amount > 1000) {
            return res.status(400).json({ success: false, message: "Maximum withdrall 1000 !" });
        }

        // 2. 🟢 TURANT PAISA KATO (Main logic)
        user.walletBalance -= Number(amount);



        // 3. Payment array mein entry dalo
        user.payment.push({
            amount: amount,
            upiId: upiId, // 👈 Ye save ho raha hai?
            type: "withdrawal",
            transactionId: "WD" + Date.now(),
            status: "pending"
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: "Withdrawal request sent & balance deducted!",
            user // Updated user bhejo frontend ko
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};