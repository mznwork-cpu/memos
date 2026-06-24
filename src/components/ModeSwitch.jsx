// ========================================
// ■ ModeSwitchコンポーネント
// ========================================
// 「買物」／「Todo」の大分類（機能）を切り替えるUI
//
// 設計ポイント：
// ・状態は持たない（Appから受け取る）
// ・スタイルはCSSに完全分離
// ・選択状態は「activeクラス」で制御
// ========================================
function ModeSwitch({ mode, setMode }) {

  return (
    // 横並びレイアウト
    // ※ 見た目は今は軽くstyleで維持（ここは後でCSS化してもOK）
    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>

      {/* ===== 買物モード ===== */}
      <button
        // モード切替処理
        onClick={() => setMode("shopping")}

        // クラス構成：
        // mode-button（共通）
        // mode-button-shopping（買物用）
        // active（選択状態）
        className={`mode-button mode-button-shopping ${
          mode === "shopping" ? "active" : ""
        }`}
      >
        買物
      </button>

      {/* ===== Todoモード ===== */}
      <button
        onClick={() => setMode("todo")}

        // active付与ロジックは同じ
        className={`mode-button mode-button-todo ${
          mode === "todo" ? "active" : ""
        }`}
      >
        Todo
      </button>

    </div>
  );
}

export default ModeSwitch;
``