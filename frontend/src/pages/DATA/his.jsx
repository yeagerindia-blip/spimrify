import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const TransactionHistory = () => {
  const { userData, loading } = useSelector((state) => state.user) || {};
  const transactions = userData?.payment ? [...userData.payment].reverse() : [];
  
  // Hover state handle karne ke liye
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (loading) return (
    <div style={{ color: 'white', textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      Loading...
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '40px 20px', 
      background: 'linear-gradient(180deg, #244b23 0%, #46ec13 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      
      {/* Header */}
      <h1 style={{
        color: "white", 
        textAlign: "center", 
        fontFamily: "arial black", 
        fontSize: "2.5rem",
        textTransform: "uppercase",
        marginTop: "20px",
        marginBottom: "50px"
      }}>
        History
      </h1>

      {/* Main Data Container */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '40px auto 0 auto', // Margin Top 40px
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px' 
      }}>
        
        {transactions.length > 0 ? (
          transactions.map((txn, i) => (
            <div 
              key={txn._id || i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                // Hover hone par background change hoga
                backgroundColor: hoveredIndex === i ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                transform: hoveredIndex === i ? 'translateY(-2px)' : 'none',
              }}
            >
              {/* Left Side */}
              <div>
                <div style={{ 
                  color: 'white', 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  textTransform: 'capitalize' 
                }}>
                  {txn.type?.replace('_', ' ')}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginTop: '5px' }}>
                  {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : 'Recent'}
                </div>
              </div>

              {/* Right Side */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  color: 'white', 
                  fontSize: '22px', 
                  fontWeight: '900' 
                }}>
                  {txn.type === 'withdrawal' ? '-' : '+'}₹{txn.amount}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: 'bold', 
                  color: txn.status === 'approved' ? '#fff' : 'rgba(255,255,255,0.7)',
                  textTransform: 'uppercase',
                  marginTop: '4px'
                }}>
                  {txn.status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: 'white', textAlign: 'center', opacity: 0.5, marginTop: '50px' }}>
            No history found
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;