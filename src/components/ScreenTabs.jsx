// 画面タブ（商品 / リスト / 履歴）
function ScreenTabs({ screen, setScreen, mode }) {

  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>

      <button
        onClick={() => setScreen("master")}
        style={{
          flex: 1,
          backgroundColor: screen === "master" ? "#4cafef" : "#ccc"
        }}
      >
        {mode === "shopping" ? "商品" : "やること"}
      </button>

      <button
        onClick={() => setScreen("list")}
        style={{
          flex: 1,
          backgroundColor: screen === "list" ? "#4cafef" : "#ccc"
        }}
      >
        {mode === "shopping" ? "買物リスト" : "Todo"}
      </button>

      <button
        onClick={() => setScreen("history")}
        style={{
          flex: 1,
          backgroundColor: screen === "history" ? "#4cafef" : "#ccc"
        }}
      >
        {mode === "shopping" ? "購入履歴" : "履歴"}
      </button>

    </div>
  );
}

export default ScreenTabs;