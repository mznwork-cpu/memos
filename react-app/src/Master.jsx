// Reactの状態管理と初期処理
import { useState, useEffect } from "react";

// Supabase接続
import { supabase } from "./supabase";

function Master() {

  // 商品一覧
  const [items, setItems] = useState([]);

  // 新規入力
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  // 編集用
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // 初回データ取得
  useEffect(() => {
    loadItems();
  }, []);

  // 商品一覧取得
  const loadItems = async () => {
    const { data } = await supabase
      .from("items")
      .select("*")
      .order("category")
      .order("name");

    setItems(data || []);
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

    // 入力初期化
    setName("");
    setCategory("");
    setPrice("");
    setNote("");

    loadItems();
  };

  // チェックON/OFF（買物対象）
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
    setEditName(item.name);
    setEditCategory(item.category);
  };

  // 編集保存
  const saveEdit = async (item) => {
    await supabase
      .from("items")
      .update({
        name: editName,
        category: editCategory
      })
      .eq("id", item.id);

    setEditingId(null);
    loadItems();
  };

  return (
    <div>

      <h1>商品マスタ</h1>

      {/* 入力フォーム */}
      <div>
        <input placeholder="分類" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="商品名" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="単価" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="備考" value={note} onChange={(e) => setNote(e.target.value)} />
        <button onClick={addItem}>追加</button>
      </div>

      <hr />

      {/* 一覧 */}
      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 12 }}>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

              {/* チェック */}
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleCheck(item)}
              />

              {/* 中央 */}
              <div style={{ flex: 1 }}>
                {editingId === item.id ? (
                  // 編集モード
                  <>
                    <input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <button onClick={() => saveEdit(item)}>保存</button>
                  </>
                ) : (
                  // 表示モード
                  <>
                    <div>{item.category} / {item.name}</div>
                    <div>{item.last_price || "-"} 円 / {item.last_purchased_date || "-"}</div>
                    <div style={{ fontSize: 12 }}>{item.note}</div>
                  </>
                )}
              </div>

              {/* 編集ボタン */}
              {editingId !== item.id && (
                <button onClick={() => startEdit(item)}>編集</button>
              )}

            </div>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default Master;