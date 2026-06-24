import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function Shopping() {

  // 表示対象の買物商品（checked=true）の一覧
  const [items, setItems] = useState([]);

  // 各商品の入力状態（数量・価格・備考・チェック）
  const [dataMap, setDataMap] = useState({});

  // トースト表示用メッセージ
  const [toast, setToast] = useState("");

  // 初回表示時にデータ読み込み
  useEffect(() => {
    loadItems();
  }, []);

  // Supabaseから買物対象商品を取得
  // ※ type=1 = 買物専用データ
  const loadItems = async () => {

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("type", 1)          // 買物データのみ
      .eq("checked", true)    // 買物対象のみ
      .order("category")
      .order("name");

    setItems(data || []);

    // 各商品の初期入力状態を作成
    // ・数量は1
    // ・価格は前回価格を初期値
    const initial = {};
    (data || []).forEach(item => {
      initial[item.id] = {
        quantity: 1,
        price: item.last_price || "",
        note: "",
        _checked: false  // 今回購入対象かどうか（UI用）
      };
    });

    setDataMap(initial);
  };

  // 購入確定処理
  const purchaseAll = async () => {

    try {

      // 商品ごとに処理
      for (const item of items) {

        const data = dataMap[item.id];

        // チェックされていない商品はスキップ
        if (!data?._checked) continue;

        const price = data.price || item.last_price || 0;
        const note = data.note || "";
        const quantity = Number(data.quantity) || 1;

        // 数量分だけ履歴登録（1件ずつinsert）
        for (let i = 0; i < quantity; i++) {
          await supabase
            .from("purchase_history")
            .insert([{ item_id: item.id, price, note }]);
        }

        // 商品マスタの更新
        // ・checked解除
        // ・今回の価格を最新として保存
        // ・購入日を更新
        await supabase
          .from("items")
          .update({
            checked: false,
            last_price: price,
            last_purchased_date: new Date()
              .toISOString()
              .slice(0, 10)
          })
          .eq("id", item.id);
      }

      // 成功メッセージ（トースト表示）
      setToast("購入確定しました");

      // 再読み込み（画面更新）
      loadItems();

    } catch (e) {

      // エラー時
      console.log(e);
      setToast("エラーが発生しました");
    }

    // トーストは一定時間後に消す
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div>

      {/* ===== トースト表示（画面上部に表示） ===== */}
{toast && (
  <div className="toast toast-success">
    {toast}
  </div>
)}
      <h1 className={"page-title shopping"}>買物リスト</h1>


      {/* ===== 商品一覧 ===== */}
      {items.map(item => (
        <div className="card" key={item.id}>

          {/* 上段：チェックと商品名 */}
          <div className="row-top">

            {/* 購入対象チェック */}
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

          {/* 前回価格表示 */}
          <div className="sub">
            前回: {item.last_price || "-"} 円
          </div>

          {/* ===== 数量 + 価格 ===== */}
          <div className="row-bottom">

            {/* 数量コントロール */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

              <button onClick={() =>
                setDataMap(prev => {
                  const q = Math.max(1, (prev[item.id]?.quantity || 1) - 1);
                  return { ...prev, [item.id]: { ...(prev[item.id]||{}), quantity: q }};
                })
              }>−</button>

              <div>{dataMap[item.id]?.quantity || 1}</div>

              <button onClick={() =>
                setDataMap(prev => {
                  const q = (prev[item.id]?.quantity || 1) + 1;
                  return { ...prev, [item.id]: { ...(prev[item.id]||{}), quantity: q }};
                })
              }>＋</button>

            </div>

            {/* 価格入力（5桁制限） */}
            <input
              className="price"
              type="number"
              value={dataMap[item.id]?.price || ""}
              onChange={(e) =>
                setDataMap(prev => ({
                  ...prev,
                  [item.id]: {
                    ...(prev[item.id] || {}),
                    price: e.target.value.slice(0, 5)
                  }
                }))
              }
            />

          </div>

          {/* ===== 備考（別段） ===== */}
          <div style={{ marginTop: 6 }}>
            <input
              className="note"
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