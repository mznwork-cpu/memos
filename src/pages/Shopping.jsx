// TODO: executeAllにloading制御追加
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

function Shopping() {

  // ===============================
  // ■ State定義
  // ===============================

  // 表示対象の買物商品（checked=true）の一覧
  const [items, setItems] = useState([]);

  // 各商品の入力状態（数量・価格・備考・チェック）
  const [dataMap, setDataMap] = useState({});

  // トースト表示用メッセージ
  const [toast, setToast] = useState("");

  // ローディング状態
  const [loading, setLoading] = useState(false);


  // ================================
  // ■ 初期ロード
  // ===============================  
  useEffect(() => {
    loadItems();
  }, []);

  // ================================
  // ■ データ取得
  // ================================
  // Supabaseから買物対象商品を取得
  // ※ type=1 = 買物専用データ
  const loadItems = async () => {

    // データ取得
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
    // ・入力用のチェックはoff
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

  // ===============================
  // ■ 実行処理
  // ===============================

  // 購入確定処理
  const purchaseAll = async () => {
    // 二重押し防止
    if (loading) return;
    // 開始
    setLoading(true);

    try {

      // 表示中のリストからチェックされたものだけ処理
      for (const item of items) {
        
        // チェック状態を確認
        const data = dataMap[item.id];

        // チェックされていない商品はスキップ
        if (!data?._checked) continue;
        
        // 入力値を取得
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
    } finally {
      // 終了
      setLoading(false);
    }

    // トーストは一定時間後に消す
    setTimeout(() => setToast(""), 3000);
  };

  // ===============================
  // ■ UI画面
  // ===============================
  return (
    <div>
      {/* 処理中 */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner"></div>
            処理中...
          </div>
        </div>
      )}

      {/* トースト表示 */}
      {toast && (
       <div className="toast toast-success">
        {toast}
      </div>
      )}

      {/* 画面本体 */}
      {/* 上部固定 */}
      <div className="sub-header-fixed">
          {/* 実行領域 */}
          <div className="header-execute">
            <button onClick={purchaseAll} className="btn-execute">
              購入確定
            </button>
          </div>
        </div>

      {/* ===== 商品一覧 ===== */}
      <div className="main-content">
        {items.map(item => (
          <div className="card" key={item.id}>
            {/* 上段：チェックと商品名 */}
            <div className="row-top">
              {/* 購入対象チェック */}
              <input
                type="checkbox"
                className="checkbox-large"
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
            {/* <div style={{ marginTop: 6 }}> */}
            <div>
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
      </div>
    </div>
  );
}

export default Shopping;