import React, { useContext, useState } from "react";
import game from "../../assets/game.png"
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import sf from "../../assets/sf.jpeg"
import secondgame from "../../assets/secondgame.png"
import { dataContext } from "../userContext.";
import { IoReturnDownBack } from "react-icons/io5";
function Bet2() {
    let nav = useNavigate()
    let { userData } = useSelector(state => state.user)
    let [bet, setBet] = useState(null) // 👈 0 ki jagah null rakha hai check ke liye

    const handlePlay = () => {
        // 1. Validation: Agar user ne kuch select hi nahi kiya
        if (bet === null) {
            return alert("Pehle bet amount select karein!");
        }

        // 2. Balance check
        if (bet > 0 && userData?.walletBalance < bet) {
            return alert("Bhai, pehle recharge karo! Balance kam hai.");
        }

        // 3. Navigate to Aviator
        nav("/aviator", { state: { amount: bet } });
    };

    return (
        <div className="divBet">
            <div id="money">
                <div className="mainMoney">
                    <h1 id="caseAdd" onClick={() => { nav('/wallet') }}>
                        🪙 {Number(userData?.walletBalance || 0).toFixed(1)}
                    </h1>
                </div>
            </div>

            <div className="walletHeader">
                <p onClick={() => nav("/home")} style={{ color: "white", position: 'absolute', top: "15px", left: "9px", fontFamily: "arial black", fontSize: "40px" }}><IoReturnDownBack /></p>

                {/* <img src={userData?.profileImage || sf} onClick={() => nav("/home")} className="walletLogo" id="home_logo" alt="profile"/> */}
                {/* 👈 Title update kar diya kyunki ye Aviator game hai */}
                <h1 id="textBet">Aviator Luck</h1>
            </div>

            <div className="divLogoBet">
                <img src={secondgame} className="logoBet" alt="game" />
            </div>

            <div className="bet" >
                {/* Bet selection buttons with active color logic */}
                <button className="price" style={{ backgroundColor: bet === 0 ? "orange" : "green" }} onClick={() => { setBet(0) }}>Free</button>
                <button className="price" style={{ backgroundColor: bet === 5 ? "red" : "green" }} onClick={() => { setBet(5) }}>₹ 5</button>
                <button className="price" style={{ backgroundColor: bet === 10 ? "red" : "green" }} onClick={() => { setBet(10) }}>₹ 10</button><br />
                <button className="price" style={{ backgroundColor: bet === 20 ? "red" : "green" }} onClick={() => { setBet(20) }}>₹ 20</button>
                <button className="price" style={{ backgroundColor: bet === 50 ? "red" : "green" }} onClick={() => { setBet(50) }}>₹ 50</button>
                <button className="price" style={{ backgroundColor: bet === 100 ? "red" : "green" }} onClick={() => { setBet(100) }}>₹ 100</button><br />
                <button className="price" style={{ backgroundColor: bet === 500 ? "red" : "green" }} onClick={() => { setBet(500) }}>₹ 500</button>
                <button className="price" style={{ backgroundColor: bet === 1000 ? "red" : "green" }} onClick={() => { setBet(1000) }}>₹ 1000</button>
            </div>

            <div className="dis">
                <h1 id="title">Plane Udao, Paisa Kamao! ✈️</h1>
                <p id="discription">Jitna upar plane jayega, utna bada jackpot milega! Bas plane crash hone se pehle Cash Out karein. Kya aap sahi waqt par rok payenge?</p>
            </div>

            <div className="playButton">
                <button className="Play" onClick={handlePlay}>Play Game</button>
            </div>
        </div>
    )
}

export default Bet2;