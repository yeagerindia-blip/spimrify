import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { dataContext } from '../userContext.';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../../redux/userSlice';
import axios from 'axios';

const BigSmallGame = () => {
    const location = useLocation();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const { serverURL } = useContext(dataContext);
    const { userData } = useSelector(state => state.user);

    const initialBet = location.state?.amount || 0;
    const [betAmount] = useState(initialBet);
    const [selectedSide, setSelectedSide] = useState(null);
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([7, 2, 5, 1, 8, 4, 3]);

    const handlePlay = async (side) => {
        if (rolling) return;
        if (betAmount > 0 && userData?.walletBalance < betAmount) {
            alert("Balance kam hai!");
            return nav('/Bet2');
        }

        setSelectedSide(side);
        setRolling(true);
        setResult(null);

        try {
            if (betAmount > 0) {
                const res = await axios.post(`${serverURL}/lose`, { amount: betAmount }, { withCredentials: true });
                if (res.data.success) dispatch(setUserData(res.data.userData));
            }
        } catch (err) {
            setRolling(false);
            return alert("Server error!");
        }

        // Animation logic
        setTimeout(async () => {
            const luckyNumber = Math.floor(Math.random() * 10);
            const winningSide = luckyNumber >= 5 ? 'Big' : 'Small';
            
            setResult(luckyNumber);
            setHistory(prev => [luckyNumber, ...prev.slice(0, 7)]);
            setRolling(false);

            if (side === winningSide) {
                const winAmount = Number((betAmount * 1.9).toFixed(2));
                try {
                    const res = await axios.post(`${serverURL}/win`, { amount: winAmount }, { withCredentials: true });
                    if (res.data.success) {
                        dispatch(setUserData(res.data.userData));
                        alert(`Winner! Number: ${luckyNumber} (${winningSide}) \nJeete: ₹${winAmount}`);
                    }
                } catch (err) { console.error(err); }
            }
        }, 2000);
    };

    return (
        <>
            <style>{`
                .bs-container {
                    background: radial-gradient(circle, #2c3e50 0%, #000000 100%);
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: white;
                    padding: 15px;
                    font-family: 'Segoe UI', sans-serif;
                    overflow-x: hidden;
                }
                .bs-header {
                    width: 100%;
                    max-width: 500px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .wallet-badge {
                    background: #27ae60;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-weight: bold;
                    box-shadow: 0 0 10px rgba(39, 174, 96, 0.5);
                }
                .history-container {
                    display: flex;
                    gap: 8px;
                    margin: 15px 0;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .num-dot {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 14px;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .big-ball {
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    background: #1a1a1a;
                    border: 8px double #f1c40f;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin: 30px 0;
                    box-shadow: 0 0 30px rgba(241, 196, 15, 0.2);
                    animation: ${rolling ? 'spin 0.5s linear infinite' : 'none'};
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                
                .result-text { font-size: 60px; font-weight: 900; margin: 0; color: #f1c40f; }
                
                .action-section {
                    width: 100%;
                    max-width: 400px;
                    background: rgba(255,255,255,0.05);
                    padding: 20px;
                    border-radius: 25px;
                    backdrop-filter: blur(10px);
                    text-align: center;
                }
                .btn-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 15px;
                }
                .play-btn {
                    padding: 18px;
                    border: none;
                    border-radius: 15px;
                    font-size: 20px;
                    font-weight: 800;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.1s;
                }
                .play-btn:active { transform: scale(0.95); }
                .play-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                
                .bg-red { background: linear-gradient(145deg, #e74c3c, #c0392b); }
                .bg-blue { background: linear-gradient(145deg, #3498db, #2980b9); }
            `}</style>

            <div className="bs-container">
                <div className="bs-header">
                    <button onClick={() => nav(-1)} style={{background:'none', border:'none', color:'white', fontSize:'20px'}}>⬅️</button>
                    <div className="wallet-badge">₹ {Number(userData?.walletBalance || 0).toFixed(2)}</div>
                </div>

                <h2 style={{margin: '0', color: '#f1c40f', letterSpacing: '2px'}}>BIG SMALL</h2>
                
                <div className="history-container">
                    {history.map((n, i) => (
                        <div key={i} className="num-dot" style={{background: n >= 5 ? '#e74c3c' : '#3498db'}}>
                            {n}
                        </div>
                    ))}
                </div>

                <div className="big-ball">
                    <p style={{margin:0, fontSize:'14px', color:'#aaa'}}>{rolling ? "ROLLING" : "RESULT"}</p>
                    <h1 className="result-text">{rolling ? "?" : (result ?? "-")}</h1>
                    {!rolling && result !== null && 
                        <span style={{fontWeight:'bold', color: result >= 5 ? '#e74c3c' : '#3498db'}}>
                            {result >= 5 ? "BIG" : "SMALL"}
                        </span>
                    }
                </div>

                <div className="action-section">
                    <p style={{margin: '0 0 10px 0', fontSize: '14px'}}>Current Bet: <b>₹{betAmount}</b></p>
                    <div className="btn-group">
                        <button 
                            className="play-btn bg-red" 
                            disabled={rolling}
                            onClick={() => handlePlay('Big')}
                        >
                            BIG <br/><span style={{fontSize:'12px'}}>5-9</span>
                        </button>
                        <button 
                            className="play-btn bg-blue" 
                            disabled={rolling}
                            onClick={() => handlePlay('Small')}
                        >
                            SMALL <br/><span style={{fontSize:'12px'}}>0-4</span>
                        </button>
                    </div>
                    <p style={{fontSize:'11px', marginTop:'15px', color:'#888'}}>Win Payout: 1.9x | 143 Protection Enabled</p>
                </div>
            </div>
        </>
    );
};

export default BigSmallGame;