create database microservices
use microservices

CREATE TABLE books (
    id VARCHAR(25) PRIMARY KEY,
    title VARCHAR(255),
    category VARCHAR(255),
    countInStock INT,
    publishYear INT,
    authorBook VARCHAR(255),
    createdAt VARCHAR(45),
    updatedAt VARCHAR(45)
);