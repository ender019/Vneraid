import React, { useEffect, useState } from "react";

function App() {
  const [tg, setTg] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      webApp.ready();
      setTg(webApp);
      webApp.expand(); // Expand once on init
      
      // Handle platform-specific behaviors
      if (navigator.platform === "MacIntel") {
        console.log("Running on macOS - applying workarounds");
        // Additional macOS-specific initialization if needed
      }
    }
  }, []);

  const sendToBot = () => {
    if (!tg) {
      alert("Telegram WebApp not available");
      return;
    }

    console.log("Sending data to bot");
    setIsSending(true);
    
    // Send data to bot
    tg.sendData("Hello from React Mini App!");
    
    // On macOS, don't close immediately - let user see feedback
    setTimeout(() => {
      setIsSending(false);
      // Only close if you really want to
      // tg.close(); // Remove this line to prevent closing
    }, 1000);
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Telegram Mini App Test</h1>
      <button
        onClick={sendToBot}
        disabled={isSending}
        style={{
          backgroundColor: isSending ? "green" : "#0088cc",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          opacity: isSending ? 0.8 : 1,
        }}
      >
        {isSending ? "Sending..." : "Send Message to Bot"}
      </button>
      
      {navigator.platform === "MacIntel" && (
        <p style={{ color: "#666", fontSize: "0.8rem", marginTop: "10px" }}>
          macOS user detected - special handling applied
        </p>
      )}
    </div>
  );
}

export default App;