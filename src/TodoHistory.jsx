import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function TodoHistory() {

  const [histories, setHistories] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  // viewでtype=2前提
  const loadHistory = async () => {

    const { data } = await supabase
      .from("v_todo_history")
      .select("*")
      .order("purchased_date", { ascending: false });

    setHistories(data || []);
  };

  const startEdit = (h) => {
    setEditingId(h.id);
    setEditDate(h.purchased_date);
    setEditNote(h.note || "");
  };

  const saveEdit = async (h) => {

    await supabase
      .from("purchase_history")
      .update({
        purchased_date: editDate,
        note: editNote
      })
      .eq("id", h.id);

    setEditingId(null);
    loadHistory();
  };

  const deleteItem = async (id) => {

    if (!window.confirm("削除してもよろしいですか？")) return;

    await supabase
      .from("purchase_history")
      .delete()
      .eq("id", id);

    loadHistory();
  };

  return (
    <div>

      <h1>Todo履歴</h1>

      {histories.map(h => (
        <div className="card" key={h.id}>

          {editingId === h.id ? (
            <>
              <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
              <input value={editNote} onChange={(e) => setEditNote(e.target.value)} />
              <button onClick={() => saveEdit(h)}>保存</button>
            </>
          ) : (
            <>
              <div className="sub">{h.purchased_date}</div>
              <div className="name">{h.category} / {h.name}</div>
              <div className="sub">{h.note}</div>

              <button onClick={() => startEdit(h)}>編集</button>
              <button
                style={{ background: "#e74c3c", marginLeft: 6 }}
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

export default TodoHistory;