import React, { useEffect, useState } from "react";

function App() {
  const [tg, setTg] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      webApp.ready();
      setTg(webApp);
      webApp.expand();
      
      // Critical fix for macOS
      if (navigator.platform === "MacIntel") {
        webApp.enableClosingConfirmation(); // Prevents automatic closing
        console.log("macOS protections enabled");
      }
    }
  }, []);

  const sendToBot = async () => {
    if (!tg) return;
    
    setIsSending(true);
    
    try {
      // Main difference: Use MainButton on macOS instead of immediate sendData
      if (navigator.platform === "MacIntel") {
        tg.MainButton.setText("Processing...").show();
        await new Promise(resolve => setTimeout(resolve, 300)); // Small delay
        
        tg.sendData(JSON.stringify({ command: "hello" }));
        
        // Keep WebApp open for 1.5s so user sees feedback
        setTimeout(() => {
          tg.MainButton.hide();
          setIsSending(false);
        }, 1500);
      } else {
        // Normal mobile behavior
        tg.sendData(JSON.stringify({ command: "hello" }));
        setIsSending(false);
      }
    } catch (error) {
      console.error("Send error:", error);
      setIsSending(false);
      tg.MainButton.hide();
    }
  };

  return (
    <div style={{
      padding: 20,
      fontFamily: 'system-ui',
      maxWidth: '100%',
      boxSizing: 'border-box'
    }}>
      <h1>Telegram WebApp Demo</h1>
      <button
        onClick={sendToBot}
        disabled={isSending}
        style={{
          background: isSending ? '#5cb85c' : '#0088cc',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
      >
        {isSending ? 'Sending...' : 'Send Data'}
      </button>
      
      {navigator.platform === "MacIntel" && (
        <p style={{
          marginTop: '20px',
          color: '#666',
          fontSize: '14px'
        }}>
          Note: On macOS, the app will stay open after sending.
        </p>
      )}
    </div>
  );
}

export default App;