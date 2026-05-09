import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice";
import { dataContext } from "./userContext.";
function Otp(){
let [mes,setMes]=useState()
let [err,setErr] = useState()
let [load,setLoad] = useState(false)
let dispatch = useDispatch()
let {serverURL} = useContext(dataContext)
let location = useLocation()
let checkEmail = location.state?.email || localStorage.getItem("userEmail");
let nav = useNavigate()


    const otp_api = async(e)=>{
        e.preventDefault()
        setLoad(true)
        if(!checkEmail){
            console.log("Email missing hai, aage nahi jayenge");
            return;
        }

        try {
            let data = await axios.post(serverURL+"/otp",
                {
                    email: checkEmail,
                    otp: mes
                },{withCredentials:true})
                dispatch(setUserData(data.data))
                alert("Account Verified!");

                if(data.data.role === 'admin'){
                nav('/admin')
                }else{
                nav('/home')
                }
        setLoad(false)

        } catch (error) {
            console.log(error) 
            setErr(error.response.data.message)
        setLoad(false)

        }
    }
    return(
        <div className="Xmain_div">
<div id="otp_div">
                <h1 style={{color:"white",display:"inline", marginTop:"6%",fontSize:"15px",textAlign:"center"}}>Send OTP  :- {checkEmail}</h1>

</div>
            <div id="otp_div">
                <form onSubmit={otp_api}>
                    <input type="text" placeholder="Enter-4 Digit OTP" id="otp_box" className="otp" onChange={(e)=>{setMes(e.target.value)}}/><br/>
                      {<p id="error">{err}</p>}
                      <button id="otp_button" disabled={load}>{load?"Proccessing...":"Submit"}</button>
                </form>
            </div>
        </div>
    )
}
export default Otp


