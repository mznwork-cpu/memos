import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function TodoList() {

  // ===============================
  // ■ State定義
  // ===============================

  // View（v_todo_list）から取得した一覧データ
  const [items, setItems] = useState([]);

  // 各行ごとの入力状態（チェック・メモ）
  const [dataMap, setDataMap] = useState({});

  // トースト表示用メッセージ
  const [toast, setToast] = useState("");

  // 表示切替フラグ（true：期限のみ / false：全件表示）
  const [showDueOnly, setShowDueOnly] = useState(true);

  // ===============================
  // ■ 初期ロード
  // ===============================
  useEffect(() => {
    loadItems();
  }, []);

  // ===============================
  // ■ データ取得
  // ===============================
  const loadItems = async () => {

    // ViewからTodo一覧を取得
    const { data } = await supabase
      .from("v_todo_list")
      .select("*")
      .order("category")
      .order("name");

    const list = data || [];
    setItems(list);

    // チェック状態とメモ入力用の初期値を作成
    const initial = {};
    list.forEach(item => {
      initial[item.id] = {
        note: "",
        _checked: false
      };
    });

    setDataMap(initial);
  };

  // ===============================
  // ■ 表示用データ（フィルタ）
  // ===============================
  // 期限のみ or 全件表示の切り替え
  const displayItems = showDueOnly
    ? items.filter(i => i.is_due)
    : items;

  // ===============================
  // ■ 実行処理
  // ===============================
  const executeAll = async () => {

    try {

      // 表示中のリストからチェックされたものだけ処理
      for (const item of displayItems) {

        const data = dataMap[item.id];

        if (!data?._checked) continue;

        const note = data.note || "";

        // 履歴登録（これにより最終日が更新される）
        await supabase
          .from("purchase_history")
          .insert([
            {
              item_id: item.id,
              note,
              purchased_date: new Date().toISOString().slice(0, 10)
            }
          ]);

        // チェック状態をOFFにする
        await supabase
          .from("items")
          .update({ checked: false })
          .eq("id", item.id);
      }

      setToast("実行しました");

      // データ再取得（viewの計算結果も更新される）
      loadItems();

    } catch (e) {
      setToast("エラーが発生しました");
    }

    // トーストを一定時間で消す
    setTimeout(() => setToast(""), 3000);
  };

  // ===============================
  // ■ UI
  // ===============================
  return (
    <div>

      {/* トースト表示 */}
      {toast && (
        <div className="toast toast-success">
          {toast}
        </div>
      )}

      <h1 className={"page-title todo"}>Todo</h1>

      {/* 表示切替ボタン */}
      <button onClick={() => setShowDueOnly(v => !v)}>
        {showDueOnly
          ? "期限のみ"
          : "全件表示"}
      </button>

      {/* 一覧表示 */}
      {displayItems.map(item => (
        <div className="card" key={item.id}>

          <div className="row-top">

            {/* 実行チェック */}
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

            {/* タスク表示 */}
            <div className="name">
              {item.category} / {item.name}
            </div>

          </div>

          {/* 経過日数と基準 */}
          <div className="name">
            経過: {item.since}日 / 基準: {item.refdate}
          </div>

          {/* メモ入力 */}
          <input
            placeholder="メモ"
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
      ))}

      {/* 実行ボタン */}
      <button onClick={executeAll}>
        実行
      </button>

    </div>
  );
}

export default TodoList;