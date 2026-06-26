import { supabase } from "./supabase";

// === Todo実行処理 ===
export const executeTodo = async (itemId, note) => {
    // 履歴登録
  await supabase
    .from("purchase_history")
    .insert([
      {
        item_id: itemId,
        note,
        purchased_date: new Date().toISOString().slice(0, 10)
      }
    ]);
    // アイテムのチェック状態をOFFにする
  await supabase
    .from("items")
    .update({ checked: false })
    .eq("id", itemId);
};

// === Todo一覧取得 ===
export const fetchTodoList = async () => {

  const { data } = await supabase
    .from("v_todo_list")
    .select("*")
    .order("category")
    .order("name");

  return data || [];
};