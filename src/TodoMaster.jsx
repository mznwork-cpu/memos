import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function TodoMaster() {

  // ===============================
  // ■ State定義
  // ===============================

  // Todoマスタ一覧（type=2のみ）
  const [items, setItems] = useState([]);

  // 新規登録フォーム
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  // 既存カテゴリ一覧（入力補助用）
  const [categories, setCategories] = useState([]);

  // 編集状態管理
  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editName, setEditName] = useState("");

  // ===============================
  // ■ 初期ロード
  // ===============================
  // 初回表示時にTodoマスタを取得
  useEffect(() => {
    loadItems();
  }, []);

  // ===============================
  // ■ データ取得
  // ===============================
  // type=2（Todo）だけ取得
  const loadItems = async () => {

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("type", 2) // ← Todoのみ
      .order("category")
      .order("name");

    setItems(data || []);

    // カテゴリ候補生成（重複除去）
    // → datalist（コンボボックス）の候補用
    const uniqueCategories = [
      ...new Set(
        (data || [])
          .map(i => i.category)
          .filter(Boolean)
      )
    ];

    setCategories(uniqueCategories);
  };

  // ===============================
  // ■ 追加処理
  // ===============================
  const addItem = async () => {

    // 名前ない場合登録しない（最低条件）
    if (!name) return;

    await supabase.from("items").insert([
      {
        name,
        category,
        note,
        type: 2  // ← Todo区分
      }
    ]);

    // 入力リセット（UX）
    setCategory("");
    setName("");
    setNote("");

    // 再読み込み（一覧更新）
    loadItems();
  };

  // ===============================
  // ■ 実行対象チェック
  // ===============================
  // checked=true → Todo画面に表示される
  const toggleCheck = async (item) => {

    await supabase
      .from("items")
      .update({
        checked: !item.checked
      })
      .eq("id", item.id);

    loadItems();
  };

  // ===============================
  // ■ 編集開始
  // ===============================
  // → 既存データを編集用stateへコピー
  const startEdit = (item) => {

    setEditingId(item.id);

    // null考慮（空文字で安全に）
    setEditCategory(item.category || "");
    setEditName(item.name || "");
  };

  // ===============================
  // ■ 編集保存
  // ===============================
  const saveEdit = async (item) => {

    await supabase
      .from("items")
      .update({
        category: editCategory,
        name: editName
      })
      .eq("id", item.id);

    // 編集状態解除
    setEditingId(null);

    // 再読み込み
    loadItems();
  };

  // ===============================
  // ■ UI
  // ===============================
  return (
    <div>

      <h1>やることマスタ</h1>

      {/* ===== 新規登録フォーム ===== */}
      <div className="card">

        {/* カテゴリ（入力＋候補） */}
        <input
          list="category-list-todo"
          placeholder="分類"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* 候補（コンボボックス） */}
        <datalist id="category-list-todo">
          {categories.map((c, i) => (
            <option key={i} value={c} />
          ))}
        </datalist>

        {/* タスク名 */}
        <input
          placeholder="やること"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 備考 */}
        <input
          placeholder="備考"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button onClick={addItem}>追加</button>

      </div>

      {/* ===== 一覧 ===== */}
      {items.map(item => (
        <div className="card" key={item.id}>

          <div className="row-top">

            {/* 実行対象チェック */}
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleCheck(item)}
            />

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
                </>
              )}

            </div>

            {/* 編集ボタン */}
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