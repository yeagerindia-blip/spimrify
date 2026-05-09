import React, { useState, useContext, useEffect } from "react";
import sf from "../../assets/sf.jpeg"
import { ManageUsers } from "./userManage";
import { PaymentRequests } from "./payment";
import { CiLogin } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../redux/userSlice";
import axios from "axios";
import { useNavigate } from "react-router";
import { Players } from "./Players";
import { dataContext } from "../userContext.";

function Admin(){
    const [view, setView] = useState("users")
    let [payment, setPayment] = useState([])
    let dispatch = useDispatch()
    let nav = useNavigate()
    // ⚠️ Check karo serverURL ka spelling context mein 'serverURL' hai ya 'serverUrl'
    let { serverURL } = useContext(dataContext) 

    const adminLog = async() => {
        try {
            await axios.get(`${serverURL}/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            alert("Logout Successful")
            nav("/login");
        } catch (error) {
            console.log(error)
        }
    }

    // 🟢 Updated: Ab ye sirf PENDING payments layega
    const getPendingPayments = async() => {
        try {
            // Humne backend mein "/pending" route banaya hai
            let response = await axios.get(`${serverURL}/pending`, { withCredentials: true })
            if (response.data.success) {
                setPayment(response.data.pendingPayments)
                console.log("Pending data received:", response.data.pendingPayments);
            }
        } catch (error) {
            console.log("Payment fetch error:", error);
        }
    }

    // Jab bhi Admin "Payment Requests" par click karega, data refresh hoga
    useEffect(() => {
        getPendingPayments()
    }, [view])

    return(
        <div className="admin_div">
            <div className="adminheader">
                <img src={sf} id="adminlogo" alt="logo" />
                <h1 id="admintext">Admin Panel</h1>
                <button id="adminLogout" onClick={adminLog} title="Logout"><CiLogin/></button>
            </div>

            <div className="adminItem">
                <div className="adminOption">
                    <div className={`adminPay ${view === "users" ? "active" : ""}`} onClick={() => setView("users")}>User Management</div>
                    <div className={`adminPay ${view === "payments" ? "active" : ""}`} onClick={() => setView("payments")}>Payment Requests</div>
                    <div className={`adminPay ${view === "Players" ? "active" : ""}`} onClick={() => setView("Players")}>Players Records</div>
                    <h1 className="adminPay">Settings UPI Update</h1>
                </div>

                <div style={{ marginTop: "2px", padding: "20px", width: "100%" }}>
                    {view === "users" && <ManageUsers/>}
                    
                    {/* ✅ PaymentRequests ko data aur refresh function dono bhej rahe hain */}
                    {view === "payments" && (
                        <PaymentRequests 
                            data={payment} 
                            refresh={getPendingPayments} 
                        />
                    )}
                    
                    {view === "Players" && <Players/>}
                </div>
            </div>
        </div>
    )
}

export default Admin;