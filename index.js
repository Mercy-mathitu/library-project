// Book Class: represents a book
class Book {
    constructor (title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

// UI class: Handles UI tasks
class UI {
    static displayBooks() {


        const books = Store.getBooks()

        books.forEach((book) => UI.addBookToList(book))
    }
    static addBookToList(book) {
        const bookList = document.querySelector("#book-list")

        const row = document.createElement("tr")

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pages}</td>
        <td id="if-read">${book.read}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `

        bookList.appendChild(row)

    }

    //read book checkbox



    // delete book function
    static deleteBook(el) {
        if(el.classList.contains("delete")) {
            el.parentElement.parentElement.remove()
        }
    }



    // is any field has no input
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector(".container")
        const form = document.querySelector("#book-form")
       container.insertBefore(div, form);

       setTimeout(() => document.querySelector(".alert").remove(), 3000)
    }


    // clearing input fields
        static clearFields() {
            document.getElementById("title").value = ""
            document.getElementById("author").value = ""
            document.getElementById("pages").value = ""
            document.querySelector("#read").checked = false;
        }
}

// Strore class: Handles local storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = []
        }
        else {
            books = JSON.parse(localStorage.getItem("books"))
        }

        return books
    }

    static addBook(book) {
        const books = Store.getBooks()

        books.push(book)

        localStorage.setItem("books", JSON.stringify(books))
    }

    static removeBook(pages) {
        const books = Store.getBooks()

        books.forEach((book, index) => {
            if(book.pages === pages) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem("books", JSON.stringify(books))
    }
}



//Event: Displays books
document.addEventListener("DOMContentLoaded", UI.displayBooks)

// Event: Add a book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault()

    //get form values
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = document.getElementById("pages").value;
    const read = document.querySelector("#read").checked ? "Read" : "Not Read";

    //validate
    if(title === '' || author === '' || pages === '') {
        UI.showAlert("Please fill in all the fields", "danger")
    } else {
        //instanciate book
    const book = new Book(title, author, pages, read);

    // add book to UI
    UI.addBookToList(book)

    //add books to local storage
    Store.addBook(book)

    //show success message
    UI.showAlert("Book added", "success")

    UI.clearFields()


    }


})

// Event: Remove a book
document.getElementById("book-list").addEventListener("click", (e) => {
    UI.deleteBook(e.target)

    //remove book from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent)

    //show delete message
    UI.showAlert("Book deleted", "success")
})