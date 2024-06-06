SELECT 
    jt.key_columns,
    SUM(JSON_UNQUOTE(JSON_EXTRACT(processed_data, CONCAT('$.label_ratios."', jt.key_columns, '"')))) AS total_val_columns,
    SUM(JSON_UNQUOTE(JSON_EXTRACT(processed_data, CONCAT('$.label_ratios."', jt.key_columns, '"')))) / total.total_sum * 100 AS percent_total
FROM 
    Crawled_Data
CROSS JOIN
    JSON_TABLE(
        JSON_KEYS(processed_data->'$.label_ratios'),
        "$[*]" COLUMNS (
            key_columns VARCHAR(50) PATH '$'
        )
    ) AS jt
CROSS JOIN (
    SELECT 
        SUM(JSON_UNQUOTE(JSON_EXTRACT(processed_data, CONCAT('$.label_ratios."', jt.key_columns, '"')))) AS total_sum
    FROM 
        Crawled_Data
    CROSS JOIN
        JSON_TABLE(
            JSON_KEYS(processed_data->'$.label_ratios'),
            "$[*]" COLUMNS (
                key_columns VARCHAR(50) PATH '$'
            )
        ) AS jt
) AS total
WHERE
    content_text LIKE '%근황%'
GROUP BY
    jt.key_columns, total.total_sum;
