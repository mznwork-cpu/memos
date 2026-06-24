// ========================================
// ■ ScreenTabsコンポーネント
// ========================================
// 各機能内の画面切替（master / list / history）
//
// 設計ポイント：
// ・ModeSwitchと同じボタンスタイルを使う
// ・modeごとに色が変わる（UI統一）
// ・選択状態はactiveで制御
// ========================================
function ScreenTabs({ screen, setScreen, mode }) {

  // modeごとのクラスを先に決める
  // → JSXをシンプルにするため
  const modeClass =
    mode === "shopping"
      ? "mode-button-shopping"
      : "mode-button-todo";

  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>

      {/* ===== マスタ ===== */}
      <button
        onClick={() => setScreen("master")}
        className={`mode-button ${modeClass} ${
          screen === "master" ? "active" : ""
        }`}
      >
        {mode === "shopping" ? "商品" : "やること"}
      </button>


      {/* ===== リスト ===== */}
      <button
        onClick={() => setScreen("list")}
        className={`mode-button ${modeClass} ${
          screen === "list" ? "active" : ""
        }`}
      >
        {mode === "shopping" ? "買物リスト" : "Todo"}
      </button>


      {/* ===== 履歴 ===== */}
      <button
        onClick={() => setScreen("history")}
        className={`mode-button ${modeClass} ${
          screen === "history" ? "active" : ""
        }`}
      >
        {mode === "shopping" ? "購入履歴" : "履歴"}
      </button>

    </div>
  );
}

export default ScreenTabs;
``