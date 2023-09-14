-- 테이블 순서는 관계를 고려하여 한 번에 실행해도 에러가 발생하지 않게 정렬되었습니다.

-- User Table Create SQL
-- 테이블 생성 SQL - User
CREATE TABLE User
(
    `user_no`     INT            NOT NULL    AUTO_INCREMENT COMMENT 'user_no', 
    `user_id`     VARCHAR(45)    NOT NULL    COMMENT 'user_id', 
    `user_pw`     VARCHAR(45)    NOT NULL    COMMENT 'user_pw', 
    `user_email`  VARCHAR(45)    NOT NULL    COMMENT 'user_email', 
    CONSTRAINT user_no PRIMARY KEY (user_no)
);

-- 테이블 Comment 설정 SQL - User
ALTER TABLE User COMMENT 'User';

-- Unique Index 설정 SQL - User(user_no, user_id, user_email)
CREATE UNIQUE INDEX UQ_user_1
    ON User(user_no, user_id, user_email);


-- Post Table Create SQL
-- 테이블 생성 SQL - Post
CREATE TABLE Post
(
    `post_no`             INT               NOT NULL    AUTO_INCREMENT COMMENT 'post_no', 
    `post_content`        VARCHAR(16000)    NOT NULL    COMMENT 'post_content', 
    `post_user`           INT               NOT NULL    COMMENT 'post_user', 
    `post_creation_time`  TIMESTAMP         NOT NULL    COMMENT 'post_creation_time', 
     PRIMARY KEY (post_no)
);

-- 테이블 Comment 설정 SQL - Post
ALTER TABLE Post COMMENT 'Post';

-- Foreign Key 설정 SQL - Post(post_user) -> User(user_no)
ALTER TABLE Post
    ADD CONSTRAINT FK_Post_post_user_User_user_no FOREIGN KEY (post_user)
        REFERENCES User (user_no) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - Post(post_user)
-- ALTER TABLE Post
-- DROP FOREIGN KEY FK_Post_post_user_User_user_no;


-- Comment Table Create SQL
-- 테이블 생성 SQL - Comment
CREATE TABLE Comment
(
    `comment_no`             INT               NOT NULL    AUTO_INCREMENT COMMENT 'comment_no', 
    `comment_content`        VARCHAR(16000)    NOT NULL    COMMENT 'comment_content', 
    `comment_user`           INT               NOT NULL    COMMENT 'comment_user', 
    `comment_creation_time`  TIMESTAMP         NOT NULL    COMMENT 'comment_creation_time', 
     PRIMARY KEY (comment_no)
);

-- 테이블 Comment 설정 SQL - Comment
ALTER TABLE Comment COMMENT 'Comment';

-- Foreign Key 설정 SQL - Comment(comment_user) -> User(user_no)
ALTER TABLE Comment
    ADD CONSTRAINT FK_Comment_comment_user_User_user_no FOREIGN KEY (comment_user)
        REFERENCES User (user_no) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - Comment(comment_user)
-- ALTER TABLE Comment
-- DROP FOREIGN KEY FK_Comment_comment_user_User_user_no;


