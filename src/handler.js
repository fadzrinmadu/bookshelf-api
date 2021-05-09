const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    return response.code(400);
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    return response.code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });

    return response.code(500);
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });

  return response.code(201);
};

const getAllBookHandler = (request, h) => {
  const { name = '', reading, finished } = request.query;
  let filteredBooks = [...books];

  if (name !== null) {
    filteredBooks = filteredBooks
      .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading === '1') {
    filteredBooks = filteredBooks
      .filter((book) => book.reading === true);
  }

  if (reading === '0') {
    filteredBooks = filteredBooks
      .filter((book) => book.reading === false);
  }

  if (finished === '1') {
    filteredBooks = filteredBooks
      .filter((book) => book.finished === true);
  }

  if (finished === '0') {
    filteredBooks = filteredBooks
      .filter((book) => book.finished === false);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  return response.code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const searchBook = books.filter((book) => book.id === bookId)[0];

  if (!searchBook) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    return response.code(404);
  }

  const response = h.response({
    status: 'success',
    data: {
      book: searchBook,
    },
  });

  return response.code(200);
};

const editBookByIdHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    return response.code(400);
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    return response.code(400);
  }

  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index < 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    return response.code(404);
  }

  const updatedAt = new Date().toISOString();

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });

  return response.code(200);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index < 0) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    return response.code(404);
  }

  books.splice(index, 1);

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });

  return response.code(200);
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
