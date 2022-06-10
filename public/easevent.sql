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
