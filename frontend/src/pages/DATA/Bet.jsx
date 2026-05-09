import React, { useContext, useState } from "react";
import game from "../../assets/game.png"
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import sf from "../../assets/sf.jpeg"
// import axios from "axios"; // 👈 Ab yahan axios ki zaroorat nahi hai
import { dataContext } from "../userContext.";
import { IoReturnDownBack } from "react-icons/io5";
function Bet() {
    let nav = useNavigate()
    let { userData } = useSelector(state => state.user)
    let [bet, setBet] = useState(0)
    // let { serverURL } = useContext(dataContext) // Filhal use nahi ho raha yahan

    const handlePlay = () => {
        // 1. Validation: Check karo bet zero to nahi ya balance se zyada to nahi
        if (bet > 0 && userData?.walletBalance < bet) {
            return alert("Bhai, pehle recharge karo! Balance kam hai.");
        }

        // 2. Logic: Yahan se API call HATA di hai. 
        // Bas user ko amount ke saath game page par bhej do.
        // Asli deduction NumberGame.jsx ke useEffect mein hoga.
        nav("/game", { state: { amount: bet } });
    };

    return (
        <div className="divBet">
            <div id="money">
                <div className="mainMoney">
                    {/* Wallet par click karke add money page par jana */}
                    <h1 id="caseAdd" onClick={() => { nav('/wallet') }}>
                        🪙 {Number(userData?.walletBalance || 0).toFixed(1)}
                    </h1>
                </div>
            </div>

            <div className="walletHeader">
                {/* <img src={userData?.profileImage || sf} onClick={() => nav("/home")}  className="walletLogo" id="home_logo" alt="profile"/> */}
                <p onClick={() => nav("/home")} style={{ color: "white", position: 'absolute', top: "15px", left: "9px", fontFamily: "arial black", fontSize: "40px" }}><IoReturnDownBack /></p>

                <h1 id="textBet">Guess the Number</h1>
            </div>

            <div className="divLogoBet">
                <img src={game} className="logoBet" alt="game" />
            </div>

            <div className="bet" >
                {/* Bet selection buttons */}
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
                <h1 id="title">Dimag Lagao, Paisa Kamao! 🚀</h1>
                <p id="discription">Simple game, bada profit! Bas sahi number pehchaniye aur jeetiye dheron cash prizes.Kya aap agle Big Winner hain? Abhi Bet lagayein aur khelna shuru karein!</p>
            </div>

            <div className="playButton">
                <button className="Play" onClick={handlePlay}>Play Game</button>
            </div>
        </div>
    )
}

export default Bet;