import React, { useState } from "react";
import "../All_CSS/Start.css"
import sf from "../assets/sf.jpeg"
import { FaCircleRight } from "react-icons/fa6";
import { useNavigate } from "react-router";
function Start(){
    let [loading, setLoading]=useState(false)
    let nav = useNavigate()
    return(
        <div className="parent">
            
            <div className="Xmain_div">
                <div className="logo_div">
                    <img src={sf}id="logo" />
                </div>

                <div className="logo_div">
                    <button id="get_start" onClick={()=>{nav("/signup")}}>Get Start
                    <FaCircleRight id="icon"/>
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Start