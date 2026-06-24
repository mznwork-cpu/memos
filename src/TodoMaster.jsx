import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function TodoMaster() {

  // ===============================
  // ■ State定義
  // ===============================

  // Todoマスタ一覧（type=2 = Todoデータのみ保持）
  const [items, setItems] = useState([]);

  // 新規登録フォーム入力値
  const [category, setCategory] = useState("");   // 分類
  const [name, setName] = useState("");           // タスク名（必須）
  const [refdate, setRefDate] = useState("");     // 基準日数（DBではlast_priceカラムを流用）
  const [note, setNote] = useState("");           // 備考

  // 入力補助用カテゴリ一覧（datalist用）
  const [categories, setCategories] = useState([]);

  // 編集状態管理
  const [editingId, setEditingId] = useState(null);   // 編集中のID
  const [editCategory, setEditCategory] = useState("");
  const [editName, setEditName] = useState("");
  const [editRefDate, setEditRefDate] = useState("");

  // ===============================
  // ■ 初期ロード
  // ===============================
  // 初回レンダリング時にデータ取得
  useEffect(() => {
    loadItems();
  }, []);

  // ===============================
  // ■ データ取得処理
  // ===============================
  // SupabaseからTodoマスタ（type=2のみ）取得
  const loadItems = async () => {

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("type", 2)            // Todoデータのみ取得
      .order("category")        // カテゴリ順
      .order("name");           // 名前順

    // 一覧データ更新（null対策）
    setItems(data || []);

    // カテゴリ候補を生成（重複排除）
    // → datalistに表示して入力補助する
    const uniqueCategories = [
      ...new Set(
        (data || [])
          .map(i => i.category)
          .filter(Boolean)   // null/空を除外
      )
    ];

    setCategories(uniqueCategories);
  };

  // ===============================
  // ■ 新規追加処理
  // ===============================
  const addItem = async () => {

    // タスク名が空の場合は登録しない（最低限バリデーション）
    if (!name) return;

    await supabase.from("items").insert([
      {
        name,
        category,
        last_price: refdate || null, // 基準日数として保存（NULL許容）
        note,
        type: 2  // Todo区分
      }
    ]);

    // 入力フォームをリセット（UX向上）
    setCategory("");
    setName("");
    setRefDate("");
    setNote("");

    // 最新データを再取得
    loadItems();
  };

  // ===============================
  // ■ 編集開始
  // ===============================
  // 対象データを編集用stateにコピー
  const startEdit = (item) => {

    setEditingId(item.id);

    // null対策：未設定値は空文字に変換
    setEditCategory(item.category || "");
    setEditName(item.name || "");
    setEditRefDate(item.last_price || "");
  };

  // ===============================
  // ■ 編集保存
  // ===============================
  const saveEdit = async (item) => {

    await supabase
      .from("items")
      .update({
        category: editCategory,
        name: editName,
        last_price: editRefDate, // 基準日数
      })
      .eq("id", item.id);

    // 編集モード解除
    setEditingId(null);

    // データ再読み込み
    loadItems();
  };

  // ===============================
  // ■ UI
  // ===============================
  return (
    <div>

      <h1 className={"page-title todo"}>やること</h1>

      {/* ===== 新規登録フォーム ===== */}
      <div className="card">

        {/* カテゴリ入力（datalistで候補表示） */}
        <input
          list="category-list-todo"
          placeholder="分類"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* カテゴリ候補リスト */}
        <datalist id="category-list-todo">
          {categories.map((c, i) => (
            <option key={i} value={c} />
          ))}
        </datalist>

        {/* タスク名（必須） */}
        <input
          placeholder="やること"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 基準日数（数値入力） */}
        <input
          type="number"
          placeholder="基準日数"
          value={refdate}
          onChange={(e) => setRefDate(e.target.value)}
        />

        {/* 備考 */}
        <input
          placeholder="備考"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button onClick={addItem}>追加</button>

      </div>

      {/* ===== 一覧表示 ===== */}
      {items.map(item => (
        <div className="card" key={item.id}>

          <div className="row-top">

            <div style={{ flex: 1, textAlign: "left" }}>

              {editingId === item.id ? (
                <>
                  {/* ===== 編集モード ===== */}

                  <input
                    list="category-list-todo"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  />

                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <input
                    type="number"
                    value={editRefDate}
                    onChange={(e) => setEditRefDate(e.target.value)}
                  />

                  <button onClick={() => saveEdit(item)}>
                    保存
                  </button>

                </>
              ) : (
                <>
                  {/* ===== 表示モード ===== */}

                  <div className="name">
                    {item.category} / {item.name}
                  </div>

                  <div className="sub">
                    {item.note}
                  </div>

                  <div className="sub">
                    基準日数：{item.last_price || "-"}
                  </div>
                </>
              )}

            </div>

            {/* 編集ボタン（編集中は非表示） */}
            {editingId !== item.id && (
              <button onClick={() => startEdit(item)}>
                編集
              </button>
            )}

          </div>

        </div>
      ))}

    </div>
  );
}

export default TodoMaster;