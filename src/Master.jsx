// Reactの状態管理
import { useState, useEffect } from "react";

// Supabase接続
import { supabase } from "./supabase";

function Master() {

  // 商品一覧
  const [items, setItems] = useState([]);

  // 入力（新規追加）
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  // カテゴリ候補（重複なし）
  const [categories, setCategories] = useState([]);

  // 編集用
  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editName, setEditName] = useState("");

  // 初回ロード
  useEffect(() => {
    loadItems();
  }, []);

  // 商品取得＋カテゴリ一覧生成
  const loadItems = async () => {

    const { data } = await supabase
      .from("items")
      .select("*")
      .order("category")
      .order("name");

    setItems(data || []);

    // カテゴリ一覧（重複除去）
    const uniqueCategories = [
      ...new Set(
        (data || [])
          .map(i => i.category)
          .filter(Boolean)
      )
    ];

    setCategories(uniqueCategories);
  };

  // 商品追加
  const addItem = async () => {

    if (!name) return;

    await supabase.from("items").insert([
      {
        name,
        category,
        last_price: price || null,
        note
      }
    ]);

    // 入力リセット
    setCategory("");
    setName("");
    setPrice("");
    setNote("");

    loadItems();
  };

  // チェック切替
  const toggleCheck = async (item) => {

    await supabase
      .from("items")
      .update({ checked: !item.checked })
      .eq("id", item.id);

    loadItems();
  };

  // 編集開始
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditCategory(item.category || "");
    setEditName(item.name || "");
  };

  // 編集保存
  const saveEdit = async (item) => {

    await supabase
      .from("items")
      .update({
        category: editCategory,
        name: editName
      })
      .eq("id", item.id);

    setEditingId(null);
    loadItems();
  };

  return (
    <div>

      <h1>商品リスト</h1>

      {/* ===== 追加フォーム ===== */}
      <div className="card">

        {/* カテゴリ（入力＋候補） */}
        <input
          list="category-list"
          placeholder="分類"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* datalist（候補） */}
        <datalist id="category-list">
          {categories.map((c, i) => (
            <option key={i} value={c} />
          ))}
        </datalist>

        {/* 商品名 */}
        <input
          placeholder="商品名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 単価 */}
        <input
          placeholder="単価"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* 備考 */}
        <input
          placeholder="備考"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button onClick={addItem}>
          追加
        </button>

      </div>

      {/* ===== 一覧 ===== */}
      {items.map((item) => (
        <div className="card" key={item.id}>

          <div className="row-top">

            {/* 買物チェック */}
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleCheck(item)}
            />

            <div style={{ flex: 1, textAlign: "left" }}>

              {editingId === item.id ? (
                <>
                  {/* ===== 編集モード ===== */}

                  {/* カテゴリ編集（コンボボックス） */}
                  <input
                    list="category-list"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  />

                  {/* 商品名編集 */}
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
                    {item.last_price || "-"} 円 / {item.last_purchased_date || "-"}
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

export default Master;
``