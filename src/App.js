import React, { useEffect, useState } from "react";

function App() {
  const [tg, setTg] = useState(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    if (window.Telegram) {
      const webApp = window.Telegram.WebApp;

      if (webApp) {
        webApp.ready();
        setTg(webApp);
        webApp.expand();  // Ensure WebApp doesn't collapse

        console.log("Telegram WebApp is ready");
      } else {
        console.log("Telegram WebApp is not available");
      }
    } else {
      console.log("Telegram SDK is not loaded");
    }
  }, []);


  const sendToBot = () => {
    console.log("Button clicked!");

    if (tg) {
      setIsButtonClicked(true);
      tg.sendData("Hello from React Mini App!");

      console.log("Data sent to Telegram bot:", "Hello from React Mini App!");

      // After sending data, manually close the WebApp if needed (optional)
      tg.close();  // Optional: Can help in preventing unexpected closing behavior

      // Ensure the WebApp remains expanded after sending data
      tg.expand();

      setTimeout(() => setIsButtonClicked(false), 500);
    } else {
      alert("Telegram WebApp not available");
    }
  };



  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Hello, Telegram!</h1>
      <button
        onClick={sendToBot}
        style={{
          backgroundColor: isButtonClicked ? "green" : "blue", // Feedback: Change color on click
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isButtonClicked ? "Sending..." : "Send Message to Bot"}
      </button>
    </div>
  );
}

export default App;
