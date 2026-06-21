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

  // カテゴリ候補一覧
  const [categories, setCategories] = useState([]);

  // 初回ロード
  useEffect(() => {
    loadItems();
  }, []);

  // 商品一覧取得＋カテゴリ一覧作成
  const loadItems = async () => {

    const { data } = await supabase
      .from("items")
      .select("*")
      .order("category")
      .order("name");

    setItems(data || []);

    // カテゴリ一覧を作成（重複除去）
    const uniqueCategories = [
      ...new Set((data || [])
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

    // 入力リセット
    setCategory("");
    setName("");
    setPrice("");
    setNote("");

    loadItems();
  };

  // チェック切替（買物対象）
  const toggleCheck = async (item) => {

    await supabase
      .from("items")
      .update({
        checked: !item.checked
      })
      .eq("id", item.id);

    loadItems();
  };

  return (
    <div>

      <h1>商品マスタ</h1>

      {/* 入力フォーム */}
      <div className="card">

        {/* カテゴリ入力＋候補 */}
        <div style={{ position: "relative" }}>

          <input
            placeholder="分類"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* 候補表示（入力値に応じて絞り込み） */}
          {category && (
            <div style={{
              position: "absolute",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "100%",
              marginTop: 2,
              zIndex: 10
            }}>
              {categories
                .filter(c => c.includes(category))
                .slice(0, 5) // 最大5件表示
                .map((c, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "8px",
                      cursor: "pointer"
                    }}
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

      {/* 一覧 */}
      {items.map((item) => (
        <div className="card" key={item.id}>

          {/* 上段 */}
          <div className="row-top">

            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleCheck(item)}
            />

            <div className="name">
              {item.category} / {item.name}
            </div>

          </div>

          {/* 下段情報 */}
          <div className="sub">
            {item.last_price || "-"} 円 / {item.last_purchased_date || "-"}
          </div>

          <div className="sub">
            {item.note}
          </div>

        </div>
      ))}

    </div>
  );
}

export default Master;