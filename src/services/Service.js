import { supabase } from "./supabase";

// ========== 更新処理 ==========
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
};

// ========== 取得処理 ==========
// === マスタ一覧取得 ===
export const fetchMasterList = async () => {

}

// === 買物対象一覧取得 ===
export const fetchShoppingList = async () => {
  const { data } = await supabase
    .from("items")
    .select("*")
    .eq("type", 1)          // 買物データのみ
    .eq("checked", true)    // 買物対象のみ
    .order("category")
    .order("name");
  return data || [];
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