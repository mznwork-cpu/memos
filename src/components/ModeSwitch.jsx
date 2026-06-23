// 買物 / Todo の切替ボタン
function ModeSwitch({ mode, setMode }) {

  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>

      <button
        onClick={() => setMode("shopping")}
        style={{
          flex: 1,
          backgroundColor: mode === "shopping" ? "#4cafef" : "#ccc"
        }}
      >
        買物
      </button>

      <button
        onClick={() => setMode("todo")}
        style={{
          flex: 1,
          backgroundColor: mode === "todo" ? "#4cafef" : "#ccc"
        }}
      >
        Todo
      </button>

    </div>
  );
}

export default ModeSwitch;