import React, { useState, useEffect } from 'react';
import { Icon, Table, Header, Container, Menu, Checkbox, Button, Modal, Input, Grid, Form, Search } from 'semantic-ui-react';
import './style.scss';
import * as BorrowBook from '../../services/BorrowBookService';
import * as UserService from '../../services/UserService';
import * as BookServices from '../../services/BookService';
import { Notification } from "../../components/Notification/Notification";
import languageDataEn from "../../translations/en.json";
import languageDataVi from "../../translations/vi.json";
import { LANGUAGES } from "../../contants/path";
import moment from 'moment';
import { useSelector } from 'react-redux';

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
  const language = useSelector((state) => state.borrowBookReducer.language);

  const [modalOpen, setModalOpen] = useState(false); //modal add
  const [openModalReturnBook, setOpenModalReturnBook] = React.useState(false) //modall trả sách

  //state lưu thông tin modal thêm
  const [searchUser, setSearchUser] = useState("");
  const [searchUserResults, setSearchUserResults] = useState([]);
  const recordsPerPage = 300;
  const [dataAllUser, setdataAllUser] = useState([]);
  const currentPage = 1;
  const [searchBook, setSearchBook] = useState("");
  const [searchBookResults, setSearchBookResults] = useState([]);
  const [dataAllBook, setDataAllBook] = useState([]);
  const [borrowDate, setBorrowDate] = useState(getCurrentDateTime());
  const [dueDate, setDuaDate] = useState("");

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedBookTitle, setSelectedBookTitle] = useState("");
  const [selectedBookAuthor, setSelectedBookAuthor] = useState("");

  const [errBook, setErrBook] = useState("");
  const [errUsername, setErrUsername] = useState("");
  const [errDueDate, setErrDueDate] = useState("");

  const setErrDefault = () => {
    setErrBook("");
    setErrUsername("");
    setErrDueDate("");
  }

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

  useEffect(() => {
    fetchData();
  }, [page]);

  // Hàm mở modal add
  const handleAddBook = () => {
    setModalOpen(true);
  }

  // Hàm đóng modal add
  const handleCloseModal = () => {
    setErrDefault();
    setModalOpen(false);
  };

  // Hàm xử lý khi thêm mới
  const handleSaveBorrowBook = async () => {
    try {

      if (!selectedUserId) return setErrUsername("Select User");
      if (!selectedBookId) return setErrBook("Select Book");
      if (!dueDate) return setErrDueDate("Select Date return");
      // console.log("ID U: ",selectedUserId, "ID S: ", selectedBookId, "BRT: ", borrowDate, "DD:", dueDate, "EM: ", selectedUserEmail);
      const result = await BorrowBook.createBorrowBooks({
        idUser: selectedUserId,
        email: selectedUserEmail,
        idBook: selectedBookId,
        borrowDate: borrowDate,
        dueDate: dueDate
      });

      if (result.status === "OK") {
        Notification("Thêm mới thành công", "", "success");
      } else {
        Notification("Thêm mới thất bại", "", "error");
        return false; // Registration failed
      }
      setErrDefault();
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserSearchChange = async (e, { value }) => {
    setSearchUser(value);

    const filteredResults = dataAllUser.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );

    // // Update search results
    setSearchUserResults(filteredResults);
  };

  const handleBookSearchChange = async (e, { value }) => {
    setSearchBook(value);

    const filteredResults = dataAllBook.filter((book) =>
      book.title.toLowerCase().includes(value.toLowerCase())
    );
    // // Update search results
    setSearchBookResults(filteredResults);
  };

  const handleBookResultSelect = (e, { result }) => {
    if (!result) {
      setErrBook("Please select a book");
    } else {
      setErrBook(""); // Xóa thông báo lỗi nếu giá trị không trống
    }
    setSelectedBookId(result.id)
    setSelectedBookTitle(result.title);
    setSelectedBookAuthor(result.description);

  };

  const handleUserResultSelect = (e, { result }) => {
    // Access additional properties from the selected result
    if (!result) {
      setErrUsername("Please select a username");
    } else {
      setErrUsername(""); // Xóa thông báo lỗi nếu giá trị không trống
    }
    setSelectedUserId(result.id)
    setSelectedUserName(result.title);
    setSelectedUserEmail(result.description);
  };

  //lấy ngày hiện tại cho  datetime
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDate;
  }

  function handleDateChange(e) {
    const selectedDate = new Date(e.target.value);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate()); // Ngày hiện tại + 1

    if (selectedDate < currentDate) {
      setErrDueDate("Ngày trả phải lớn hơn ngày mượn");
    } else {
      setErrDueDate("");
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const hours = String(selectedDate.getHours()).padStart(2, '0');
      const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      setDuaDate(formattedDate);
    }
  }


  const handleReturnbook = (id) => {
    setSelectedUserId(id);
    console.log(id);
    console.log(selectedUserId);
    handleOpenModalReturnBook();
  }

  const handleOpenModalReturnBook = () => {
    setOpenModalReturnBook(true)
  }

  const handleCloseModalReturnBook = () => {
    setOpenModalReturnBook(false)
  }
  //trả sách
  const handleReturnBookYes = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log("ID: ", selectedUserId, "   Time: ", formattedDate)
    const result = await BorrowBook.updateBorrowBooks({
      id: selectedUserId,
      returnDate: formattedDate,
    });

    if (result.status === "OK") {
      Notification("Trả sách thành công", "", "success");
    } else {
      Notification("Trả sách thất bại", "", "error");
      return false; // Registration failed
    }
    setErrDefault();
    handleCloseModalReturnBook();
    fetchData();
  }

  const handleExportExcel = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      await BorrowBook.exportExcel(access_token);

    } catch (error) {
      console.error(error);
    }
  }

  const handleRefresh = async () => {
    try {
      // setLoading(true); // Set loading to true before making the API call
      await fetchData(); // Fetch data again
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false); // Set loading back to false after the API call is complete
    }
  };

  return (
    <Container className='ContainerBookManagement'>
      <Header className='HeaderManagement' as='h1' textAlign='center'>
        <Icon name="address book"></Icon>  {language === LANGUAGES.VI
          ? languageDataVi.content.bookBorrowManagement.bookBorrowManagementTitle
          : languageDataEn.content.bookBorrowManagement.bookBorrowManagementTitle}
      </Header>

      <div className="header-actions">
        <Button primary onClick={handleAddBook}>
          {language === LANGUAGES.VI
            ? languageDataVi.content.bookBorrowManagement.buttonAddBookBorrow
            : languageDataEn.content.bookBorrowManagement.buttonAddBookBorrow}
        </Button>
        <div style={{ display: "flex" }}>
          {/* {isDeleteButtonVisible && (
            <Button
              className="ButtonDeleteSelected"
              negative
              onClick={handleDeleteSelected}
              disabled={!isDeleteButtonVisible}
            >
              {selectedCount > 1
                ? `Xóa ${selectedCount} lựa chọn`
                : "Xóa 1 lựa chọn"}
            </Button>
          )} */}
          <Button className="ButtonRefresh" icon onClick={handleExportExcel}>
            <Icon name="cloud download" />
          </Button>
          <Button className="ButtonRefresh" icon onClick={handleRefresh}>
            <Icon name="refresh" />
          </Button>

          <Search
            placeholder={
              language === LANGUAGES.VI
                ? languageDataVi.content.userManagement.search
                : languageDataEn.content.userManagement.search
            }
            // onSearchChange={handleSearchChange}
            // onResultSelect={handleSearchResultSelect}
            // value={searchQuery}
            // results={searchResults.map((user, index) => ({
            //   key: index,
            //   title: user.name,
            //   description: user.type,
            //   value: user.value,
            // }))}
          />
        </div>
      </div>



      <Modal open={modalOpen} onClose={handleCloseModal} size="small">

        <Header content={language === LANGUAGES.VI
          ? languageDataVi.content.bookBorrowManagement.buttonAddBookBorrow
          : languageDataEn.content.bookBorrowManagement.buttonAddBookBorrow} />

        <Modal.Content>
          <Form>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookBorrowManagement.searchUser
                      : languageDataEn.content.bookBorrowManagement.searchUser}</label>
                    <Search
                      placeholder={language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement.search
                        : languageDataEn.content.userManagement.search}
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
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.name
                      : languageDataEn.content.userManagement.name}: {selectedUserName}</label>
                    <label>Email: {selectedUserEmail}</label>
                    {errUsername && (
                      <div className="error-message">{errUsername}</div>
                    )}
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <Form.Field>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookBorrowManagement.searchBook
                      : languageDataEn.content.bookBorrowManagement.searchBook}</label>
                    <Search
                      placeholder={language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement.search
                        : languageDataEn.content.userManagement.search}
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
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookManagement.nameBook
                      : languageDataEn.content.bookManagement.nameBook}: {selectedBookTitle}</label>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookManagement.author
                      : languageDataEn.content.bookManagement.author}: {selectedBookAuthor}</label>
                    {errBook && (
                      <div className="error-message">{errBook}</div>
                    )}
                  </Form.Field>
                </Grid.Column>

              </Grid.Row>

              <Grid.Row columns={2}>

                <Grid.Column>
                  <Form.Field>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookBorrowManagement.borrowedDate
                      : languageDataEn.content.bookBorrowManagement.borrowedDate}</label>
                    <input
                      type="datetime-local"
                      value={borrowDate}
                      onChange={(e) => setBorrowDate(e.target.value)}
                      disabled
                    />
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <Form.Field>
                    <label htmlFor="duedate">{language === LANGUAGES.VI
                      ? languageDataVi.content.bookBorrowManagement.dueDate
                      : languageDataEn.content.bookBorrowManagement.dueDate}:</label>
                    <input
                      type="date"
                      id="duedate"
                      name="duedate"
                      onChange={(e) => handleDateChange(e)}
                    />
                    {errDueDate && (
                      <div className="error-message">{errDueDate}</div>
                    )}
                  </Form.Field>
                </Grid.Column>

              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button negative onClick={handleCloseModal}>
            {language === LANGUAGES.VI
              ? languageDataVi.content.userManagement.cancel
              : languageDataEn.content.bookManagement.cancel}
          </Button>
          <Button positive onClick={handleSaveBorrowBook}>
            {language === LANGUAGES.VI
              ? languageDataVi.content.userManagement.save
              : languageDataEn.content.bookManagement.save}
          </Button>
        </Modal.Actions>

      </Modal>

      <Table celled>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> <Checkbox /></Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell> {language === LANGUAGES.VI
              ? languageDataVi.content.bookBorrowManagement.borrower
              : languageDataEn.content.bookBorrowManagement.borrower}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookBorrowManagement.borrowedBook
              : languageDataEn.content.bookBorrowManagement.borrowedBook}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookBorrowManagement.borrowedDate
              : languageDataEn.content.bookBorrowManagement.borrowedDate}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookBorrowManagement.dueDate
              : languageDataEn.content.bookBorrowManagement.dueDate}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookBorrowManagement.returnDate
              : languageDataEn.content.bookBorrowManagement.returnDate}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookBorrowManagement.status
              : languageDataEn.content.bookBorrowManagement.status}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookBorrowManagement.action
              : languageDataEn.content.bookBorrowManagement.action}</Table.HeaderCell>
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
              <Table.Cell>{moment(data.borrowDate).format('DD/MM/YYYY HH:mm')}</Table.Cell>
              <Table.Cell>{moment(data.dueDate).format('DD/MM/YYYY')}</Table.Cell>
              <Table.Cell>
                {data.dueDate ? moment(data.returnDate).format('DD/MM/YYYY HH:mm') : "-----"}
              </Table.Cell>
              <Table.Cell>{getStatusText(data.status)}</Table.Cell>
              <Table.Cell><Icon size="big" name="edit" onClick={() => handleReturnbook(data._id)} /></Table.Cell>

              <Modal
                open={openModalReturnBook}
                onClose={() => setOpenModalReturnBook(false)}
              // onOpen={() => setOpen(true)}
              >
                <Header content={language === LANGUAGES.VI
                  ? languageDataVi.content.bookBorrowManagement.returnBook
                  : languageDataEn.content.bookBorrowManagement.returnBook} />
                <Modal.Content>
                  <p>
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.bookBorrowManagement.areYouSure
                      : languageDataEn.content.bookBorrowManagement.areYouSure}
                  </p>
                </Modal.Content>
                <Modal.Actions>
                  <Button color='red' onClick={() => setOpenModalReturnBook(false)}>
                    <Icon name='remove' /> {language === LANGUAGES.VI
                      ? languageDataVi.content.bookBorrowManagement.no
                      : languageDataEn.content.bookBorrowManagement.no}
                  </Button>
                  <Button color='green' onClick={() => handleReturnBookYes()}>
                    <Icon name='checkmark' /> {language === LANGUAGES.VI
                      ? languageDataVi.content.bookBorrowManagement.yes
                      : languageDataEn.content.bookBorrowManagement.yes}
                  </Button>
                </Modal.Actions>
              </Modal>
            </Table.Row>
          ))}
        </Table.Body>


        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='9'>
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
