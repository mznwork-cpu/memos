--■ 購入履歴
CREATE OR REPLACE VIEW v_purchase_history AS  
SELECT
    h.id,
    h.item_id,
    h.price,
    h.note,
    h.purchased_date,
    i.name,
    i.category
FROM
    purchase_history h
    LEFT JOIN items i
        ON h.item_id = i.id
WHERE
    i.type = 1;

--■ TODO履歴
CREATE OR REPLACE VIEW v_todo_history AS
SELECT
    h.id,
    h.item_id,
    h.price,
    h.purchased_date,
    h.note,
    i.name,
    i.category
FROM
    purchase_history h
    LEFT JOIN items i
        ON h.item_id = i.id
WHERE
    i.type = 2;