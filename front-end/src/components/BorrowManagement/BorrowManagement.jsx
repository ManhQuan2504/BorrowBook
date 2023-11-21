import React, { useState, useEffect } from 'react';
import { Icon, Table, Header, Container, Menu, Checkbox, Button, Modal, Input, Grid, Form, Search } from 'semantic-ui-react';
import './style.scss';
import * as BorrowBook from '../../services/BorrowBookService';
import * as UserService from '../../services/UserService';
import * as BookServices from '../../services/BookService';

import moment from 'moment';

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return 'Đang mượn';
    case 2:
      return 'Đã trả';
    case 3:
      return 'Mất';
    default:
      return 'Unknown';
  };
};

const BorrowManagement = () => {
  const [countPage, setCountPage] = useState(0);
  const [page, setPage] = useState(1)
  const [datas, setDatas] = useState([]);

  const [modalOpen, setModalOpen] = useState(false); //modal add
  // State để lưu 
  const [bookId, setBookId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [authorBook, setAuthorBook] = useState("");

  //state lưu thông tin modal thêm
  const [searchUser, setSearchUser] = useState("");
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(300);
  const [dataAllUser, setdataAllUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBook, setSearchBook] = useState("");
  const [searchBookResults, setSearchBookResults] = useState([]);
  const [dataAllBook, setDataAllBook] = useState([]);
  const [borrowDate, setBorrowDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());

  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedBookTitle, setSelectedBookTitle] = useState("");
  const [selectedBookAuthor, setSelectedBookAuthor] = useState("");

  const fetchData = async () => {
    try {
      const result = await BorrowBook.getBorrowBooks(page);
      setDatas(result.data.data);
      setCountPage(result.data.countPage)

      const access_token = localStorage.getItem("access_token");
      const dataUser = await UserService.getAllUser(access_token, recordsPerPage, currentPage);
      setdataAllUser(dataUser.data)

      const dataBook = await BookServices.getBooks({ page: 1, perPage: 1000 });
      setDataAllBook(dataBook.data.data)
    } catch (error) {
      console.error(`ERR: http://localhost:1234/api/borrowbook/get?page=${page}\n`, error);
    }
  };
  // console.log(page);
  console.log(dataAllBook);
  console.log(dataAllUser);

  useEffect(() => {
    fetchData();
  }, [page]);

  // Hàm mở modal add
  const handleAddBook = () => {
    setModalOpen(true);
    setInPutDefault();
  }

  const setInPutDefault = () => {
    setTitle("");
    setCategory("");
    setCountInStock("");
    setPublishYear("");
    setAuthorBook("");
  }

  // Hàm đóng modal add
  const handleCloseModal = () => {
    setModalOpen(false);
    setInPutDefault();
  };

  // Hàm xử lý khi thêm mới
  const handleSaveBorrowBook = async () => {
    try {
      // if (!title) return setErrTitle("Enter name book");
      // if (!category) return setErrCategory("Enter book category");
      // if (!countInStock) return setErrCountInStock("Enter count in stock");
      // if (!publishYear) return setErrPublishYear("Enter publish year");
      // if (!authorBook) return setErrAuthorBook("Enter authorbook");

      // const result = await BookServices.createBook({ title, category, countInStock, publishYear, authorBook });

      // console.log(result);
      // if (result.status === "OK") {
      //   Notification("Thêm mới thành công", "", "success");
      // } else {
      //   Notification("Thêm mới thất bại", "", "error");
      //   return false; // Registration failed
      // }

      setInPutDefault();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserSearchChange = async (e, { value }) => {
    setSearchUser(value);
    // console.log("Handle Search User: \n",searchUser);
    // Perform a search based on the input value (adjust the logic as needed)
    const filteredResults = dataAllUser.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );

    // // Update search results
    setSearchUserResults(filteredResults);
  };

  const handleBookSearchChange = async (e, { value }) => {
    setSearchBook(value);
    // console.log("Handle Search User: \n",searchUser);
    // Perform a search based on the input value (adjust the logic as needed)
    const filteredResults = dataAllBook.filter((book) =>
      book.title.toLowerCase().includes(value.toLowerCase())
    );
    // // Update search results
    setSearchBookResults(filteredResults);
  };

  const handleBookResultSelect = (e, { result }) => {
    // Access additional properties from the selected result
    console.log("Selected Book:", result);
    setSelectedBookTitle(result.title);
    setSelectedBookAuthor(result.description);

    // Perform any other actions you need with the selected book information
    // For example, you can update state variables or trigger additional functions
  };

  const handleUserResultSelect = (e, { result }) => {
    // Access additional properties from the selected result
    setSelectedUserName(result.title);
    setSelectedUserEmail(result.description);
    console.log("Selected User:", result);


    // Perform any other actions you need with the selected book information
    // For example, you can update state variables or trigger additional functions
  };

  //lấy ngày hiện tại cho  datetime
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function handleDateChange(e) {
    const inputDate = new Date(e.target.value);
    const formattedDate =
      inputDate.getDate().toString().padStart(2, '0') +
      '/' +
      (inputDate.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      inputDate.getFullYear();

    // You can use formattedDate as needed (e.g., store in state, send to server, etc.)
    console.log('Formatted Date:', formattedDate);
  }




  return (
    <Container className='ContainerBookManagement'>
      <Header as='h1' textAlign='center'>
        Borrow Book Management
      </Header>

      <Button primary onClick={handleAddBook}>
        Create
      </Button>

      <Modal open={modalOpen} onClose={handleCloseModal} size="small">
        <Header content="Borrow Book" />
        <Modal.Content>
          <Form>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>Search User</label>
                    <Search
                      placeholder="Search..."
                      onSearchChange={handleUserSearchChange}
                      onResultSelect={handleUserResultSelect}
                      value={searchUser}
                      results={searchUserResults.map((user, index) => ({
                        key: index,
                        title: user.name,
                        description: user.email, // You can customize the description as needed
                        id: user._id
                      }))}
                    />
                    <label>Username: {selectedUserName}</label>
                    <label>Email: {selectedUserEmail}</label>

                  </Form.Field>
                </Grid.Column>
                <Grid.Column>
                  <Form.Field>
                    <label>Search Book</label>
                    <Search
                      placeholder="Search..."
                      onSearchChange={handleBookSearchChange}
                      onResultSelect={handleBookResultSelect}
                      value={searchBook}
                      results={searchBookResults.map((book, index) => ({
                        key: index,
                        title: book.title,
                        description: book.authorBook, // You can customize the description as needed
                        id: book.id,
                      }))}
                    />
                    <label>Book name: {selectedBookTitle}</label>
                    <label>AuthorBook: {selectedBookAuthor}</label>

                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>Borrow Date</label>
                    <input
                      type="datetime-local"
                      value={getCurrentDateTime()}
                      onChange={(e) => setBorrowDate(new Date(e.target.value))}
                      disabled
                    />
                  </Form.Field>


                </Grid.Column>
                <Grid.Column>
                  <Form.Field>
                    <label htmlFor="returnDate">Return date:</label>
                    <input
                      type="datetime-local"
                      id="returnDate"
                      name="returnDate"
                      onChange={(e) => handleDateChange(e)}
                    />
                  </Form.Field>


                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button positive onClick={handleSaveBorrowBook}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> <Checkbox /></Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Người mượn</Table.HeaderCell>
            <Table.HeaderCell>Sách mượn</Table.HeaderCell>
            <Table.HeaderCell>Ngày mượn</Table.HeaderCell>
            <Table.HeaderCell>Ngày hẹn trả</Table.HeaderCell>
            <Table.HeaderCell>Ngày trả</Table.HeaderCell>
            <Table.HeaderCell>Trạng thái</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {datas.map((data) => (
            <Table.Row key={data._id}>
              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>{data._id}</Table.Cell>
              <Table.Cell>{data.idUser}</Table.Cell>
              <Table.Cell>{data.idBook}</Table.Cell>
              <Table.Cell>{moment(data.returnDate).format('DD/MM/YYYY HH:mm')}</Table.Cell>
              <Table.Cell>{moment(data.borrowDate).format('DD/MM/YYYY')}</Table.Cell>
              <Table.Cell>{moment(data.dueDate).format('DD/MM/YYYY HH:mm')}</Table.Cell>
              <Table.Cell>{getStatusText(data.status)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>


        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='8'>
              <Menu floated='right' pagination>
                <Menu.Item as='a' icon>
                  <Icon name='chevron left' />
                </Menu.Item>
                {Array.from({ length: countPage }, (_, index) => (
                  <Menu.Item key={index} as='a' onClick={() => setPage(index + 1)}>
                    {index + 1}
                  </Menu.Item>
                ))}
                <Menu.Item as='a' icon>
                  <Icon name='chevron right' />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Container >
  );
};

export default BorrowManagement;
