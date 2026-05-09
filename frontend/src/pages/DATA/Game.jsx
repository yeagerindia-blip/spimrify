import React, { useContext, useState, useEffect, useRef } from 'react'; // useRef add kiya
import { useLocation, useNavigate } from 'react-router';
import { dataContext } from '../userContext.';
import { useDispatch, useSelector } from 'react-redux';  
import { setUserData } from '../../../redux/userSlice';
import axios from 'axios';

function NumberGame() {
    const options = [10, 25, 50, 75];
    const [target] = useState(options[Math.floor(Math.random() * options.length)]);
    const [message, setMessage] = useState("Ek number choose karein!");
    const [gameOver, setGameOver] = useState(false);
    const [userChoice, setUserChoice] = useState(null)
    const location = useLocation()
    const betAmount = location.state?.amount || 0;

    let {serverURL} = useContext(dataContext)
    let dispatch = useDispatch()
    let {userData} = useSelector(state=>state.user)
    let nav = useNavigate()

    // 🛡️ Double deduction rokne ke liye Ref (Ye re-render par change nahi hota)
    const isRequestSent = useRef(false);

    useEffect(() => {
        const deductMoney = async () => {
            // Agar request pehle hi ja chuki hai ya amount galat hai, toh ruko
            if (isRequestSent.current || betAmount <= 0) return;

            try {
                isRequestSent.current = true; // Request bhejne se pehle hi lock laga do
                
                const res = await axios.post(`${serverURL}/lose`, 
                    { amount: betAmount }, 
                    { withCredentials: true }
                );
                
                if (res.data.success) {
                    dispatch(setUserData(res.data.userData));
                }
            } catch (err) {
                console.error("Deduction failed", err);
                alert(err.response?.data?.message || "Wallet balance issue!");
                nav('/Bet'); 
            }
        };

        deductMoney();
    }, [betAmount, serverURL, dispatch, nav]); // Dependencies set kar di

    const handleGuess = async (num) => {
        if (gameOver) return;
        setUserChoice(num);
        setGameOver(true);

        if (num === target) {
            setMessage(`Mubarak ho! 🎉 ${num} hi sahi jawab tha!`);

            try {
                const winAmount = betAmount * 2; 
                const res = await axios.post(`${serverURL}/win`, 
                    { amount: winAmount }, 
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setUserData(res.data.userData));
                }
            } catch (err) {
                console.error("Winning update failed", err);
            }
        } else {
            setMessage(`Oh no! ❌ Sahi number ${target} tha.`);
        }
    };

    const resetGame = () => {
        nav('/Bet'); 
    };

    return (
        <div style={{ 
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            margin: 0,
            padding: '20px',
            boxSizing: 'border-box',
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            background: 'linear-gradient(180deg, #3c611d 0%, #349408 100%)',
            color: 'white',
            overflow: 'hidden'
        }}>
            
            <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', textShadow: '0 0 10px rgba(255,0,0,0.5)' }}>🎯 Guess & Win</h2>
                <div style={{ height: '3px', background: '#ff4d4d', width: '60px', margin: '0 auto 30px' }}></div>
                
                <p style={{ 
                    fontSize: '1.4rem', 
                    minHeight: '80px', 
                    color: gameOver ? (userChoice === target ? '#45f542' : '#ff4d4d') : '#ccc',
                    fontWeight: 'bold',
                    padding: '0 10px'
                }}>
                    {message}
                </p>
                
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '20px',
                    width: '100%'
                }}>
                    {options.map((num) => (
                        <button 
                            key={num}
                            disabled={gameOver}
                            onClick={() => handleGuess(num)}
                            style={{
                                padding: '25px 0',
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                                cursor: gameOver ? 'not-allowed' : 'pointer',
                                backgroundColor: userChoice === num 
                                    ? (num === target ? '#055c19' : '#db2537') 
                                    : 'rgba(255, 255, 255, 0.08)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '15px',
                                transition: 'all 0.2s ease',
                                opacity: gameOver && userChoice !== num ? 0.4 : 1,
                                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                            }}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {gameOver && (
                    <button 
                        onClick={resetGame}
                        style={{
                            marginTop: '50px',
                            width: '100%',
                            padding: '18px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            backgroundColor: '#1c7a09',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(255, 255, 255, 0.4)',
                            textTransform: 'uppercase'
                        }}
                    >
                        🔄 Play Again
                    </button>
                )}
            </div>
        </div>
    );
}

export default NumberGame;