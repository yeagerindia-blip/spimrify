import axios from "axios";
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { setUserData } from "../../redux/userSlice";
import { dataContext } from "./userContext.";
import { CiUnread } from "react-icons/ci";

function Login(){
    let nav = useNavigate()
    let [email, setEmail] = useState()
    let [password, setPassword] = useState()
    let [load,setLoad] = useState(false)
    let [err, setErr] = useState()
    let {serverURL} = useContext(dataContext)
        let [ pass,setPass] = useState(false)
    
    let dispatch = useDispatch()
    const login_api = async(e)=>{
        e.preventDefault()
        setLoad(true)
        try {
            let data = await axios.post(serverURL+"/login",{
                email,
                password
            },{withCredentials:true})
            localStorage.setItem("userEmail", email)
            dispatch(setUserData(data.data))
            
            setLoad(false)
            nav("/otp",{state:{email:email}})
            
        } catch (error) {
            console.log(error)
            setErr(error.response.data.message|| "Something went wrong")
            setLoad(false)
        }
    }
    return(
        <div className="Xmain_div">

            <div id="text_signup">
            <h1 id="text">Join the Battle</h1> 
            </div>

            <div id="loginDiv">
                <form onSubmit={login_api}>
                <input type="email" placeholder="Email"className="Signup_input" onChange={(e)=>{setEmail(e.target.value)}}/><br/>
                <div className="Signup_input" style={{display:'flex',alignContent:'center',justifyContent:'center'}}> <input type={pass ? 'text':'password'} id="showPass" style={{backgroundColor:'transparent',border:'none',outline:'none'}} placeholder="Password"  onChange={(e) => { setPassword(e.target.value) }} /><CiUnread id="shoow" onClick={(prev)=>{setPass(prev=>!prev)}} /></div><br />
                {<p id="error">{err}</p>}
                <button id="signup_button"disabled={load} >{load?"Loading...":"Login"}</button>
                <p id="signup_last" onClick={()=>{nav("/signup")}}>Get started for free ? <span>Create account</span></p>
            </form> 
            </div>


        </div>
    )
}

export default Login