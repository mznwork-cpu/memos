// Reactの状態管理
import { useState, useEffect } from "react";

// Supabase接続
import { supabase } from "./supabase";

function Shopping() {

  // 買物対象一覧
  const [items, setItems] = useState([]);

  // 入力状態管理
  const [dataMap, setDataMap] = useState({});

  // トーストメッセージ
  const [toast, setToast] = useState("");

  // 初回ロード
  useEffect(() => {
    loadItems();
  }, []);

  // データ取得＋初期値設定
  const loadItems = async () => {

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("checked", true)
      .order("category")
      .order("name");

    setItems(data || []);

    // 初期入力値
    const initial = {};
    (data || []).forEach(item => {
      initial[item.id] = {
        quantity: 1,                  // 数量初期値
        price: item.last_price || "", // 前回価格
        note: "",
        _checked: false              // 購入対象チェック
      };
    });

    setDataMap(initial);
  };

  // 購入確定処理
  const purchaseAll = async () => {

    try {

      for (const item of items) {

        const data = dataMap[item.id];

        // 未チェックはスキップ
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

        // 商品マスタ更新
        await supabase
          .from("items")
          .update({
            checked: false,
            last_price: price,
            last_purchased_date: new Date().toISOString().slice(0, 10)
          })
          .eq("id", item.id);
      }

      // 成功トースト
      setToast("購入確定しました");

      // 再読み込み
      loadItems();

    } catch (e) {

      // エラー時トースト
      setToast("エラーが発生しました");

      console.log(e);
    }

    // 3秒後に消す
    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  return (
    <div>

      {/* トースト表示 */}
      {toast && (
        <div style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#a57409",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: "20px",
          fontSize: "14px",
          zIndex: 1000
        }}>
          {toast}
        </div>
      )}

      <h1>買物リスト</h1>

      {/* 商品一覧 */}
      {items.map((item) => (
        <div className="card" key={item.id}>

          {/* 上段 */}
          <div className="row-top">

            <input
              type="checkbox"
              checked={dataMap[item.id]?._checked || false}
              onChange={(e) =>
                setDataMap(prev => ({
                  ...prev,
                  [item.id]: {
                    ...(prev[item.id] || {}),
                    _checked: e.target.checked
                  }
                }))
              }
            />

            <div className="name">
              {item.category} / {item.name}
            </div>

          </div>

          {/* 前回価格 */}
          <div className="sub">
            前回: {item.last_price || "-"} 円
          </div>

          {/* 数量＋価格 */}
          <div className="row-bottom">

            {/* 数量ボタン */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

              <button
                onClick={() =>
                  setDataMap(prev => {
                    const current = Number(prev[item.id]?.quantity || 1);
                    return {
                      ...prev,
                      [item.id]: {
                        ...(prev[item.id] || {}),
                        quantity: Math.max(1, current - 1)
                      }
                    };
                  })
                }
              >
                −
              </button>

              <div>{dataMap[item.id]?.quantity || 1}</div>

              <button
                onClick={() =>
                  setDataMap(prev => {
                    const current = Number(prev[item.id]?.quantity || 1);
                    return {
                      ...prev,
                      [item.id]: {
                        ...(prev[item.id] || {}),
                        quantity: current + 1
                      }
                    };
                  })
                }
              >
                ＋
              </button>

            </div>

            {/* 価格 */}
            <input
              className="price"
              placeholder="価格"
              type="number"
              value={dataMap[item.id]?.price || ""}
              onChange={(e) => {

                const val = e.target.value.slice(0, 5); // 5桁制限

                setDataMap(prev => ({
                  ...prev,
                  [item.id]: {
                    ...(prev[item.id] || {}),
                    price: val
                  }
                }));
              }}
            />

          </div>

          {/* 備考 */}
          <div style={{ marginTop: 6 }}>

            <input
              className="note"
              placeholder="備考"
              value={dataMap[item.id]?.note || ""}
              onChange={(e) =>
                setDataMap(prev => ({
                  ...prev,
                  [item.id]: {
                    ...(prev[item.id] || {}),
                    note: e.target.value
                  }
                }))
              }
            />

          </div>

        </div>
      ))}

      {/* 購入確定ボタン */}
      <button style={{ marginTop: 10 }} onClick={purchaseAll}>
        購入確定
      </button>

    </div>
  );
}

export default Shopping;