import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function History() {

  const [histories, setHistories] = useState([]);

  // 検索条件（初期値：7日前〜今日）
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString().slice(0, 10);

  const [fromDate, setFromDate] = useState(sevenDaysAgo);
  const [toDate, setToDate] = useState(today);

  // 編集状態
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  // 履歴取得（期間指定）
  const loadHistory = async () => {

    let query = supabase
      .from("v_purchase_history")
      .select("*")
      .gte("purchased_date", fromDate)
      .lte("purchased_date", toDate)
      .order("purchased_date", { ascending: false });

    const { data } = await query;

    setHistories(data || []);
  };

  // 編集開始
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditPrice(item.price);
    setEditDate(item.purchased_date);
  };

  // 編集保存
  const saveEdit = async (item) => {

    await supabase
      .from("purchase_history")
      .update({
        price: editPrice,
        purchased_date: editDate
      })
      .eq("id", item.id);

    setEditingId(null);
    loadHistory();
  };

  // 削除
  const deleteItem = async (id) => {

    await supabase
      .from("purchase_history")
      .delete()
      .eq("id", id);

    loadHistory();
  };

  return (
    <div>

      <h1>購入履歴</h1>

      {/* 検索 */}
      <div className="card">

        <div>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button onClick={loadHistory}>
          検索
        </button>

      </div>

      {/* 一覧 */}
      {histories.map((h) => (
        <div className="card" key={h.id}>

          {editingId === h.id ? (
            <>
              {/* 編集モード */}

              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />

              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
              />

              <button onClick={() => saveEdit(h)}>
                保存
              </button>

            </>
          ) : (
            <>
              {/* 表示モード */}

              <div className="sub">
                {h.purchased_date}
              </div>

              <div className="name">
                {h.category} / {h.name}
              </div>

              <div>
                {h.price} 円
              </div>

              <div className="sub">
                {h.note}
              </div>

              <button onClick={() => startEdit(h)}>
                編集
              </button>

              <button onClick={() => deleteItem(h.id)}>
                削除
              </button>

            </>
          )}

        </div>
      ))}

    </div>
  );
}

export default History;