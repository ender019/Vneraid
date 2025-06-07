import React, { useEffect, useState } from "react";

function App() {
  const [tg, setTg] = useState(null);

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (webApp) {
      webApp.ready(); // Inform Telegram the app is ready
      setTg(webApp);
    }
  }, []);

  const sendToBot = () => {
    if (tg) {
      tg.sendData("Hello from React Mini App!");
    } else {
      alert("Telegram WebApp not available");
    }
  };

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Hello, Telegram!</h1>
      <button onClick={sendToBot}>Send Message to Bot</button>
    </div>
  );
}

export default App;
