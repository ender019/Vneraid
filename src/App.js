import React, { useEffect, useState } from "react";

function App() {
  const [tg, setTg] = useState(null);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      webApp.ready(); // Inform Telegram the app is ready
      setTg(webApp);
      webApp.expand(); // Ensure WebApp stays open
    }
  }, []);

  const sendToBot = () => {
    if (tg) {
      // Use Telegram method correctly to prevent the app from collapsing
      tg.sendData("Hello from React Mini App!");
      // Keep app open by forcing Telegram to expand, just in case
      tg.expand();
    } else {
      alert("Telegram WebApp not available");
    }
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>test</h1>
      <button onClick={sendToBot}>Send Message to Bot</button>
    </div>
  );
}

export default App;
