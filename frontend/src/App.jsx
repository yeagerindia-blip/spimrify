import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import Start from "./pages/Start";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Login from "./pages/Login";
import Home from "./pages/DATA/Home";
import Profile from "./pages/DATA/profile";
import useGetCurrentUserData from "./pages/getCurrentUserData";
import { useDispatch, useSelector } from "react-redux";
import NumberGame from "./pages/DATA/Game";
import Admin from "./pages/admin/admin";
import usegetOtherUserData from "./pages/getOtherUserData";
import Wallet from "./pages/DATA/wallet";
import Bet from "./pages/DATA/Bet";
import Withdrawal from "./pages/DATA/Withdra";
import AviatorGame from "./pages/DATA/Avi";
import Bet2 from "./pages/DATA/Bet2";
import BigSmallGame from "./pages/DATA/big";
import Bet3 from "./pages/DATA/Bet3";
import TransactionHistory from "./pages/DATA/his";

function App() {
    const { userData, loading: reduxLoading } = useSelector(state => state.user);
    const [isChecking, setIsChecking] = useState(true);

    useGetCurrentUserData();
    usegetOtherUserData();

    useEffect(() => {
        // Sirf tabhi loading band karo jab Redux loading finish ho jaye
        if (reduxLoading === false) {
            setIsChecking(false);
        }
    }, [reduxLoading]);

    if (isChecking) {
        return (
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#000", color: "#fff" }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Authenticating...</h2>
                    <p style={{ fontSize: '12px', color: '#555' }}>Spimrify</p>
                </div>
            </div>
        );
    }

    const isVerified = userData?.isVerified === true;
    const isAdmin = userData?.role === 'admin';
    const isLoggedIn = !!userData; // Check if user exists

    return (
        <Routes>
            <Route path="/" element={<Start />} />

            {/* Auth Routes */}
            <Route path="/signup" element={!isLoggedIn ? <Signup /> : (isVerified ? <Navigate to="/home" /> : <Navigate to="/otp" />)} />
            <Route path="/login" element={!isLoggedIn ? <Login /> : (isVerified ? <Navigate to="/home" /> : <Navigate to="/otp" />)} />

            {/* Admin Route */}
            <Route path="/admin" element={isAdmin ? <Admin /> : (isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />)} />

            {/* Home & Other Protected Routes */}
            <Route path="/home" element={isLoggedIn ? (isVerified ? <Home /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            
            <Route path="/otp" element={isLoggedIn ? (isVerified ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />) : <Otp />) : <Navigate to="/login" />} />
            
            <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/wallet" element={isLoggedIn ? (isVerified ? <Wallet /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            <Route path="/game" element={isLoggedIn ? (isVerified ? <NumberGame /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            <Route path="/aviator" element={isLoggedIn ? (isVerified ? <AviatorGame /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            <Route path="/big" element={isLoggedIn ? (isVerified ? <BigSmallGame /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            
            <Route path="/Bet" element={isLoggedIn ? (isVerified ? <Bet /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            <Route path="/Bet2" element={isLoggedIn ? (isVerified ? <Bet2 /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            <Route path="/Bet3" element={isLoggedIn ? (isVerified ? <Bet3 /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            <Route path="/withdra" element={isLoggedIn ? (isVerified ? <Withdrawal /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />
            <Route path="/history" element={isLoggedIn ? (isVerified ? <TransactionHistory /> : <Navigate to="/otp" />) : <Navigate to="/login" />} />


            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;