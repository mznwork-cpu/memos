// TODO: executeAllにloading制御追加
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { getUniqueCategories } from "../utils/utils";

function Master() {

  // ===============================
  // ■ State定義
  // ===============================


  // 商品一覧（type=1：買物のみ）
  const [items, setItems] = useState([]);

  // 分類の検索値
  const [seachCategory, setSachCategory] = useState("");
  
  // 新規登録フォームの入力値
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  // 既存カテゴリ一覧（重複なしで生成）
  const [categories, setCategories] = useState([]);

  // 編集状態管理
  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editName, setEditName] = useState("");

  // 初回表示時にデータ取得
  useEffect(() => {
    loadItems();
  }, []);

  // 商品一覧取得（買物データのみ）
  const loadItems = async () => {

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("type", 1)               // type=1：買物データ
      .order("category")
      .order("name");

    setItems(data || []);

    // カテゴリ候補を生成（重複除去）
    // 入力補助（コンボボックス）用
    const uniqueCategories = getUniqueCategories(data)
    setCategories(uniqueCategories);
  };

  // 表示切替★これまだ未使用
  const [seach, setSeach] = useState({});

  // 商品追加処理
  const addItem = async () => {

    // 商品名が空なら登録しない
    if (!name) return;

    await supabase.from("items").insert([
      {
        name,
        category,
        last_price: price || null, // 初回価格として登録
        note,
        type: 1                     // 買物データとして登録
      }
    ]);

    // 入力リセット
    setCategory("");
    setName("");
    setPrice("");
    setNote("");

    // 再読み込み（一覧更新）
    loadItems();
  };

  // 買物対象チェック切替
  // → チェックすると買物リストに表示される
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
  // → 編集用stateに値をコピー
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

    // 編集モード解除
    setEditingId(null);

    loadItems();
  };

  // ===============================
  // ■ UI画面
  // ===============================
  return (
    <div>
      {/* <h1 className={"page-title shopping"}>商品リスト</h1> */}
      {/* 画面本体 */}
      {/* 上部固定 */}
      <div className="sub-header-fixed">
        {/* 検索領域 */}
        <div className="header-search">
          {/* 検索用カテゴリ */}
          <button onClick={() => setSeach(v => !v)} className="btn-seach">
            検索
          </button>
          <input
            list="category-list"
            clanssName="category"

          />
          まだできない
        </div>
      </div>
      {/* ===== 新規登録フォーム ===== */}
      <div className="card">

        {/* カテゴリ（入力＋候補選択） */}
        <input
          list="category-list"
          className="category"
          placeholder="分類"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* カテゴリ候補（datalist） */}
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
          className="price"
          type="number"
          placeholder="単価"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* 備考 */}
        <input
          placeholder="備考"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button onClick={addItem}>追加</button>

      </div>

      {/* ===== 商品一覧 ===== */}
      {items.map((item) => (
        <div className="card" key={item.id}>

          <div className="row-top">

            {/* チェック：買物対象 */}
            <input
              type="checkbox"
              className="checkbox-large"
              checked={item.checked}
              onChange={() => toggleCheck(item)}
            />

            {/* 商品情報表示 */}
            <div style={{ flex: 1, textAlign: "left" }}>

              {editingId === item.id ? (
                <>
                  {/* === 編集モード === */}

                  <input
                    list="category-list"
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
                  {/* === 通常表示 === */}

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
