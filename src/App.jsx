import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import "./App.css";
import axios from "axios";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";

import { FloatLabel } from "primereact/floatlabel";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [books, setBooks] = useState([]);
  const [bookDetail, setBookDetail] = useState();
  const [showDetail, setShowDetail] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteBookID, setDeleteBookID] = useState(null);

  const [newBookData, setNewBookData] = useState({
    isbn: uuidv4(),
    author: "",
    title: "",
    rating: "0",
  });

  const [editBookData, setEditBookData] = useState({});

  async function getData() {
    const url = "/books";
    axios
      .get(url)
      .then(function (response) {
        // handle success
        response.status === 200 ? setBooks(response.data) : "";
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        setNewBookData({
          isbn: uuidv4(),
          author: "",
          title: "",
          rating: "0",
        });
        // always executed
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const handleDetail = async (isbn) => {
    axios
      .get(`/books/${isbn}`)
      .then(function (response) {
        setBookDetail(response.data);

        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleEditDetail = async (isbn) => {
    axios
      .get(`/books/${isbn}`)
      .then(function (response) {
        setEditBookData(response.data);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAddBook = async () => {
    await axios
      .put(`/books/${newBookData.isbn}`, newBookData)
      .then(function (response) {
        getData();
        setShowAddForm(false);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDeleteBook = async () => {
    await axios
      .delete(`/books/${deleteBookID}`)
      .then(function (response) {
        getData();
        setShowAddForm(false);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setDeleteBookID(null);
        // always executed
      });
  };

  const handleEditBook = async () => {
    await axios
      .put(`/books/${editBookData.isbn}`, editBookData)
      .then(function (response) {
        getData();
        setShowEditForm(false);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="flex">
        <Button
          size="sm"
          text
          raised
          className="shadow-none"
          onClick={() => {
            setShowAddForm(true);
          }}
        >
          <i className="pi pi-plus-circle pr-2"></i> Add Book
        </Button>
      </div>
      <table border={1}>
        <thead>
          <tr>
            {/*   <th>ISBN</th> */}
            <th>Title</th>
            <th>Author</th>
            <th>Rating</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            return (
              <tr key={book.isbn}>
                {/*   <td>{book.isbn}</td> */}
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <Rating value={book.rating} disabled cancel={false} />
                </td>
                <td>
                  <Button
                    size="sm"
                    text
                    raised
                    className="shadow-none"
                    onClick={() => {
                      setShowDetail(true);
                      handleDetail(book.isbn);
                    }}
                  >
                    Details
                  </Button>
                </td>
                <td>
                  <Button
                    size="sm"
                    text
                    raised
                    className="shadow-none"
                    severity="danger"
                    onClick={() => {
                      handleEditDetail(book.isbn);
                      setShowEditForm(true);
                    }}
                  >
                    Edit
                  </Button>
                </td>

                <td>
                  <Button
                    size="sm"
                    text
                    raised
                    className="shadow-none"
                    severity="danger"
                    onClick={() => {
                      setShowDeleteForm(true);
                      setDeleteBookID(book.isbn);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="card flex justify-content-center">
        {/* DETAILS */}
        <Dialog
          visible={showDetail}
          modal
          onHide={() => {
            if (!showDetail) return;
            setShowDetail(false);
          }}
          content={({ hide }) => (
            <div
              className="flex flex-column px-8 py-5 gap-4"
              style={{
                borderRadius: "12px",
                backgroundImage:
                  "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))",
              }}
            >
              <i className="pi pi-book" style={{ fontSize: "2rem" }}>
                <span className="pl-3">Details</span>
              </i>

              <div className="inline-flex flex-column gap-2">
                <label
                  htmlFor="username"
                  className="text-primary-50 font-semibold"
                >
                  Title: {bookDetail?.title} <br />
                  Author: {bookDetail?.author} <br />
                  <div className="flex">
                    Rating:
                    <Rating
                      className="pl-2"
                      value={bookDetail?.rating}
                      disabled
                      cancel={false}
                    />
                  </div>
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Button
                  label="Close"
                  onClick={(e) => hide(e)}
                  text
                  className="shadow-none p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
              </div>
            </div>
          )}
        ></Dialog>

        {/* ADD FORMS*/}
        <Dialog
          visible={showAddForm}
          modal
          onHide={() => {
            if (!showAddForm) return;
            setShowAddForm(false);
          }}
          content={({ hide }) => (
            <div
              className="flex flex-column px-8 py-5 gap-4"
              style={{
                borderRadius: "12px",
                backgroundImage:
                  "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))",
              }}
            >
              <i className="pi pi-book" style={{ fontSize: "2rem" }}>
                <span className="pl-3">Add Form</span>
              </i>

              <div className="inline-flex flex-column gap-2 pt-3">
                <FloatLabel>
                  <InputText
                    type="text"
                    className="p-inputtext-sm "
                    id="title"
                    value={newBookData.title}
                    onChange={(e) =>
                      setNewBookData({ ...newBookData, title: e.target.value })
                    }
                  />
                  <label htmlFor="title">Title</label>
                </FloatLabel>
                <div className="p-1"></div>
                <FloatLabel>
                  <InputText
                    type="text"
                    className="p-inputtext-sm"
                    id="author"
                    value={newBookData.author}
                    onChange={(e) =>
                      setNewBookData({ ...newBookData, author: e.target.value })
                    }
                  />
                  <label htmlFor="author">Author</label>
                </FloatLabel>

                <div className="flex p-2">
                  Rating:
                  <Rating
                    className="pl-2"
                    value={newBookData.rating}
                    onChange={(e) =>
                      setNewBookData({ ...newBookData, rating: e.value })
                    }
                    cancel={false}
                  />
                </div>
              </div>
              <div className="flex align-items-center gap-2">
                <Button
                  label="Cancel"
                  onClick={(e) => {
                    hide(e);
                    setNewBookData({
                      isbn: uuidv4(),
                      author: "",
                      title: "",
                      rating: "0",
                    });
                  }}
                  text
                  className="shadow-none  text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
                <Button
                  label="Add Book"
                  onClick={() => {
                    handleAddBook(newBookData);
                  }}
                  text
                  className="shadow-none  text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
              </div>
            </div>
          )}
        ></Dialog>

        {/* DELETE FORM */}
        <Dialog
          visible={showDeleteForm}
          modal
          onHide={() => {
            if (!showDeleteForm) return;
            setShowDeleteForm(false);
          }}
          content={({ hide }) => (
            <div
              className="flex flex-column px-8 py-5 gap-4"
              style={{
                borderRadius: "12px",
                backgroundImage:
                  "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))",
              }}
            >
              <i className="pi pi-book" style={{ fontSize: "2rem" }}>
                <span className="pl-3">Delete Form</span>
              </i>

              <div className="inline-flex flex-column gap-2">
                <label
                  htmlFor="username"
                  className="text-primary-50 font-semibold"
                >
                  Delete selected book?
                </label>
              </div>
              <div className="flex align-items-center gap-2">
                <Button
                  label="Cancel"
                  onClick={(e) => {
                    hide(e);
                  }}
                  text
                  className="shadow-none  text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
                <Button
                  label="Delete Book"
                  onClick={(e) => {
                    hide(e);
                    handleDeleteBook();
                  }}
                  text
                  className="shadow-none  text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
              </div>
            </div>
          )}
        ></Dialog>

        {/* EDDIT FORMS*/}
        <Dialog
          visible={showEditForm}
          modal
          onHide={() => {
            if (!showEditForm) return;
            setShowEditForm(false);
          }}
          content={({ hide }) => (
            <div
              className="flex flex-column px-8 py-5 gap-4"
              style={{
                borderRadius: "12px",
                backgroundImage:
                  "radial-gradient(circle at left top, var(--primary-400), var(--primary-700))",
              }}
            >
              <i className="pi pi-book" style={{ fontSize: "2rem" }}>
                <span className="pl-3">Edit Form</span>
              </i>

              <div className="inline-flex flex-column gap-2 pt-3">
                <FloatLabel>
                  <InputText
                    type="text"
                    className="p-inputtext-sm "
                    id="title"
                    value={editBookData.title}
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        title: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="title">Title</label>
                </FloatLabel>
                <div className="p-1"></div>
                <FloatLabel>
                  <InputText
                    type="text"
                    className="p-inputtext-sm"
                    id="author"
                    value={editBookData.author}
                    onChange={(e) =>
                      setEditBookData({
                        ...editBookData,
                        author: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="author">Author</label>
                </FloatLabel>

                <div className="flex p-2">
                  Rating:
                  <Rating
                    className="pl-2"
                    value={editBookData.rating}
                    onChange={(e) =>
                      setEditBookData({ ...editBookData, rating: e.value })
                    }
                    cancel={false}
                  />
                </div>
              </div>
              <div className="flex align-items-center gap-2">
                <Button
                  label="Cancel"
                  onClick={(e) => {
                    hide(e);
                    setNewBookData({
                      isbn: uuidv4(),
                      author: "",
                      title: "",
                      rating: "0",
                    });
                  }}
                  text
                  className="shadow-none  text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
                <Button
                  label="Edit Book"
                  onClick={() => {
                    handleEditBook(editBookData);
                  }}
                  text
                  className="shadow-none  text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                ></Button>
              </div>
            </div>
          )}
        ></Dialog>
      </div>
    </div>
  );
}

export default App;
