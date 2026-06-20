// 状態管理
import { useState, useEffect } from "react";

// Supabase
import { supabase } from "./supabase";

function Shopping() {

  // 買物対象
  const [items, setItems] = useState([]);

  // 入力値をまとめて管理
  const [dataMap, setDataMap] = useState({});

  useEffect(() => {
    loadItems();
  }, []);

  // チェックされた商品だけ取得
  const loadItems = async () => {
    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("checked", true)
      .order("category")
      .order("name");

    setItems(data || []);
  };

  // 購入確定
  const purchaseAll = async () => {

    for (const item of items) {

      const data = dataMap[item.id];

      // チェックされてないものはスキップ
      if (!data?._checked) continue;

      const price = data.price || item.last_price || 0;
      const note = data.note || "";
      const quantity = Number(data.quantity) || 1;

      // 数量分INSERT
      for (let i = 0; i < quantity; i++) {

        await supabase
          .from("purchase_history")
          .insert([
            {
              item_id: item.id,
              price,
              note
            }
          ]);
      }

      // マスタ更新
      await supabase
        .from("items")
        .update({
          checked: false,
          last_price: price,
          last_purchased_date: new Date().toISOString().slice(0, 10)
        })
        .eq("id", item.id);
    }

    setDataMap({});
    loadItems();
  };

  return (
    <div>

      <h1>買物リスト</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: 12 }}>

            {/* 1行目 */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={dataMap[item.id]?._checked || false}
                onChange={(e) =>
                  setDataMap({
                    ...dataMap,
                    [item.id]: {
                      ...dataMap[item.id],
                      _checked: e.target.checked
                    }
                  })
                }
              />
              <div>{item.category} / {item.name}</div>
              <div>前回: {item.last_price || "-"} 円</div>
            </div>

            {/* 2行目 */}
            <div style={{ display: "flex", gap: 10 }}>
              <input
                placeholder="数量"
                type="number"
                value={(dataMap[item.id]?.quantity) || ""}
                onChange={(e) =>
                  setDataMap({
                    ...dataMap,
                    [item.id]: {
                      ...dataMap[item.id],
                      quantity: e.target.value
                    }
                  })
                }
              />

              <input
                placeholder="価格"
                type="number"
                value={(dataMap[item.id]?.price) || ""}
                onChange={(e) =>
                  setDataMap({
                    ...dataMap,
                    [item.id]: {
                      ...dataMap[item.id],
                      price: e.target.value
                    }
                  })
                }
              />

              <input
                placeholder="備考"
                value={(dataMap[item.id]?.note) || ""}
                onChange={(e) =>
                  setDataMap({
                    ...dataMap,
                    [item.id]: {
                      ...dataMap[item.id],
                      note: e.target.value
                    }
                  })
                }
              />
            </div>

          </li>
        ))}
      </ul>

      <button onClick={purchaseAll}>購入確定</button>

    </div>
  );
}

export default Shopping;