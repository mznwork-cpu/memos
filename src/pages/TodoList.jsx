import { useState, useEffect } from "react";
import { executeTodo } from "../services/Service";
import { fetchTodoList } from "../services/Service";

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

  // ローディング状態
  const [loading, setLoading] = useState(false);

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

    // データ取得
    const list = await fetchTodoList();
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
    // 二重押し防止
    if (loading) return;     
    // 開始      
    setLoading(true);        

    try {

      // 表示中のリストからチェックされたものだけ処理
      for (const item of displayItems) {

        // チェック状態を確認
        const data = dataMap[item.id];
        
        // チェックされていない場合はスキップ
        if (!data?._checked) continue;

        // メモ入力値を取得
        const note = data.note || "";

        // 実行処理
        await executeTodo(item.id, note);
      }

      setToast("実行しました");

      // 再読み込み（画面更新）
      loadItems();

    } catch (e) {
      setToast("エラーが発生しました");
    } finally {
      // 終了
      setLoading(false);
    }

    // トーストを一定時間で消す
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
        {/* 検索領域 */}       
        <div className="header-search">
          <button onClick={() => setShowDueOnly(v => !v)}>
           {showDueOnly
             ? "期限のみ"
             : "全件表示"}
         </button>
        </div>

        {/* 実行領域 */}       
        <div className="header-execute">
          {/* 実行ボタン */}
          <button onClick={executeAll} className="btn-execute">
            実行
          </button>
        </div>
      </div>
       
      {/* 一覧表示 */}
      <div className="main-content">
        {displayItems.map(item => (
          <div className="card" key={item.id}>  

            <div className="row-top">

              {/* 実行チェック */}
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
      </div>
    </div>
  );
}

export default TodoList;