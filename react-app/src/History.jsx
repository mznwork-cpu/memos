import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function History() {

  const [histories, setHistories] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("v_purchase_history")
      .select("*");

    setHistories(data || []);
  };

  return (
    <div>

      <h1>購入履歴</h1>

      {histories.map((h) => (
        <div className="card" key={h.id}>

          <div className="sub">{h.purchased_date}</div>

          <div className="name">
            {h.category} / {h.name}
          </div>

          <div>{h.price} 円</div>
          <div className="sub">{h.note}</div>

        </div>
      ))}

    </div>
  );
}

export default History;