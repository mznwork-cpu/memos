import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function History() {

  // 履歴一覧
  const [histories, setHistories] = useState([]);

  // 編集状態
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDate, setEditDate] = useState("");

  // 初回ロード
  useEffect(() => {
    loadHistory();
  }, []);

  // 履歴データ取得
  // ※ view側で type=1（買物）に限定されている前提
  const loadHistory = async () => {

    const { data } = await supabase
      .from("v_purchase_history")
      .select("*")
      .order("purchased_date", { ascending: false });

    setHistories(data || []);
  };

  // 編集開始
  // → 選択した値を編集用stateへコピー
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditPrice(item.price || "");
    setEditDate(item.purchased_date || "");
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

    // 編集モード終了
    setEditingId(null);

    // 再読み込み
    loadHistory();
  };

  // 削除処理（確認付き）
  const deleteItem = async (id) => {

    const ok = window.confirm("削除してもよろしいですか？");

    if (!ok) return;

    await supabase
      .from("purchase_history")
      .delete()
      .eq("id", id);

    // 再読み込み
    loadHistory();
  };

  return (
    <div>

      <h1 className={"page-title shopping"}>購入履歴</h1>

      {/* ===== 履歴一覧 ===== */}
      {histories.map(h => (
        <div className="card" key={h.id}>

          {editingId === h.id ? (
            <>
              {/* ===== 編集モード ===== */}

              {/* 価格編集 */}
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />

              {/* 日付編集 */}
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
              {/* ===== 表示モード ===== */}

              {/* 日付 */}
              <div className="sub">
                {h.purchased_date}
              </div>

              {/* 商品 */}
              <div className="name">
                {h.category} / {h.name}
              </div>

              {/* 金額 */}
              <div>
                {h.price} 円
              </div>

              {/* 備考 */}
              <div className="sub">
                {h.note}
              </div>

              {/* 操作ボタン */}
              <button onClick={() => startEdit(h)}>
                編集
              </button>

              <button
                style={{ backgroundColor: "#e74c3c", marginLeft: 6 }}
                onClick={() => deleteItem(h.id)}
              >
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