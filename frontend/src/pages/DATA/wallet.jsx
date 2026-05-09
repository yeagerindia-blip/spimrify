import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QR from "../../assets/QR.jpeg"
import axios from "axios";
import { setUserData } from "../../../redux/userSlice";
import { dataContext } from "../userContext.";
import sf from "../../assets/sf.jpeg"
import { useNavigate } from "react-router";
import pay from '../../assets/pay.jpeg'
import { IoReturnDownBack } from "react-icons/io5";

function Wallet() {
    let { userData } = useSelector(state => state.user)
    let dispatch = useDispatch()
    let { serverURL } = useContext(dataContext)
    let [loading, setLoading] = useState(false)
    let [amount, setAmount] = useState("")
    let [transactionId, setTransactionId] = useState("")
    let [screenshot, setScreenshot] = useState(null)
    let [err, setErr] = useState("")
    let nav = useNavigate()

    const walletApi = async (e) => {
        e.preventDefault()
        
        if (!amount || !transactionId ) {
            return setErr("Please fill all fields and upload screenshot")
        }

        setLoading(true)
        setErr("")

        // ✅ FormData configuration
        const formData = new FormData()
        formData.append("amount", amount)
        formData.append("transactionId", transactionId)
        formData.append("screenshot", screenshot) // 👈 Ensure this matches router!

        try {
            // ✅ API call
            const response = await axios.post(`${serverURL}/payment`, formData, {
                withCredentials: true,
                headers: { 
                    "Content-Type": "multipart/form-data" 
                }
            })

            if (response.data.success || response.data.Success) {
                const updatedUser = response.data.user || response.data.userData;
                dispatch(setUserData(updatedUser))
                localStorage.setItem("userSession", JSON.stringify(updatedUser))
                alert("Payment submitted successfully!")
                nav("/home")
            }
        } catch (error) {
            console.error("Payment Error:", error)
            setErr(error.response?.data?.message || "Internal Server Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="walletDiv">
            <div className="walletHeader">
                <p onClick={() => nav("/home")} style={{ color: "white", position: 'absolute', top: "15px", left: "9px", fontFamily: "arial black", fontSize: "40px" }}><IoReturnDownBack /></p>
                <h1 id="walletText">Add Money to Wallet</h1>
            </div>

            <div className="walletBody">
                <h1 id="scan" style={{textAlign:'center'}}>Games are played with virtual 🪙 coins only. No real money gambling or cash rewards involved.</h1>
                
            </div>
            <div className="walletButton">
                <form onSubmit={walletApi} encType="multipart/form-data">
                    <input
                        type="number"
                        className="walletBox"
                        placeholder="Amount"
                        value={amount}
                        required
                        onChange={(e) => setAmount(e.target.value)}
                    /><br />
                    <input
                        type="text"
                        className="walletBox"
                        placeholder="Transaction Id"
                        value={transactionId}
                        required
                        onChange={(e) => setTransactionId(e.target.value)}
                    /><br />
                    <input
                        type="file"
                        name="screenshot" // 👈 Added name attribute
                        className="walletBoxC"
                        
                        accept="image/*"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                    /><br />
                    <p id="error" style={{ color: "red" }}>{err}</p>
                    <button type="submit" className="walletSubmit" disabled={loading}>
                        {loading ? "processing..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Wallet;