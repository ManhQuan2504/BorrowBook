import React, { useState, useEffect } from "react";
import {
  Icon,
  Table,
  Header,
  Container,
  Menu,
  Checkbox,
  Button,
  Modal,
  Grid,
  Form,
  Search,
  Dropdown,
} from "semantic-ui-react";
import "./style.scss";
import * as BorrowBook from "../../services/BorrowBookService";
import * as UserService from "../../services/UserService";
import * as BookServices from "../../services/BookService";
import { Notification } from "../../components/Notification/Notification";
import languageDataEn from "../../translations/en.json";
import languageDataVi from "../../translations/vi.json";
import { LANGUAGES } from "../../contants/path";
import moment from "moment";
import 'typeface-roboto';
import { useSelector } from "react-redux";

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return "Đang mượn";
    case 2:
      return "Đã trả";
    case 3:
      return "Mất";
    default:
      return "Unknown";
  }
};

const BorrowManagement = () => {
  const [page, setPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const language = useSelector((state) => state.borrowBookReducer.language);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState("");

  const [modalOpen, setModalOpen] = useState(false); //modal add
  const [openModalReturnBook, setOpenModalReturnBook] = React.useState(false); //modall trả sách
  const [openModalDetailBorrow, setOpenModalDetailBorrow] =
    React.useState(false); //modall detail borow
  const [detailBook, setDetailBook] = useState({});
  const [detailUser, setDetailUser] = useState({});

  //state lưu thông tin modal thêm
  const [searchUser, setSearchUser] = useState("");
  const [searchUserResults, setSearchUserResults] = useState([]);

  const [dataAllUser, setdataAllUser] = useState([]);
  const currentPage = 1;
  const [searchBook, setSearchBook] = useState("");
  const [searchBookResults, setSearchBookResults] = useState([]);
  const [dataAllBook, setDataAllBook] = useState([]);
  const [borrowDate, setBorrowDate] = useState(getCurrentDateTime());
  const [dueDate, setDuaDate] = useState("");

  const [typeDate, setTypeDate] = useState("borrowDate")
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errStartDate, setErrStartDate] = useState("");
  const [errEndDate, setErrEndDate] = useState("");
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
  };

  const fetchData = async () => {
    try {
      const result = await BorrowBook.getBorrowBooks({
        page,
        perPage: recordsPerPage,
      });
      const access_token = localStorage.getItem("access_token");
      const dataUser = await UserService.getAllUser(
        access_token,
        1000,
        currentPage
      );

      const dataBook = await BookServices.getBooks({ page: 1, perPage: 1000 });
      setDataAllBook(dataBook.data.data);
      setdataAllUser(dataUser.data);
      setDatas(result.data.data);
      console.log("setDatas: ", result.data.data, 'setdataAllUser: ', dataUser.data, 'dataBook: ', dataBook.data.data);
      setTotalPages(result.data.countPage || 1);
      setTotalRecords(result.data.count || 0);
    } catch (error) {
      console.error(
        `ERR: http://localhost:1234/api/borrowbook/get?page=${page}\n`,
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, recordsPerPage]);

  // Hàm mở modal add
  const handleAddBook = async () => {

    setModalOpen(true);
  };

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
        dueDate: dueDate,
      });

      if (result.status === "success") {
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
    console.log("dataAllUser", dataAllUser);
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
  const handleRecordsPerPageChange = (e, { value }) => {
    setRecordsPerPage(value);
    setPage(1); // Reset to the first page when changing records per page
  };

  const handleBookResultSelect = (e, { result }) => {
    if (!result) {
      setErrBook("Please select a book");
    } else {
      setErrBook(""); // Xóa thông báo lỗi nếu giá trị không trống
    }
    setSelectedBookId(result.id);
    setSelectedBookTitle(result.title);
    setSelectedBookAuthor(result.description);
  };
  const handlePageChange = (page) => {
    // Fetch data for the selected page
    // You need to implement the logic for fetching data based on the page number
    // console.log(`Fetching data for page ${page}`);
    setPage(page);
  };

  const handleUserResultSelect = (e, { result }) => {
    console.log("result", result);
    // Access additional properties from the selected result
    if (!result) {
      setErrUsername("Please select a username");
    } else {
      setErrUsername(""); // Xóa thông báo lỗi nếu giá trị không trống
    }
    setSelectedUserId(result.id);
    setSelectedUserName(result.title);
    setSelectedUserEmail(result.description);
  };

  //lấy ngày hiện tại cho  datetime
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
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
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear();
      const hours = String(selectedDate.getHours()).padStart(2, "0");
      const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      setDuaDate(formattedDate);
    }
  }

  const handleReturnbook = (id) => {
    setSelectedUserId(id);
    console.log(id);
    console.log(selectedUserId);
    handleOpenModalReturnBook();
  };

  const handleOpenModalReturnBook = () => {
    setOpenModalReturnBook(true);
  };

  const handleDetailBorrow = async (idUser, idBook) => {
    // console.log(idUser);
    // console.log(idBook);

    const resultBook = await BookServices.getDetailBook({
      idBook: idBook,
    });
    setDetailBook(resultBook);

    const access_token = localStorage.getItem("access_token");
    const resultUser = await UserService.getDetailUser({
      accessToken: access_token,
      idUser: idUser,
    });
    setDetailUser(resultUser);

    handleOpenDetailBorrow();
  };

  const handleOpenDetailBorrow = () => {
    setOpenModalDetailBorrow(true);
  };
  // Add these helper functions in your component:

  const getUserNameById = (userId) => {
    const user = dataAllUser.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  const getBookTitleById = (bookId) => {
    const book = dataAllBook.find((book) => book.id === bookId);
    return book ? book.title : "Unknown Book";
  };

  const handleCloseModalReturnBook = () => {
    setOpenModalReturnBook(false);
  };
  //trả sách
  const handleReturnBookYes = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log("ID: ", selectedUserId, "   Time: ", formattedDate);
    const result = await BorrowBook.updateBorrowBooks({
      id: selectedUserId,
      returnDate: formattedDate,
    });

    if (result.status === "success") {
      Notification("Trả sách thành công", "", "success");
    } else {
      Notification("Trả sách thất bại", "", "error");
      return false; // Registration failed
    }
    setErrDefault();
    handleCloseModalReturnBook();
    fetchData();
  };

  const handleExportExcel = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      await BorrowBook.exportExcel(access_token);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleSearchChange = async (e, { value }) => {
    // setSearchQuery(value);

    // const searchResults = [
    //   { name: `Email : ${value}`, type: "email", value: `${value}` },
    //   { name: `Name : ${value}`, type: "name", value: `${value}` },
    //   { name: `Phone : ${value}`, type: "phone", value: `${value}` },
    //   { name: `Address : ${value}`, type: "address", value: `${value}` },
    // ];

    // setSearchResults(searchResults);
  };

  const handleSearchResultSelect = async (e, { result }) => {
    // setSearchQuery(result.value);

    // const searchType = result.description;

    // try {
    //   const access_token = localStorage.getItem("access_token");
    //   const res = await UserService.getAllUserSearch(
    //     access_token,
    //     recordsPerPage,
    //     currentPage,
    //     searchType,
    //     result.title.split(":")[1].trim()
    //   );
    //   setdataAllUser(res?.data);
    //   setTotalPages(res?.totalPage || 1);
    //   setTotalRecords(res?.total || 0);
    // } catch (error) {
    //   console.error(error);
    // }
  };


  const handleOpenModalSearch = () => {
    setOpenModalSearch(true);
  }

  const handleModalSearch = async () => {
    try {
      const result = await BorrowBook.searchBorrowBookByDate({
        startDate,
        endDate,
        typeDate,
        page,
        perPage: recordsPerPage,
      });
      setDatas(result.data.data);
      console.log("setDatas: ", result.data.data);
      setTotalPages(result.data.countPage || 1);
      setTotalRecords(result.data.count || 0);
    } catch (error) {
      console.error(
        `ERR: http://localhost:1234/api/borrowbook/searchbydate?page=${page}\n`,
        error
      );
    }

    setStartDate("");
    setEndDate("");
    setTypeDate("borrowDate");
    setErrDefault();
    setOpenModalSearch(false);
  }

  return (
    <Container className="ContainerBorrowManagement">
      <Header className="HeaderManagement" as="h1" textAlign="center">
        <Icon name="address book"></Icon>{" "}
        {language === LANGUAGES.VI
          ? languageDataVi.content.bookBorrowManagement
            .bookBorrowManagementTitle
          : languageDataEn.content.bookBorrowManagement
            .bookBorrowManagementTitle}
      </Header>

      <div className="header-actions">
        <Button primary onClick={handleAddBook} className="ButtonAdd">
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

          {/* <Search
            className="search"
            placeholder={
              language === LANGUAGES.VI
                ? languageDataVi.content.userManagement.search
                : languageDataEn.content.userManagement.search
            }
            onSearchChange={handleSearchChange}
            onResultSelect={handleSearchResultSelect}
            value={searchQuery}
            results={searchResults.map((user, index) => ({
              key: index,
              title: user.name,
              description: user.type,
              value: user.value,
            }))}
          /> */}

          <Button className="ButtonRefresh" icon onClick={handleOpenModalSearch}>
            <Icon name="search" />
          </Button>
          <Button className="ButtonRefresh" icon onClick={handleExportExcel}>
            <Icon name="cloud download" />
          </Button>
          <Button className="ButtonRefresh" icon onClick={handleRefresh}>
            <Icon name="refresh" />
          </Button>
        </div>

        <Modal open={openModalSearch}>
          <Header
            content={
              language === LANGUAGES.VI
                ? languageDataVi.content.bookBorrowManagement.search
                : languageDataEn.content.bookBorrowManagement.search
            }
          />

          <div style={{
            paddingTop: "24px",
            paddingLeft: "24px",
            fontSize: "16px",  // Đặt cỡ chữ
          }}>
            <select
              style={{
                fontSize: "16px",  // Đặt cỡ chữ
                padding: "8px",    // Đặt kích thước padding,
              }}
              onChange={(e) => setTypeDate(e.target.value)}
            >
              <option value={"borrowDate"}>Theo ngày mượn</option>
              <option value={"dueDate"}>Theo ngày hẹn trả</option>
              <option value={"returnDate"}>Theo ngày trả</option>
            </select>
          </div>


          <Modal.Content >
            <div>
              <label style={{
                paddingRight: "395px",
              }}
              >Từ ngày</label>
              <label className="lable">Đến ngày</label>
            </div>
            <div style={{ display: "flex" }}>
              <div
                className="ui fluid icon input text-right"
                style={{
                  minWidth: "415px",
                  width: "100%",
                  marginRight: "27px",
                  marginTop: "5px"
                }}
              >
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                {errStartDate && (
                  <div className="error-message">{errStartDate}</div>
                )}
              </div>

              <div
                className="ui fluid icon input text-right"
                style={{
                  minWidth: "415px",
                  width: "100%",
                  marginRight: "27px",
                  marginTop: "5px"

                }}
              >
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                {errEndDate && (
                  <div className="error-message">{errEndDate}</div>
                )}
              </div>
            </div>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" onClick={handleModalSearch}>
              <Icon name="checkmark" />
              Tìm kiếm
            </Button>
          </Modal.Actions>
        </Modal>
      </div>

      <Modal open={modalOpen} onClose={handleCloseModal} size="small">
        <Header
          content={
            language === LANGUAGES.VI
              ? languageDataVi.content.bookBorrowManagement.buttonAddBookBorrow
              : languageDataEn.content.bookBorrowManagement.buttonAddBookBorrow
          }
        />

        <Modal.Content>
          <Form>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement.searchUser
                        : languageDataEn.content.bookBorrowManagement
                          .searchUser}
                    </label>
                    <Search
                      placeholder={
                        language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.search
                          : languageDataEn.content.userManagement.search
                      }
                      onSearchChange={handleUserSearchChange}
                      onResultSelect={handleUserResultSelect}
                      value={searchUser}
                      results={searchUserResults.map((user, index) => ({
                        key: index,
                        title: user.name,
                        description: user.email, // You can customize the description as needed
                        id: user._id,
                      }))}
                    />
                    <label>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement.name
                        : languageDataEn.content.userManagement.name}
                      : {selectedUserName}
                    </label>
                    <label>Email: {selectedUserEmail}</label>
                    {errUsername && (
                      <div className="error-message">{errUsername}</div>
                    )}
                  </Form.Field>
                </Grid.Column>

                <Grid.Column>
                  <Form.Field>
                    <label>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement.searchBook
                        : languageDataEn.content.bookBorrowManagement
                          .searchBook}
                    </label>
                    <Search
                      placeholder={
                        language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.search
                          : languageDataEn.content.userManagement.search
                      }
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
                    <label>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookManagement.nameBook
                        : languageDataEn.content.bookManagement.nameBook}
                      : {selectedBookTitle}
                    </label>
                    <label>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookManagement.author
                        : languageDataEn.content.bookManagement.author}
                      : {selectedBookAuthor}
                    </label>
                    {errBook && <div className="error-message">{errBook}</div>}
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement
                          .borrowedDate
                        : languageDataEn.content.bookBorrowManagement
                          .borrowedDate}
                    </label>
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
                    <label htmlFor="duedate">
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement.dueDate
                        : languageDataEn.content.bookBorrowManagement.dueDate}
                      :
                    </label>
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
              : languageDataEn.content.userManagement.cancel}
          </Button>
          <Button positive onClick={handleSaveBorrowBook}>
            {language === LANGUAGES.VI
              ? languageDataVi.content.userManagement.save
              : languageDataEn.content.userManagement.save}
          </Button>
        </Modal.Actions>
      </Modal>
      <div className="table-container">
        <Table celled className="table-content" >

          <Table.Header className="sticky-header">
            <Table.Row>
              <Table.HeaderCell
                style={{
                  width: "20px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {" "}
                <Checkbox />
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{
                  width: "50px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {language === LANGUAGES.VI
                  ? languageDataVi.content.userManagement.stt
                  : languageDataEn.content.userManagement.stt}
              </Table.HeaderCell>

              <Table.HeaderCell
                style={{
                  width: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {" "}
                {language === LANGUAGES.VI
                  ? languageDataVi.content.bookBorrowManagement.borrower
                  : languageDataEn.content.bookBorrowManagement.borrower}
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{
                  width: "140px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {language === LANGUAGES.VI
                  ? languageDataVi.content.bookBorrowManagement.borrowedBook
                  : languageDataEn.content.bookBorrowManagement.borrowedBook}
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{
                  width: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {language === LANGUAGES.VI
                  ? languageDataVi.content.bookBorrowManagement.borrowedDate
                  : languageDataEn.content.bookBorrowManagement.borrowedDate}
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{
                  width: "110px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {language === LANGUAGES.VI
                  ? languageDataVi.content.bookBorrowManagement.dueDate
                  : languageDataEn.content.bookBorrowManagement.dueDate}
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{
                  width: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {language === LANGUAGES.VI
                  ? languageDataVi.content.bookBorrowManagement.returnDate
                  : languageDataEn.content.bookBorrowManagement.returnDate}
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{
                  width: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                }}
              >
                {language === LANGUAGES.VI
                  ? languageDataVi.content.bookBorrowManagement.status
                  : languageDataEn.content.bookBorrowManagement.status}
              </Table.HeaderCell>
              <Table.HeaderCell style={{
                textAlign: "center", width: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
              }}>
                {language === LANGUAGES.VI
                  ? languageDataVi.content.bookBorrowManagement.action
                  : languageDataEn.content.bookBorrowManagement.action}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {datas.map((data, index) => (
              <Table.Row key={index} style={{ cursor: "pointer" }}  >
                <Table.Cell>
                  <Checkbox />
                </Table.Cell>
                <Table.Cell style={{ textAlign: "center" }} onClick={() => handleDetailBorrow(data.idUser, data.idBook)}>
                  {(page - 1) * recordsPerPage + index + 1}
                </Table.Cell>


                <Table.Cell className="nameInTable" onClick={() => handleDetailBorrow(data.idUser, data.idBook)}>
                  {getUserNameById(data.idUser)}
                </Table.Cell>
                <Table.Cell onClick={() => handleDetailBorrow(data.idUser, data.idBook)}>
                  {getBookTitleById(data.idBook)}
                </Table.Cell>

                <Table.Cell style={{ textAlign: "center" }} onClick={() => handleDetailBorrow(data.idUser, data.idBook)}>
                  {moment(data.borrowDate).format("DD/MM/YYYY HH:mm")}
                </Table.Cell>
                <Table.Cell style={{ textAlign: "center" }} onClick={() => handleDetailBorrow(data.idUser, data.idBook)}>
                  {moment(data.dueDate).format("DD/MM/YYYY")}
                </Table.Cell>
                <Table.Cell style={{ textAlign: "center" }} onClick={() => handleDetailBorrow(data.idUser, data.idBook)}>
                  {data.returnDate
                    ? moment(data.returnDate).format("DD/MM/YYYY HH:mm")
                    : "-----"}
                </Table.Cell>
                <Table.Cell onClick={() => handleDetailBorrow(data.idUser, data.idBook)}>{getStatusText(data.status)}</Table.Cell>
                <Table.Cell style={{ textAlign: "center" }}>
                  {data.status !== 2 && ( // Render only if status is not "Đã trả" (status 2)
                    <Icon
                      size="big"
                      name="undo alternate"
                      onClick={() => handleReturnbook(data._id)}
                      color="grey"
                    />
                  )}
                </Table.Cell>

                <Modal
                  open={openModalDetailBorrow}
                  onClose={() => setOpenModalDetailBorrow(false)}
                >
                  <Header
                    content={
                      language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement.detailBorrow
                        : languageDataEn.content.bookBorrowManagement.detailBorrow
                    }
                  />
                  <Modal.Content style={{ display: "flex" }}>
                    <div style={{ flex: "50%", paddingRight: "20px", backgroundColor: "rgb(255 114 114)", borderRadius: "6%" }}>
                      <h3 style={{ marginLeft: "30%", paddingTop: "10px" }}>{
                        language === LANGUAGES.VI
                          ? languageDataVi.content.bookBorrowManagement.informationBook
                          : languageDataEn.content.bookBorrowManagement.informationBook
                      }</h3>
                      {detailBook && detailBook.data && (
                        <div>
                          <p style={{ marginLeft: "6%" }}>ID: {detailBook.data.data.id}</p>
                          <p style={{ marginLeft: "6%" }}> {
                            language === LANGUAGES.VI
                              ? languageDataVi.content.bookManagement.nameBook
                              : languageDataEn.content.bookManagement.nameBook
                          }: {detailBook.data.data.title}</p>
                          <p style={{ marginLeft: "6%" }}>{
                            language === LANGUAGES.VI
                              ? languageDataVi.content.bookManagement.category
                              : languageDataEn.content.bookManagement.category
                          }: {detailBook.data.data.category}</p>

                          <p style={{ marginLeft: "6%" }}>{
                            language === LANGUAGES.VI
                              ? languageDataVi.content.bookManagement.yearPublication
                              : languageDataEn.content.bookManagement.yearPublication
                          }: {detailBook.data.data.publishYear}</p>
                          <p style={{ marginLeft: "6%" }}>{
                            language === LANGUAGES.VI
                              ? languageDataVi.content.bookManagement.author
                              : languageDataEn.content.bookManagement.author
                          }: {detailBook.data.data.authorBook}</p>
                        </div>
                      )}
                    </div>

                    <div style={{ flex: "50%", paddingLeft: "20px", backgroundColor: "aqua", borderRadius: "6%", marginLeft: "20px" }}>
                      <h3 style={{ marginLeft: "30%", paddingTop: "10px" }}>{
                        language === LANGUAGES.VI
                          ? languageDataVi.content.bookBorrowManagement.informationUser
                          : languageDataEn.content.bookBorrowManagement.informationUser
                      }</h3>
                      {detailUser && detailUser.data && (
                        <div>
                          <p style={{ marginLeft: "1%" }}>ID: {detailUser.data._id}</p>
                          <p style={{ marginLeft: "1%" }}>{
                            language === LANGUAGES.VI
                              ? languageDataVi.content.userManagement.name
                              : languageDataEn.content.userManagement.name
                          }: {detailUser.data.name}</p>
                          <p style={{ marginLeft: "1%" }}>{
                            language === LANGUAGES.VI
                              ? languageDataVi.content.userManagement.email
                              : languageDataEn.content.userManagement.email
                          }: {detailUser.data.email}</p>
                          <p style={{ marginLeft: "1%" }}>{
                            language === LANGUAGES.VI
                              ? languageDataVi.content.userManagement.phone
                              : languageDataEn.content.userManagement.phone
                          }: {detailUser.data.phone}</p>
                          <p style={{ marginLeft: "1%", marginBottom: "10px" }}>{
                            language === LANGUAGES.VI
                              ? languageDataVi.content.userManagement.address
                              : languageDataEn.content.userManagement.address
                          }: {detailUser.data.address}</p>
                        </div>
                      )}
                    </div>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      color="green"
                      onClick={() => setOpenModalDetailBorrow(false)}
                    >
                      <Icon name="checkmark" />
                      OK
                    </Button>
                  </Modal.Actions>
                </Modal>

                <Modal
                  open={openModalReturnBook}
                  onClose={() => setOpenModalReturnBook(false)}
                // onOpen={() => setOpen(true)}
                >
                  <Header
                    content={
                      language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement.returnBook
                        : languageDataEn.content.bookBorrowManagement.returnBook
                    }
                  />
                  <Modal.Content>
                    <p>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement.areYouSure
                        : languageDataEn.content.bookBorrowManagement.areYouSure}
                    </p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      color="red"
                      onClick={() => setOpenModalReturnBook(false)}
                    >
                      <Icon name="remove" />{" "}
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement.no
                        : languageDataEn.content.bookBorrowManagement.no}
                    </Button>
                    <Button color="green" onClick={() => handleReturnBookYes()}>
                      <Icon name="checkmark" />{" "}
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.bookBorrowManagement.yes
                        : languageDataEn.content.bookBorrowManagement.yes}
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer className="TableFooter">
            <Table.Row>
              <Table.HeaderCell colSpan="10">
                <Menu style={{ padding: "11px", marginLeft: "3px", fontSize: "12px" }} className="MenuHeaderBorrow" floated="left">
                  <Header size="small">
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.found
                      : languageDataEn.content.userManagement.found}{" "}
                    {totalRecords}{" "}
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.records
                      : languageDataEn.content.userManagement.records}
                  </Header>
                </Menu>
                <Menu className="MenuHeaderBorrowPagination" floated="right" pagination>
                  <Menu.Item
                    as="a"
                    icon
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    size="mini"
                  >
                    <Icon name="chevron left" />
                  </Menu.Item>

                  {/* Render page numbers dynamically with ellipsis */}
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageChange = i + 1;

                    // Show the current page and some pages around it
                    if (
                      pageChange === 1 ||
                      pageChange === totalPages ||
                      (pageChange >= page - 2 && pageChange <= page + 2)
                    ) {
                      return (
                        <Menu.Item
                          key={pageChange}
                          as="a"
                          onClick={() => handlePageChange(pageChange)}
                          active={page === pageChange}
                          size="mini"
                        >
                          {pageChange}
                        </Menu.Item>
                      );
                    }

                    // Show ellipsis for omitted pages
                    if (pageChange === page - 3 || pageChange === page + 3) {
                      return (
                        <Menu.Item key={pageChange} disabled size="mini">
                          ...
                        </Menu.Item>
                      );
                    }

                    return null;
                  })}

                  <Menu.Item
                    as="a"
                    icon
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    size="mini"
                  >
                    <Icon name="chevron right" />
                  </Menu.Item>

                  <Dropdown
                    className="DropdownLimitPage"
                    selection
                    compact
                    options={[
                      {
                        key: 1,
                        text: `1 ${language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.recordPage
                          : languageDataEn.content.userManagement.recordPage
                          }`,
                        value: 1,
                      },
                      {
                        key: 5,
                        text: `5 ${language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.recordPage
                          : languageDataEn.content.userManagement.recordPage
                          }`,
                        value: 5,
                      },
                      {
                        key: 15,
                        text: `15 ${language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.recordPage
                          : languageDataEn.content.userManagement.recordPage
                          }`,
                        value: 15,
                      },
                      {
                        key: 30,
                        text: `30 ${language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.recordPage
                          : languageDataEn.content.userManagement.recordPage
                          }`,
                        value: 30,
                      },
                      {
                        key: 50,
                        text: `50 ${language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.recordPage
                          : languageDataEn.content.userManagement.recordPage
                          }`,
                        value: 50,
                      },
                      {
                        key: 100,
                        text: `100 ${language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.recordPage
                          : languageDataEn.content.userManagement.recordPage
                          }`,
                        value: 100,
                      },
                      {
                        key: 200,
                        text: `200 ${language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.recordPage
                          : languageDataEn.content.userManagement.recordPage
                          }`,
                        value: 200,
                      },
                    ]}
                    value={recordsPerPage}
                    onChange={handleRecordsPerPageChange}
                  />
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    </Container>
  );
};

export default BorrowManagement;
