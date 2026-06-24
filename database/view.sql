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

--■ TODOリスト
CREATE OR REPLACE VIEW v_todo_list AS
SELECT
    lh.id,
    i.category,
    i.name,
    lh.lastdate,
    COALESCE(CURRENT_DATE - lh.lastdate, 999) AS since,
    i.last_price AS refdate,
    CASE
        WHEN COALESCE(CURRENT_DATE - lh.lastdate, 999)
             >= COALESCE(i.last_price, 0)
        THEN true
        ELSE false
    END AS is_due

FROM
    (
        SELECT
            i.id,
            MAX(h.purchased_date) AS lastdate
        FROM
            items i
            LEFT JOIN purchase_history h
                ON i.id = h.item_id
        WHERE
            i.type = 2
        GROUP BY
            i.id
    ) lh
    LEFT JOIN items i
        ON lh.id = i.id;
