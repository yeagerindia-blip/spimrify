import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { CiLogin } from "react-icons/ci";
import { LiaWindowCloseSolid } from "react-icons/lia";
import axios from "axios";
import { setUserData } from "../../../redux/userSlice";
import { dataContext } from "../userContext.";
function Sidebar({ setSide }){
    let nav = useNavigate()
    let {userData} = useSelector(state=>state.user)
    let dispatch = useDispatch()
    let {serverURL} = useContext(dataContext)
    const logout = async(e)=>{
        e.preventDefault()
        try {
            let data = await axios.get(serverURL+"/logout",{withCredentials:true})
            dispatch(setUserData(null))
            nav("/")
        } catch (error) { 
            console(error)
        }
    }
    return(
        <div>
            <div  id="sidebar" >
                 <button onClick={() => setSide(false)} id="sidebar_close"><LiaWindowCloseSolid/></button>
                 <div id="logDiv" onClick={logout}>
                 <h3 id="logout">Logout</h3>
                 <button id="sidebar_log"><CiLogin/></button>
                </div>
                 <h1 style={{color:"white", fontFamily:"arial black" ,fontSize:"15px",marginLeft:"9%",marginTop:"5%"}}>{userData?.userName}</h1>

                 <div className="list">
                    <li onClick={()=>{nav('/profile')}}>👤  Profile</li>
                    <li onClick={()=>{nav('/wallet')}}> 💰  Wallet</li>
                    <li onClick={()=>{nav('/withdra')}}> 💸 Withdrawal</li>
                    <li onClick={()=>{nav('/history')}}> ⌛ History</li>

                 </div>
               

            </div>
        </div>
    )
}

export default Sidebar