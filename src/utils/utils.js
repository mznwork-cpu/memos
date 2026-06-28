/**
 * カテゴリのユニーク一覧を生成
 * 
 * @param {Array} items - 元データ配列
 * @returns {Array} categoryだけの重複なし配列
 */
export const getUniqueCategories = (items) => {
  return [
    ...new Set(
      (items || [])
        .map(i => i.category)   // categoryだけ取り出す
        .filter(Boolean)        // null / "" を除外
    )
  ];
};