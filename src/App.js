import React from 'react';

function App() {
  const tg = window.Telegram?.WebApp;

  const sendToBot = () => {
    tg?.sendData("Hello from React!");
  };

  return (
    <div className="App">
      <h1>Hello, Telegram!</h1>
      <button onClick={sendToBot}>Send to Bot</button>
    </div>
  );
}

export default App;
