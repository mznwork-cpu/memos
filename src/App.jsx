import { useState } from "react";

// CSSのimport
import "./styles/layout.css";
import "./styles/content.css";
import "./styles/button.css";
import "./styles/form.css";
import "./styles/card.css";
import "./styles/text.css";
import "./styles/toast.css";
import "./styles/loading.css";

// 共通UIコンポーネント
import ModeSwitch from "./components/ModeSwitch";
import ScreenTabs from "./components/ScreenTabs";

// 買物系
import Master from "./pages/Master";
import Shopping from "./pages/Shopping";
import History from "./pages/History";

// Todo系
import TodoMaster from "./pages/TodoMaster";
import TodoList from "./pages/TodoList";
import TodoHistory from "./pages/TodoHistory";

function App() {

  // ===============================
  // ■ 状態管理（アプリ全体の司令塔）
  // ===============================

  // 「買物」 or 「Todo」
  // → 上位の大分類（機能の切替）
  const [mode, setMode] = useState("shopping");

  // 現在表示している画面
  // master：マスタ
  // list：実行画面
  // history：履歴
  const [screen, setScreen] = useState("list");

  // ===============================
  // ■ UI
  // ===============================
  return (
    <div className="container">

      {/* ===== ヘッダ（常に表示するUI） ===== */}
      <div className="header-fixed"> 
        {/* モード切替ボタン */}
        <ModeSwitch
          mode={mode}
          setMode={setMode}
        />
        {/* 画面切替タブ */}
        <ScreenTabs
          screen={screen}
          setScreen={setScreen}
          mode={mode}
        />
      </div>

      {/* ===== メイン表示領域 ===== */}
      {/* ■ 買物モード */}
      {mode === "shopping" && (
        <>
          {/* 商品リスト */}
          {screen === "master" && <Master />}

          {/* 買物リスト */}
          {screen === "list" && <Shopping />}

          {/* 購入履歴 */}
          {screen === "history" && <History />}
        </>
      )}

      {/* ■ Todoモード */}
      {mode === "todo" && (
        <>
          {/* やることリスト */}
          {screen === "master" && <TodoMaster />}

          {/* 実行画面 */}
          {screen === "list" && <TodoList />}

          {/* 実行履歴 */}
          {screen === "history" && <TodoHistory />}
        </>
      )}

    </div>
  );
}

export default App;