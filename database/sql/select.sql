use wms;

SELECT 
    i.*, a.avatar, p.password, p.password_1, p.password_2
FROM
    user_info AS i
        INNER JOIN
    (user_avatar AS a, user_psd AS p) ON i.id = a.userid AND i.id = p.userid

