CREATE DATABASE easevent;
USE easevent;

CREATE TABLE users(
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(60),
    password VARCHAR(30),
    email VARCHAR(150),
    last_login DATETIME,
    login_ip CHAR(15),
    PRIMARY KEY(user_id)
);

CREATE TABLE event(
    event_id INT NOT NULL AUTO_INCREMENT,
    event_title VARCHAR(255),
    event_description TEXT,
    event_time DATETIME,
    event_location VARCHAR(255),
    user_id INT,
    PRIMARY KEY(event_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);
CREATE TABLE admin(
    admin_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    username VARCHAR(30),
    PRIMARY KEY(admin_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);
CREATE TABLE cart(
    cart_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    username VARCHAR(60),
    event_id INT,
    event_title VARCHAR(255),
    PRIMARY KEY(cart_id),
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);
-- INSERT INTO user VALUES(1,'Alice','password123','aw@gmail.com');
-- INSERT INTO user VALUES(2,'Bob','password456','bj@gmail.com');
-- INSERT INTO admin VALUES(1,1,'Alice');

INSERT INTO users (username,password) VALUES('hello','hello');
INSERT INTO users (username,email) VALUES('XZB','2191803584@qq.com');
