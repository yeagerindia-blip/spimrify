import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { dataContext } from "../userContext."; // Path check kar lena
import { setUserData } from "../../../redux/userSlice";

function Withdrawal() {
    const { userData } = useSelector((state) => state.user);
    const { serverURL } = useContext(dataContext);
    const dispatch = useDispatch();

    const [amount, setAmount] = useState("");
    const [upiId, setUpiId] = useState("");
    const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    // 1. Pehle check kar lo amount valid hai
    const withdrawAmount = Number(amount);
    if (withdrawAmount > userData?.wallet) {
        return alert("Bhai, balance kam hai!");
    }

    try {
        const res = await axios.post(`${serverURL}/withdraw`, 
            { amount: withdrawAmount, upiId: upiId }, 
            { withCredentials: true }
        );

        if (res.data.success) {
            alert("Request Sent! Balance Deducted.");
            
            // 2. 🟢 SABSE ZAROORI: Backend se jo naya user data aaya hai, use dispatch karo
            // Isse balance wapas purana nahi hoga.
            dispatch(setUserData(res.data.user)); 
            
            setAmount("");
            setUpiId("");
        }
    } catch (err) {
        alert(err.response?.data?.message || "Error occurred");
    }
};
    return (
        <div style={{ padding: "20px", color: "white", backgroundColor: "#1a1a1a", minHeight: "100vh" }}>
            <h2>Withdraw Funds</h2>
            <div style={{ margin: "20px 0", padding: "15px", border: "1px solid #333", borderRadius: "8px" }}>
                <p>Current Balance: <strong>₹ {Number(userData?.walletBalance).toFixed(1)}</strong></p>
            </div>

            <form onSubmit={handleWithdraw}>
                <div style={{ marginBottom: "15px" }}>
                    <label>Amount (₹):</label><br />
                    <input 
                    className="withPay"
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        required 
                        // style={{ width: "90%", padding: "10px", marginTop: "5px" }}
                        placeholder="Kitne paise nikalne hain?"
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>UPI ID:</label><br />
                    <input 
                    className="withPay"
                        type="text" 
                        value={upiId} 
                        onChange={(e) => setUpiId(e.target.value)} 
                        required 
                        // style={{ width: "93%", padding: "10px", marginTop: "5px" }}
                        placeholder="example@apl"
                    />
                </div>

                {/* <p style={{textAlign:"center",marginBottom:"9px"}}>🪙 100 Spimrify coin =  ₹10</p> */}

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: "10px 20px", 
                        backgroundColor: loading ? "#555" : "#28a745", 
                        color: "white", 
                        border: "none", 
                        cursor: "pointer" 
                    }}
                >
                    {loading ? "Processing..." : "Submit Request"}
                </button>
            </form>
        </div>
    );
}

export default Withdrawal;