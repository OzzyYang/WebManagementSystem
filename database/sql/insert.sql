use wms;

Begin;

insert into user_info (username) values("Admin");

insert into
    user_psd (userid, password)
values(
        (
            select
                id
            from
                user_info
            where
                username = "Admin"
        ),
        "admin"
    );

insert into
    user_avatar (userid)
values(
        (
            select
                id
            from
                user_info
            where
                username = "Admin"
        )
    );

COMMIT;

ROLLBACK;

insert  IGNORE into  book_tag_rel values(10,6); 
insert into book_tag_rel values(10,6) as new on duplicate key update ;