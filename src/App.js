import React, { useEffect, useState, useRef } from "react";

function App() {
  const [tg, setTg] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const isMac = useRef(navigator.platform === "MacIntel");

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      webApp.ready();
      setTg(webApp);
      webApp.expand();

      // Critical macOS-specific initialization
      if (isMac.current) {
        webApp.enableClosingConfirmation();
        webApp.MainButton.setText("Processing...");
        webApp.MainButton.onClick(handleMainButtonClick);
        console.log("Initialized macOS protections");
      }
    }

    return () => {
      // Cleanup
      if (tg?.MainButton) {
        tg.MainButton.offClick(handleMainButtonClick);
      }
    };
  }, []);

  const handleMainButtonClick = () => {
    if (!tg) return;
    sendDataToBot();
  };

  const sendDataToBot = () => {
    console.log("Sending data...");
    tg.sendData(JSON.stringify({ 
      command: "message",
      text: "Hello from WebApp",
      platform: isMac.current ? "macOS" : "mobile"
    }));
  };

  const sendToBot = () => {
    if (!tg || isSending) return;
    setIsSending(true);

    if (isMac.current) {
      // macOS workaround - use MainButton flow
      tg.MainButton.show();
      tg.MainButton.setParams({ is_active: true, is_visible: true });
    } else {
      // Mobile - direct send
      sendDataToBot();
      setIsSending(false);
    }
  };

  return (
    <div style={{
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      textAlign: "center"
    }}>
      <h1>Telegram WebApp Demo</h1>
      <button
        onClick={sendToBot}
        disabled={isSending}
        style={{
          backgroundColor: isSending ? "#4CAF50" : "#0088CC",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease"
        }}
      >
        {isSending ? "Sending..." : "Send Message"}
      </button>

      {isMac.current && (
        <p style={{
          marginTop: "20px",
          color: "#666",
          fontSize: "14px"
        }}>
          On macOS: Click will show MainButton. Press it to send.
        </p>
      )}
    </div>
  );
}

export default App;