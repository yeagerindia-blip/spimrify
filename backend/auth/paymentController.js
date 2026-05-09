import User from "../userSchema/userSchema.js";

export const paymentController = async (req, res) => {
    try {
        const { amount, transactionId } = req.body;

        if (!amount || !transactionId) {
            return res.status(400).json({ message: "Please fill all details" });
        }



        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount < 100) {
            return res.status(400).json({ message: "Minimum payment amount is 100" });
        }

        if (numericAmount > 1000) {
            return res.status(400).json({ message: "Maximum payment amount is 1000" });
        }

        const userId = req.userId || req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const imagePath = req.file ? req.file.path : null;

        // 🛡️ SECURITY UPDATE: Balance abhi nahi badhega, sirf request pending mein jayegi
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $push: {
                    payment: {
                        amount: numericAmount,
                        transactionId: transactionId.trim(),
                        paymentProf: imagePath,
                        status: "pending" // 👈 Pehle approved tha, ab pending hai
                    }
                }
                // $inc: { walletBalance: numericAmount } 👈 YE LINE HATA DI HAI
            },
            { returnDocument: 'after' }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(201).json({
            success: true,
            message: "Payment submitted! Please wait for Admin approval.",
            user: updatedUser
        });

    } catch (error) {
        console.error("PAYMENT_ERROR:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}