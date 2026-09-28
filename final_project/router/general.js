const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists!" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "Customer successfully registred. Now you can login" });
});

public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({ message: "Book not found" });
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
    Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[key]);
        }
    });
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({ message: "No books found by this author" });
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];
    Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            matchingBooks.push(books[key]);
        }
    });
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({ message: "No books found with this title" });
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookByISBNPromise = (isbn) => {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => response.data)
        .catch(error => { throw error; });
};

const getBooksByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBooksByTitlePromise = (title) => {
    return axios.get(`http://localhost:5000/title/${title}`)
        .then(response => response.data)
        .catch(error => { throw error; });
};

module.exports.general = public_users;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByTitlePromise = getBooksByTitlePromise;
