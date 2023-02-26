class Book {
    constructor(title, author, dt, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.dt = dt;
    }
}
class Disp {
    static displayBooks() {
        const books = Storage.getBooks();

        books.forEach((book) => Disp.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.dt}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">Remove</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#dt').value = '';
    }
}
class Storage {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Storage.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Display Books
document.addEventListener('DOMContentLoaded', Disp.displayBooks);
// Add Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    const dt = document.querySelector('#dt').value;
    var num = document.forms["form"]["in"].value;

    if (isbn.length != 13) {
        Disp.showAlert('ISBN number must be of 13 digits ', 'danger');
    }
    else if (isNaN(num)) {
        Disp.showAlert('ISBN number must be digits ', 'danger');
    }
    else {
        const book = new Book(title, author, dt, isbn);
        // Add Book to Display
        Disp.addBookToList(book);

        // Add book to storage
        Storage.addBook(book);

        // Showing success message
        Disp.showAlert('Book Added successfully', 'success');

        // Clear fields
        Disp.clearFields();
    }
});

// Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from Display
    Disp.deleteBook(e.target);

    // Remove book from storage
    Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Showing success message
    Disp.showAlert('Book Removed successfully', 'success');
});