// Supabase接続設定ファイル
import { createClient } from "@supabase/supabase-js";

// プロジェクトURLとキーを設定
export const supabase = createClient(
  'https://jsdjxrccaehfecsaxfsj.supabase.co',
  'sb_publishable_uCOtuSfKhbpL6y2taiW9xw_LL8JncUr'
);