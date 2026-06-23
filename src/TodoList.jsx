import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function TodoList() {

  const [items, setItems] = useState([]);
  const [dataMap, setDataMap] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  // 実行対象のみ（checked=true）
  const loadItems = async () => {

    const { data } = await supabase
      .from("items")
      .select("*")
      .eq("type", 2)
      .eq("checked", true)
      .order("category")
      .order("name");

    setItems(data || []);

    const initial = {};
    (data || []).forEach(item => {
      initial[item.id] = {
        note: "",
        _checked: false
      };
    });

    setDataMap(initial);
  };

  // 実行確定
  const executeAll = async () => {

    try {

      for (const item of items) {

        const data = dataMap[item.id];
        if (!data?._checked) continue;

        const note = data.note || "";

        await supabase
          .from("purchase_history") // 共通履歴
          .insert([
            {
              item_id: item.id,
              note,
              purchased_date: new Date().toISOString().slice(0, 10)
            }
          ]);

        await supabase
          .from("items")
          .update({ checked: false })
          .eq("id", item.id);
      }

      setToast("実行しました");
      loadItems();

    } catch (e) {
      setToast("エラーが発生しました");
    }

    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div>

      {toast && (
        <div style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#3498db",
          color: "#fff",
          padding: "10px 16px",
          borderRadius: 20
        }}>
          {toast}
        </div>
      )}

      <h1>Todo</h1>

      {items.map(item => (
        <div className="card" key={item.id}>

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

      <button onClick={executeAll}>実行</button>

    </div>
  );
}

export default TodoList;