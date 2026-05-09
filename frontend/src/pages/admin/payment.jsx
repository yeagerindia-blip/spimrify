import { useSelector } from "react-redux"
import axios from "axios";
import { useContext, useMemo } from "react";
import { dataContext } from "../userContext.";

export const PaymentRequests = ({ data, refresh }) => {
    const { serverURL } = useContext(dataContext);

    const sortedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return [...data].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA; 
        });
    }, [data]);

    const handleApprove = async (userId, paymentId) => {
        if (!userId || !paymentId) {
            alert("Error: IDs are undefined!");
            return;
        }
        try {
            const res = await axios.post(`${serverURL}/approve`, 
                { userId, paymentId }, 
                { withCredentials: true }
            );
            if (res.data.success) {
                alert("Payment Approved!");
                refresh(); 
            }
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || "Approval error"));
        }
    };

    const handleReject = async (userId, paymentId) => {
        if (!window.confirm("Reject karein?")) return;
        try {
            const res = await axios.post(`${serverURL}/reject`, 
                { userId, paymentId }, 
                { withCredentials: true }
            );
            if (res.data.success) {
                alert("Payment Rejected!");
                refresh();
            }
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || "Failed"));
        }
    };

    return (
        <div className="paymen" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '10px', boxSizing: 'border-box' }}>
            <h1 id="userMan" style={{ textAlign: "center", fontFamily: "arial black", margin: "20px 0", fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                Pending Requests
            </h1>

            {/* CSS for Responsiveness  */}
            <style>{`
                .payment-card {
                    display: flex;
                    flex-wrap: wrap; /* Phone par todne ke liye */
                    align-items: center;
                    justify-content: space-between;
                    background-color: #1e1e1e;
                    padding: 15px;
                    border-radius: 10px;
                    color: white;
                    border: 1px solid #333;
                    gap: 15px;
                }

                .card-info { flex: 1; min-width: 150px; }
                .card-img { flex: 1; display: flex; justify-content: center; min-width: 120px; }
                .card-btns { flex: 1; display: flex; gap: 8px; justify-content: flex-end; min-width: 180px; }

                @media (max-width: 600px) {
                    .payment-card {
                        flex-direction: column; /* Phone par ek ke niche ek */
                        text-align: center;
                    }
                    .card-btns {
                        width: 100%;
                        justify-content: center;
                    }
                    .card-btns button {
                        flex: 1; /* Buttons barabar size ke ho jayein */
                    }
                    .card-img img {
                        height: 120px !important; /* Phone par proof bada dikhe */
                    }
                }
            `}</style>

            <div className="payment-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {sortedData.length > 0 ? (
                    sortedData.map((item, index) => (
                        <div key={item.paymentId || index} className="payment-card">
                            
                            {/* User Info Section */}
                            <div className="card-info">
                                <h3 style={{ margin: '0', fontSize: '1.1rem' }}>{item.userName}</h3>
                                <p style={{ margin: '5px 0', color: '#28a745', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{item.amount}</p>
                                
                                {item.transactionId && item.transactionId.startsWith("WD") ? (
                                    <p style={{ margin: '0', fontSize: '0.9rem', color: '#3498db', fontWeight: 'bold' }}>
                                        UPI: <span style={{color: '#fff'}}>{item.upiId || "UPI not found"}</span>
                                    </p>
                                ) : (
                                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#888', wordBreak: 'break-all' }}>
                                        TXN: {item.transactionId}
                                    </p>
                                )}

                                <span style={{ 
                                    fontSize: '11px', 
                                    padding: '2px 8px', 
                                    borderRadius: '12px',
                                    backgroundColor: item.transactionId?.startsWith("WD") ? 'rgba(230, 126, 34, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                                    color: item.transactionId?.startsWith("WD") ? '#e67e22' : '#2ecc71',
                                    display: 'inline-block',
                                    marginTop: '5px',
                                    border: `1px solid ${item.transactionId?.startsWith("WD") ? '#e67e22' : '#2ecc71'}`
                                }}>
                                    {item.transactionId?.startsWith("WD") ? "WITHDRAWAL" : "DEPOSIT"}
                                </span>
                            </div>

                            {/* Image/Proof Section */}
                            <div className="card-img">
                                {item.paymentProf ? (
                                    <a href={item.paymentProf} target="_blank" rel="noreferrer">
                                        <img src={item.paymentProf} alt="Proof" style={{ height: '80px', borderRadius: '8px', border: '1px solid #444', transition: '0.3s' }} />
                                    </a>
                                ) : (
                                    <div style={{ padding: '10px', border: '1px dashed #555', borderRadius: '8px', color: '#555', fontSize: '0.8rem' }}>
                                        Withdraw Request
                                    </div>
                                )}
                            </div>

                            {/* Buttons Section */}
                            <div className="card-btns">
                                <button 
                                    onClick={() => handleReject(item.userId, item.paymentId)} 
                                    style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    REJECT
                                </button>
                                <button 
                                    onClick={() => handleApprove(item.userId, item.paymentId)} 
                                    style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    APPROVE
                                </button>
                            </div>

                        </div>
                    ))
                ) : (
                    <p style={{ color: '#888', textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>No pending requests.</p>
                )}
            </div>
        </div>
    );
};