import React, { useState } from "react";
import { useSelector } from "react-redux";
import sf from "../../assets/sf.jpeg"
import Sidebar from "./Sidebar";
import game from "../../assets/game.png"
import secondgame from "../../assets/secondgame.png"
import third from "../../assets/third.png"
import four from "../../assets/four.png"
import { useNavigate } from "react-router";
import useGetCurrentUserData from "../getCurrentUserData";
import Swal from "sweetalert2"
import a1 from "../../assets/a1.png"
import a2 from "../../assets/a2.png"
import a3 from "../../assets/a3.png"
import a4 from "../../assets/a4.png"
import a5 from "../../assets/a5.png"
import a6 from "../../assets/a6.png"
import a7 from "../../assets/a7.png"
import a8 from "../../assets/a8.png"
import holi from "../../assets/holi.png"
import big from "../../assets/big.png"
import banner from "../../assets/banner.png"
function Home() {
    useGetCurrentUserData()
    let { userData } = useSelector(state => state.user)
    let [side, setSide] = useState(false)
    let nav = useNavigate()



    const comingSoon = () => {
        Swal.fire({
            title: 'Coming Soon!',
            text: 'Ye game jald hi live hoga. Jude rahein!',
            icon: 'info',
            background: '#224d22', // Dark theme (Big Win style)
            color: '#fff',
            confirmButtonColor: '#09ff00', // Gold color button
            confirmButtonText: 'Theek hai',
            borderRadius: '20px', // Jo aapne manga tha
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            }
        });
    };




    return (
        <div className="main_div">
            <div className="home_header_div">
                <div className="fix_header">
                    <div id="home_play">
                        <h1 id="text_play">Spim<span id="case">rify</span></h1>
                    </div>

                    <div id="money">
                        <div className="mainMoney">
                            <h1 id="caseAdd" onClick={() => { nav('/wallet') }}>🪙 {Number(userData?.walletBalance || 0).toFixed(1)}</h1>
                        </div>
                    </div>
                    <img src={userData?.profileImage || sf} id="home_logo" onClick={() => setSide(!side)} />
                </div>
                {side && <Sidebar setSide={setSide} />}

            </div>
            <div className="holiDiv">
                <img src={banner} id="holi" />

            </div>
            <h1 id="games">Top Trending Games</h1>

            <div className="allGames">

                <img id="second_game" src={game} onClick={() => { nav('/Bet') }} />
                <img id="second_game" src={secondgame} onClick={() => { nav('/bet2') }} />
                <img id="first_game" src={big} onClick={() => { nav('/Bet3') }}/>
                <img id="second_game" src={a7} onClick={comingSoon} />
                <img id="first_game" src={a2} onClick={comingSoon} />
                <img id="second_game" src={a5} onClick={comingSoon} />



            </div>

            <h1 id="games">Hot Games: Play & Earn</h1>


            <div className="allGames">

                <img id="second_game" src={four} onClick={comingSoon} />
                <img id="first_game" src={a4}   onClick={comingSoon} />
                <img id="second_game" src={a3} onClick={comingSoon} />
                <img id="first_game" src={a6} onClick={comingSoon} />
                <img id="second_game" src={third} onClick={comingSoon} />
                <img id="first_game" src={a8} onClick={comingSoon} />






            </div>








        </div>
    )
}

export default Home