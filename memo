// Reactのstate（状態管理）とuseEffect（初回実行）を使う
import { useState, useEffect } from "react";

// Supabaseを使うために必要
import { createClient } from "@supabase/supabase-js";

// Supabase接続（自分のプロジェクト情報に書き換える）
const supabase = createClient(
  'https://jsdjxrccaehfecsaxfsj.supabase.co',
  'sb_publishable_uCOtuSfKhbpL6y2taiW9xw_LL8JncUr'
);

function App() {

  // 入力欄の値を保存する
  const [text, setText] = useState("");

  // メモ一覧を保存する
  const [memos, setMemos] = useState([]);

  // 画面が開いたときに1回だけ実行される
  useEffect(() => {
    loadMemos();
  }, []);

  // Supabaseからメモを取得する
  const loadMemos = async () => {
    const { data, error } = await supabase
      .from("memos")                         // テーブル名
      .select("*")                           // 全件取得
      .order("created_at", { ascending: false }); // 新しい順

    if (error) {
      console.log("取得エラー", error);
      return;
    }

    setMemos(data);
  };

  // メモを保存する
  const saveMemo = async () => {

    // 入力が空なら保存しない
    if (!text) return;

    const { error } = await supabase
      .from("memos")
      .insert([{ text }]);

    if (error) {
      console.log("保存エラー", error);
      return;
    }

    // 入力欄を空にする
    setText("");

    // 保存後に一覧を更新
    loadMemos();
  };

  return (
    <div>

      <h1>俺のReactメモアプリ</h1>

      {/* 入力欄 */}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="メモ入力"
      />

      {/* 保存ボタン */}
      <button onClick={saveMemo}>
        保存
      </button>

      {/* メモ一覧表示 */}
      <ul>
        {memos.map((memo) => (
          <li key={memo.id}>
            {memo.text}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
``