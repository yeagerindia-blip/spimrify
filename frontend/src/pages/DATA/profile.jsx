import React, { useContext, useRef, useState } from "react";
import sf from "../../assets/sf.jpeg"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../../../redux/userSlice";
import { useNavigate } from "react-router";
import { dataContext } from "../userContext.";

function Profile(){
    let file = useRef()
    let {userData} = useSelector(state=>state.user)
    let [backend, setBackend]=useState()
    let [frontend,setFrontend]=useState(userData?.profileImage || sf)
    let [userName,setUserName]=useState( userData?.userName || "")
    let [load,setLoad] = useState(false)
    let dispatch = useDispatch()
    let {serverURL} = useContext(dataContext)
    let nav = useNavigate()
    const handleImage = async(e)=>{
        try {
            let Sfile = e.target.files[0]
            setBackend(Sfile)
            let image = URL.createObjectURL(Sfile)
            setFrontend(image)
        } catch (error) {
            
        }
    }

    const updateProfile = async(e)=>{
        e.preventDefault()
        setLoad(true)
        let formData = new FormData()
        if(backend){
            formData.append("profileImage",backend)
        } 
        formData.append("userName",userName )
        try {
            let data = await axios.post(serverURL+"/updateProfile",formData,{withCredentials:true},{
                headers: { "Content-Type": "multipart/form-data" }
            })
            dispatch(setUserData(data.data))
            nav('/home')
            setLoad(false)
        } catch (error) {
            console.log(error)
            setLoad(false)
        }
    }
    return(
         <div className="Xmain_div">

            <div id="text_signup">
            <h1 id="text_profile">My Profile</h1> 
            </div>

            <div className="profileImageDiv">
                <img src={frontend} id="profileImage" />
                <div className="showImage" onClick={(e)=>{file.current.click()}}></div>
                <input type="file" ref={file} onChange={handleImage} accept="image/*" style={{display:"none"}}/>
            </div>

        <div className="signup_div">
            <form id="profile_form" onSubmit={updateProfile} >
                <input type="text" placeholder={userData?.userName } className="Signup_input" onChange={(e)=>{setUserName(e.target.value)}}/><br/>
                <input type="email" readOnly value={userData?.email}style={{opacity:"0.3"}} className="Signup_input" /><br/>
                <button id="signup_button" disabled={load}>{load?"Saving...":"Save"}</button>
            </form>
        </div>
        </div>
    )
}

export default Profile