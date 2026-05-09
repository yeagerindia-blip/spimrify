import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import sf from "../../assets/sf.jpeg"
import big from "../../assets/big.png" // 👈 Big/Small ka logo yahan use karein
import { IoReturnDownBack } from "react-icons/io5";
function Bet3() {
    let nav = useNavigate()
    let { userData } = useSelector(state => state.user)
    let [bet, setBet] = useState(null) 

    const handlePlay = () => {
        if (bet === null) {
            return alert("Pehle bet amount select karein!");
        }

        if (bet > 0 && userData?.walletBalance < bet) {
            return alert("Bhai, balance kam hai! Pehle recharge kijiye.");
        }

        // 🎯 Change: Ab ye /big-small route par bhejega
        nav("/big", { state: { amount: bet } });
    };

    return (
        <div className="divBet">
            <div id="money">
                <div className="mainMoney">
                    <h1 id="caseAdd" onClick={() => { nav('/wallet') }}>
                        ₹ {Number(userData?.walletBalance || 0).toFixed(1)}
                    </h1>
                </div>
            </div>

            <div className="walletHeader">
                {/* <p  onClick={() => nav("/home")} className="walletLogo" id="home_logo" />nn</p> */}
                <p onClick={() => nav("/home")} style={{color:"white",position:'absolute',top:"15px",left:"9px",fontFamily:"arial black",fontSize:"40px"}}><IoReturnDownBack/></p>
                <h1 id="textBet">Big/Small Luck</h1> 
            </div>

            <div className="divLogoBet">
                {/* 🎯 Big/Small related image */}
                <img src={big} className="logoBet" alt="big-small-game" />
            </div>

            <div className="bet" >
                <button className="price" style={{ backgroundColor: bet === 0 ? "orange" : "green" }} onClick={() => { setBet(0) }}>Free</button>
                <button className="price" style={{ backgroundColor: bet === 10 ? "red" : "green" }} onClick={() => { setBet(10) }}>₹ 10</button>
                <button className="price" style={{ backgroundColor: bet === 20 ? "red" : "green" }} onClick={() => { setBet(20) }}>₹ 20</button><br />
                <button className="price" style={{ backgroundColor: bet === 50 ? "red" : "green" }} onClick={() => { setBet(50) }}>₹ 50</button>
                <button className="price" style={{ backgroundColor: bet === 100 ? "red" : "green" }} onClick={() => { setBet(100) }}>₹ 100</button>
                <button className="price" style={{ backgroundColor: bet === 200 ? "red" : "green" }} onClick={() => { setBet(200) }}>₹ 200</button><br />
                <button className="price" style={{ backgroundColor: bet === 500 ? "red" : "green" }} onClick={() => { setBet(500) }}>₹ 500</button>
                <button className="price" style={{ backgroundColor: bet === 1000 ? "red" : "green" }} onClick={() => { setBet(1000) }}>₹ 1000</button>
            </div>

            <div className="dis">
                <h1 id="title">Sahi Chuno, Double Pao! 🎰</h1>
                <p id="discription">Kya agla number Big (5-9) hoga ya Small (0-4)? Bas apna dimag lagao aur apna paisa double karne ka mauka pao. 143!</p>
            </div>

            <div className="playButton">
                <button className="Play" onClick={handlePlay}>Start Game</button>
            </div>
        </div>
    )
}

export default Bet3;