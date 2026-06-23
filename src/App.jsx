import { useState } from "react";
import "./App.css";

// コンポーネント
import ModeSwitch from "./components/ModeSwitch";
import ScreenTabs from "./components/ScreenTabs";

// 既存画面
import Master from "./Master";
import Shopping from "./Shopping";
import History from "./History";

function App() {

  // モード（買物 / Todo）
  const [mode, setMode] = useState("shopping");

  // 画面（master / list / history）
  const [screen, setScreen] = useState("list");

  return (
    <div className="container">

      {/* モード切替 */}
      <ModeSwitch mode={mode} setMode={setMode} />

      {/* タブ */}
      <ScreenTabs
        screen={screen}
        setScreen={setScreen}
        mode={mode}
      />

      {/* 画面表示 */}
      {mode === "shopping" && (
        <>
          {screen === "master" && <Master />}
          {screen === "list" && <Shopping />}
          {screen === "history" && <History />}
        </>
      )}

      {/* Todoは仮（あとで作る） */}
      {mode === "todo" && (
        <div>
          Todo機能はこれから作成
        </div>
      )}

    </div>
  );
}

export default App;