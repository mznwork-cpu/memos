// 状態管理
import { useState, useEffect } from "react";

// Supabase
import { supabase } from "./supabase";

function History() {

  const [histories, setHistories] = useState([]);

  // 初回ロード
  useEffect(() => {
    loadHistory();
  }, []);

  // 履歴取得（VIEW）
  const loadHistory = async () => {

    const { data, error } = await supabase
      .from("v_purchase_history")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    setHistories(data || []);
  };

  return (
    <div>

      <h1>購入履歴</h1>

      <ul>
        {histories.map((h) => (
          <li key={h.id} style={{ marginBottom: 10 }}>

            <div>{h.purchased_date}</div>

            <div>{h.category} / {h.name}</div>

            <div>{h.price} 円</div>

            <div style={{ fontSize: 12 }}>
              {h.note}
            </div>

          </li>
        ))}
      </ul>

    </div>
  );
}

export default History;