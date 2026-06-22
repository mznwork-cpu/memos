import { useState } from "react";
import "./App.css";

import Master from "./Master";
import Shopping from "./Shopping";
import History from "./History";

function App() {

  const [screen, setScreen] = useState("master");

  return (
    <div className="container">

      <div className="header">
        <button onClick={() => setScreen("master")}>商品</button>
        <button onClick={() => setScreen("shopping")}>買物</button>
        <button onClick={() => setScreen("history")}>履歴</button>
      </div>

      {screen === "master" && <Master />}
      {screen === "shopping" && <Shopping />}
      {screen === "history" && <History />}

    </div>
  );
}

export default App;