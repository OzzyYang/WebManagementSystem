use wms;

SELECT 
    i.*, a.avatar, p.password, p.password_1, p.password_2
FROM
    user_info AS i
        INNER JOIN
    (user_avatar AS a, user_psd AS p) ON i.id = a.userid AND i.id = p.userid;

SELECT 
    i.*, GROUP_CONCAT(t.id,'-',t.name) AS tags
FROM
    book_info AS i
        INNER JOIN
    (book_tag AS t, book_tag_rel AS r) ON r.bookid = i.id AND r.tagid = t.id
WHERE
    i.id = 9
GROUP BY i.id;