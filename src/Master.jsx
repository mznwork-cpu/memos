// Reactの状態管理
import { useState, useEffect } from "react";

// Supabase接続
import { supabase } from "./supabase";

function Master() {

  // 商品一覧
  const [items, setItems] = useState([]);

  // 入力値
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  // カテゴリ候補
  const [categories, setCategories] = useState([]);

  // 編集用
  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editName, setEditName] = useState("");

  // 初回ロード
  useEffect(() => {
    loadItems();
  }, []);

  // 商品取得＋カテゴリ一覧作成
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

    await supabase
      .from("items")
      .insert([
        {
          name,
          category,
          last_price: price || null,
          note
        }
      ]);

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
      .update({
        checked: !item.checked
      })
      .eq("id", item.id);

    loadItems();
  };

  // 編集開始
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditCategory(item.category);
    setEditName(item.name);
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

      {/* 入力フォーム */}
      <div className="card">

        {/* カテゴリ入力＋候補 */}
        <div style={{ position: "relative" }}>

          <input
            placeholder="分類"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {category && (
            <div style={{
              position: "absolute",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "100%",
              marginTop: 2
            }}>
              {categories
                .filter(c => c.includes(category))
                .slice(0, 5)
                .map((c, i) => (
                  <div
                    key={i}
                    style={{ padding: "8px", cursor: "pointer" }}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </div>
                ))
              }
            </div>
          )}

        </div>

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

      {/* 商品一覧 */}
      {items.map((item) => (
        <div className="card" key={item.id}>

          <div className="row-top">

            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleCheck(item)}
            />

            <div style={{ flex: 1, textAlign: "left" }}>

              {editingId === item.id ? (
                <>
                  {/* 編集モード */}
                  <input
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
                  {/* 表示モード */}
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