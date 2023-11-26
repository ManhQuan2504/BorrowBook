import React, { useState, useEffect } from 'react';
import { Icon, Table, Header, Container, Menu, Checkbox, Button, Modal, Form, Grid, Dropdown, Search, Confirm } from 'semantic-ui-react';
import './style.scss';
import * as BookServices from '../../services/BookService';
import { Notification } from "../../components/Notification/Notification";
import languageDataEn from "../../translations/en.json";
import languageDataVi from "../../translations/vi.json";
import { LANGUAGES } from "../../contants/path";
import { useSelector } from 'react-redux';

const BookManagement = () => {
  const [countPage, setCountPage] = useState(0);
  const [page, setPage] = useState(1)
  const [datas, setDatas] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false); // nút delete
  const [totalRecords, setTotalRecords] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(5);


  //set input add
  const [modalOpen, setModalOpen] = useState(false); //modal add
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false); //modal update
  // State để lưu ID sách cần xóa
  const [bookId, setBookId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [authorBook, setAuthorBook] = useState("");

  //set text err
  const [errTitle, setErrTitle] = useState("");
  const [errCategory, setErrCategory] = useState("");
  const [errCountInStock, setErrCountInStock] = useState("");
  const [errPublishYear, setErrPublishYear] = useState("");
  const [errAuthorBook, setErrAuthorBook] = useState("");

  const language = useSelector((state) => state.borrowBookReducer.language);


  const [totalPages, setTotalPages] = useState(1);

  // Tạo danh sách năm cho Dropdown
  const years = Array.from({ length: 50 }, (_, index) => {
    const currentYear = new Date().getFullYear();
    return { key: currentYear - index, text: `${currentYear - index}`, value: currentYear - index };
  });

  const fetchData = async () => {
    try {
      const result = await BookServices.getBooks({ page, perPage: recordsPerPage });
      setDatas(result.data.data);
      setTotalPages(result.data.countPage || 1);
      setTotalRecords(result.data.count || 0);
      setCountPage(result.data.countPage)
    } catch (error) {
      console.error('ERR: , error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, recordsPerPage]);

  const setInPutDefault = () => {
    setTitle("");
    setCategory("");
    setCountInStock("");
    setPublishYear("");
    setAuthorBook("");
  }

  // Hàm mở modal add
  const handleAddBook = () => {
    setModalOpen(true);
    setInPutDefault();
  }

  // Hàm đóng modal add
  const handleCloseModal = () => {
    setModalOpen(false);
    setInPutDefault();
  };
  const handleRecordsPerPageChange = (e, { value }) => {
    setRecordsPerPage(value);
    setPage(1); // Reset to the first page when changing records per page
  };

  // Hàm xử lý thay đổi giá trị của ô "Tên sách"
  const handleTitle = (e) => {
    setTitle(e.target.value);
    setErrTitle("");
  }

  // Hàm xử lý thay đổi giá trị của ô "Thể loại"
  const handelCategory = (e) => {
    setCategory(e.target.value);
    setErrCategory("");
  }

  // Hàm xử lý thay đổi giá trị của ô "Số lượng"
  const handleCountInStock = (e) => {
    // Chỉ cho phép nhập số
    const value = e.target.value;
    if (!isNaN(value)) {
      setCountInStock(value);
      setErrCountInStock("");
    }
  }

  // Hàm xử lý thay đổi giá trị của ô "Năm xuất bản"
  const handlePublishYear = (_, { value }) => {
    setPublishYear(value);
    setErrPublishYear("");
  }

  // Hàm xử lý thay đổi giá trị của ô "Tác giả"
  const handleAuthorBook = (e) => {
    setAuthorBook(e.target.value);
    setErrAuthorBook("");
  }

  // Hàm xử lý khi thêm mới
  const handleSaveBook = async () => {
    try {
      if (!title) return setErrTitle("Enter name book");
      if (!category) return setErrCategory("Enter book category");
      if (!countInStock) return setErrCountInStock("Enter count in stock");
      if (!publishYear) return setErrPublishYear("Enter publish year");
      if (!authorBook) return setErrAuthorBook("Enter authorbook");

      const result = await BookServices.createBook({ title, category, countInStock, publishYear, authorBook });

      console.log(result);
      if (result.status === "success") {
        Notification("Thêm mới thành công", "", "success");
      } else {
        Notification("Thêm mới thất bại", "", "error");
        return false; // Registration failed
      }

      setInPutDefault();
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageChange = (page) => {
    // Fetch data for the selected page
    // You need to implement the logic for fetching data based on the page number
    // console.log(`Fetching data for page ${page}`);
    setPage(page);
  };
  // Hàm đóng modal update
  const handleCloseUpdateModal = (id) => {
    setModalUpdateOpen(false);
  };

  //mở modal update
  const handleOpenUpdateBook = (
    id, title, category,
    countInStock, publishYear, authorBook) => {
    setModalUpdateOpen(true);
    setBookId(id);
    setTitle(title);
    setCategory(category);
    setCountInStock(countInStock);
    setPublishYear(publishYear);
    setAuthorBook(authorBook);
    console.log(id);
  }

  //xử lý update
  const handleSaveUpdateBook = async () => {
    try {
      const result = await BookServices.updateBook({
        id: bookId,
        title: title,
        category: category,
        countInStock: countInStock,
        publishYear: publishYear,
        authorBook: authorBook
      });

      if (result.status === "success") {
        Notification("Sửa thành công", "", "success");
        fetchData();
        setModalUpdateOpen(false);
      } else {
        Notification("Sửa thất bại", "", "error");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sách:", error);
      // Xử lý lỗi nếu cần thiết
      Notification("Đã xảy ra lỗi khi cập nhật sách", "", "error");
    }
  };


  const handleDeleteBook = (id) => {
    console.log(id);
    setConfirmOpen(true);
    setBookId(id); // Lưu ID sách cần xóa khi mở Confirm
  };



  // Thay đổi hàm handleDelete để sử dụng bookIdToDelete
  const handleDelete = async () => {
    console.log(`Deleting book with ID: ${bookId}`);
    // Thực hiện logic xóa sách ở đây
    const result = await BookServices.deleteBook({ id: bookId });

    if (result.status === "success") {
      Notification("Xoá thành công", "", "success");
    } else {
      Notification("Xoá thất bại", "", "error");
      return false; // Registration failed
    }
    fetchData();
    setConfirmOpen(false); // Đóng Confirm khi đã xử lý xóa
  };

  const handleExportExcel = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      await BookServices.exportExcel(access_token);

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
        <Icon name="book"></Icon> {language === LANGUAGES.VI
          ? languageDataVi.content.bookManagement.bookManagementTitle
          : languageDataEn.content.bookManagement.bookManagementTitle}
      </Header>

      <div className="header-actions">
        <Button 
        primary 
        className="ButtonHandleAddBook"
        onClick={handleAddBook}>
          {language === LANGUAGES.VI
            ? languageDataVi.content.bookManagement.buttonAddBook
            : languageDataEn.content.bookManagement.buttonAddBook}
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
          ? languageDataVi.content.bookManagement.buttonAddBook
          : languageDataEn.content.bookManagement.buttonAddBook} />
        <Modal.Content>
          <Form>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookManagement.nameBook
                      : languageDataEn.content.bookManagement.nameBook}</label>
                    <input
                      onChange={handleTitle}
                      value={title}
                      type="text"
                      placeholder="Title"
                    />
                    {errTitle && (
                      <div className="error-message">{errTitle}</div>
                    )}
                  </Form.Field>
                </Grid.Column>
                <Grid.Column>
                  <Form.Field>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookManagement.category
                      : languageDataEn.content.bookManagement.category}</label>
                    <input
                      onChange={handelCategory}
                      value={category}
                      minLength={6}
                      type="text"
                      placeholder="Category"
                    />
                    {errCategory && (
                      <div className="error-message">{errCategory}</div>
                    )}
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookManagement.quantity
                      : languageDataEn.content.bookManagement.quantity}</label>
                    <input
                      onChange={handleCountInStock}
                      value={countInStock}
                      type="text"
                      placeholder="Count in stock"
                    />
                    {errCountInStock && (
                      <div className="error-message">{errCountInStock}</div>
                    )}
                  </Form.Field>
                </Grid.Column>
                <Grid.Column>
                  <Form.Field>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookManagement.yearPublication
                      : languageDataEn.content.bookManagement.yearPublication}</label>
                    <Dropdown
                      placeholder="Select Year"
                      selection
                      options={years}
                      onChange={handlePublishYear}
                      value={publishYear}
                    />
                    {errPublishYear && (
                      <div className="error-message">{errPublishYear}</div>
                    )}
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>{language === LANGUAGES.VI
                      ? languageDataVi.content.bookManagement.author
                      : languageDataEn.content.bookManagement.author}</label>
                    <input
                      onChange={handleAuthorBook}
                      value={authorBook}
                      type="text"
                      placeholder="Author Book"
                    />
                    {errAuthorBook && (
                      <div className="error-message">{errAuthorBook}</div>
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
          <Button positive onClick={handleSaveBook}>
            {language === LANGUAGES.VI
              ? languageDataVi.content.userManagement.save
              : languageDataEn.content.userManagement.save}
          </Button>
        </Modal.Actions>
      </Modal>

      <Table celled>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> <Checkbox /></Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell> {language === LANGUAGES.VI
              ? languageDataVi.content.bookManagement.nameBook
              : languageDataEn.content.bookManagement.nameBook}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookManagement.category
              : languageDataEn.content.bookManagement.category}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookManagement.quantity
              : languageDataEn.content.bookManagement.quantity}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookManagement.yearPublication
              : languageDataEn.content.bookManagement.yearPublication}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookManagement.author
              : languageDataEn.content.bookManagement.author}</Table.HeaderCell>
            <Table.HeaderCell>{language === LANGUAGES.VI
              ? languageDataVi.content.bookManagement.action
              : languageDataEn.content.bookManagement.action}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {datas.map((data) => (
            <Table.Row key={data.id}>
              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>{data.id}</Table.Cell>
              <Table.Cell>{data.title}</Table.Cell>
              <Table.Cell>{data.category}</Table.Cell>
              <Table.Cell>{data.countInStock}</Table.Cell>
              <Table.Cell>{data.publishYear}</Table.Cell>
              <Table.Cell>{data.authorBook}</Table.Cell>
              <Table.Cell>
                <Icon size="big" name="edit" onClick={() => handleOpenUpdateBook(
                  data.id, data.title, data.category,
                  data.countInStock, data.publishYear, data.authorBook)
                }></Icon>{" "}
                <Icon size="big" name="delete" onClick={() => handleDeleteBook(data.id)} />

                <Modal open={modalUpdateOpen} onClose={handleCloseUpdateModal} size="small">
                  <Header content={language === LANGUAGES.VI
                    ? languageDataVi.content.bookManagement.editBook
                    : languageDataEn.content.bookManagement.editBook} />
                  <Modal.Content>
                    <Form>
                      <Grid>
                        <Grid.Row columns={2}>
                          <Grid.Column>
                            <Form.Field>
                              <label>{language === LANGUAGES.VI
                                ? languageDataVi.content.bookManagement.nameBook
                                : languageDataEn.content.bookManagement.nameBook}</label>
                              <input
                                onChange={handleTitle}
                                value={title}
                                type="text"
                                placeholder="Title"
                              />
                              {errTitle && (
                                <div className="error-message">{errTitle}</div>
                              )}
                            </Form.Field>
                          </Grid.Column>
                          <Grid.Column>
                            <Form.Field>
                              <label>{language === LANGUAGES.VI
                                ? languageDataVi.content.bookManagement.category
                                : languageDataEn.content.bookManagement.category}</label>
                              <input
                                onChange={handelCategory}
                                value={category}
                                minLength={6}
                                type="text"
                                placeholder="Category"
                              />
                              {errCategory && (
                                <div className="error-message">{errCategory}</div>
                              )}
                            </Form.Field>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                          <Grid.Column>
                            <Form.Field>
                              <label>{language === LANGUAGES.VI
                                ? languageDataVi.content.bookManagement.quantity
                                : languageDataEn.content.bookManagement.quantity}</label>
                              <input
                                onChange={handleCountInStock}
                                value={countInStock}
                                type="text"
                                placeholder="Count in stock"
                              />
                              {errCountInStock && (
                                <div className="error-message">{errCountInStock}</div>
                              )}
                            </Form.Field>
                          </Grid.Column>
                          <Grid.Column>
                            <Form.Field>
                              <label>{language === LANGUAGES.VI
                                ? languageDataVi.content.bookManagement.yearPublication
                                : languageDataEn.content.bookManagement.yearPublication}</label>
                              <Dropdown
                                placeholder="Select Year"
                                selection
                                options={years}
                                onChange={handlePublishYear}
                                value={publishYear}
                              />
                              {errPublishYear && (
                                <div className="error-message">{errPublishYear}</div>
                              )}
                            </Form.Field>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={2}>
                          <Grid.Column>
                            <Form.Field>
                              <label>{language === LANGUAGES.VI
                                ? languageDataVi.content.bookManagement.author
                                : languageDataEn.content.bookManagement.author}</label>
                              <input
                                onChange={handleAuthorBook}
                                value={authorBook}
                                type="text"
                                placeholder="Author Book"
                              />
                              {errAuthorBook && (
                                <div className="error-message">{errAuthorBook}</div>
                              )}
                            </Form.Field>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Form>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button negative onClick={handleCloseUpdateModal}>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement.cancel
                        : languageDataEn.content.userManagement.cancel}
                    </Button>
                    <Button positive onClick={handleSaveUpdateBook}>
                      {language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement.save
                        : languageDataEn.content.userManagement.save}
                    </Button>
                  </Modal.Actions>
                </Modal>

                <Confirm
                  open={confirmOpen}
                  size='mini'
                  onCancel={() => setConfirmOpen(false)}
                  onConfirm={handleDelete}
                  cancelButton={language === LANGUAGES.VI
                    ? languageDataVi.content.bookManagement.no
                    : languageDataEn.content.bookManagement.no}
                  confirmButton={language === LANGUAGES.VI
                    ? languageDataVi.content.bookManagement.yes
                    : languageDataEn.content.bookManagement.yes}
                  content={language === LANGUAGES.VI
                    ? languageDataVi.content.bookManagement.areYouSure
                    : languageDataEn.content.bookManagement.areYouSure}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>


        <Table.Footer className="TableFooter">
          <Table.Row>
            <Table.HeaderCell colSpan="8">
            <Menu className="MenuHeader" floated="left">
                      <Header size="small">
                        Tìm thấy {totalRecords} bản ghi
                      </Header>
                    </Menu>
              <Menu floated="right" pagination>
                <Menu.Item
                  as="a"
                  icon
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
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
                      >
                        {pageChange}
                      </Menu.Item>
                    );
                  }

                  // Show ellipsis for omitted pages
                  if (
                    pageChange === page - 3 ||
                    pageChange === page + 3
                  ) {
                    return (
                      <Menu.Item key={pageChange} disabled>
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
                        ? languageDataVi.content.userManagement
                          .recordPage
                        : languageDataEn.content.userManagement
                          .recordPage
                        }`,
                      value: 1,
                    },
                    {
                      key: 5,
                      text: `5 ${language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement
                          .recordPage
                        : languageDataEn.content.userManagement
                          .recordPage
                        }`,
                      value: 5,
                    },
                    {
                      key: 15,
                      text: `15 ${language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement
                          .recordPage
                        : languageDataEn.content.userManagement
                          .recordPage
                        }`,
                      value: 15,
                    },
                    {
                      key: 30,
                      text: `30 ${language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement
                          .recordPage
                        : languageDataEn.content.userManagement
                          .recordPage
                        }`,
                      value: 30,
                    },
                    {
                      key: 50,
                      text: `50 ${language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement
                          .recordPage
                        : languageDataEn.content.userManagement
                          .recordPage
                        }`,
                      value: 50,
                    },
                    {
                      key: 100,
                      text: `100 ${language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement
                          .recordPage
                        : languageDataEn.content.userManagement
                          .recordPage
                        }`,
                      value: 100,
                    },
                    {
                      key: 200,
                      text: `200 ${language === LANGUAGES.VI
                        ? languageDataVi.content.userManagement
                          .recordPage
                        : languageDataEn.content.userManagement
                          .recordPage
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
    </Container >
  );
};

export default BookManagement;