// Reactのstateを使う
import { useState } from "react";

// 各画面を読み込む
import Master from "./Master";
import Shopping from "./Shopping12";
import History from "./History";

function App() {

  // 現在表示する画面（master / shopping / history）
  const [screen, setScreen] = useState("master");

  return (
    <div style={{ padding: 20 }}>

      {/* 画面切替ボタン */}
      <div>
        <button onClick={() => setScreen("master")}>商品マスタ</button>
        <button onClick={() => setScreen("shopping")}>買物リスト</button>
        <button onClick={() => setScreen("history")}>履歴</button>
      </div>

      {/* 画面表示 */}
      {screen === "master" && <Master />}
      {screen === "shopping" && <Shopping />}
      {screen === "history" && <History />}

    </div>
  );
}

export default App;