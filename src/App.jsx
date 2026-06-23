import { useState } from "react";
import "./App.css";

// 共通UIコンポーネント
import ModeSwitch from "./components/ModeSwitch";
import ScreenTabs from "./components/ScreenTabs";

// 買物系
import Master from "./Master";
import Shopping from "./Shopping";
import History from "./History";

// Todo系
import TodoMaster from "./TodoMaster";
import TodoList from "./TodoList";
import TodoHistory from "./TodoHistory";

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
      {/* 
        ModeSwitch：機能単位の切替（買物 / Todo）
        ScreenTabs：画面単位の切替（マスタ / リスト / 履歴）

        → この2つは「画面全体に影響するため最上位に配置」
        → stickyで固定する想定
      */}
      <div className="header-fixed">

        <ModeSwitch
          mode={mode}
          setMode={setMode}
        />

        <ScreenTabs
          screen={screen}
          setScreen={setScreen}
          mode={mode}
        />

      </div>

      {/* ===== メイン表示領域 ===== */}
      {/* 
        mode と screen の組み合わせで表示するコンポーネントを切替

        例：
        mode="shopping" + screen="list"
        → 買物リスト表示

        mode="todo" + screen="master"
        → Todoマスタ表示
      */}

      {/* ===============================
          ■ 買物モード
      =============================== */}
      {mode === "shopping" && (
        <>
          {/* 商品マスタ */}
          {screen === "master" && <Master />}

          {/* 買物リスト */}
          {screen === "list" && <Shopping />}

          {/* 購入履歴 */}
          {screen === "history" && <History />}
        </>
      )}

      {/* ===============================
          ■ Todoモード
      =============================== */}
      {mode === "todo" && (
        <>
          {/* やることマスタ */}
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
``