import React, { useState, useEffect } from 'react';
import { Icon, Table, Header, Container, Menu, Checkbox, Button, Modal, Form, Grid, Dropdown, Confirm } from 'semantic-ui-react';
import './style.scss';
import * as BookServices from '../../services/BookService';
import { Notification } from "../../components/Notification/Notification";


const BookManagement = () => {
  const [countPage, setCountPage] = useState(0);
  const [page, setPage] = useState(1)
  const [datas, setDatas] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false); // nút delete



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

  // Tạo danh sách năm cho Dropdown
  const years = Array.from({ length: 50 }, (_, index) => {
    const currentYear = new Date().getFullYear();
    return { key: currentYear - index, text: `${currentYear - index}`, value: currentYear - index };
  });

  const fetchData = async () => {
    try {
      const result = await BookServices.getBooks({page, perPage: 3});
      setDatas(result.data.data);
      setCountPage(result.data.countPage)
    } catch (error) {
      console.error('ERR: , error');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

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
      if (result.status === "OK") {
        Notification("Thêm mới thành công", "", "success");
      } else {
        Notification("Thêm mới thất bại", "", "error");
        return false; // Registration failed
      }

      setInPutDefault();
      handleCloseModal();
    } catch (error) {
      console.error(error);
    }
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

      if (result.status === "OK") {
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

    if (result.status === "OK") {
      Notification("Xoá thành công", "", "success");
    } else {
      Notification("Xoá thất bại", "", "error");
      return false; // Registration failed
    }
    fetchData();
    setConfirmOpen(false); // Đóng Confirm khi đã xử lý xóa
  };

  return (
    <Container className='ContainerBookManagement'>
      <Header as='h1' textAlign='center'>
        Book Management
      </Header>

      <Button primary onClick={handleAddBook}>
        Thêm Sách
      </Button>

      <Modal open={modalOpen} onClose={handleCloseModal} size="small">
        <Header content="Thêm Sách" />
        <Modal.Content>
          <Form>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form.Field>
                    <label>Tên sách</label>
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
                    <label>Thể loại</label>
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
                    <label>Số lượng</label>
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
                    <label>Năm xuất bản</label>
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
                    <label>Tác giả</label>
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
            Hủy
          </Button>
          <Button positive onClick={handleSaveBook}>
            Lưu
          </Button>
        </Modal.Actions>
      </Modal>

      <Table celled>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> <Checkbox /></Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Tên</Table.HeaderCell>
            <Table.HeaderCell>Thể loại</Table.HeaderCell>
            <Table.HeaderCell>Số lượng</Table.HeaderCell>
            <Table.HeaderCell>Năm xuất bản</Table.HeaderCell>
            <Table.HeaderCell>Tác giả</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
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
                  <Header content="Sửa thông tin Sách" />
                  <Modal.Content>
                    <Form>
                      <Grid>
                        <Grid.Row columns={2}>
                          <Grid.Column>
                            <Form.Field>
                              <label>Tên sách</label>
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
                              <label>Thể loại</label>
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
                              <label>Số lượng</label>
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
                              <label>Năm xuất bản</label>
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
                              <label>Tác giả</label>
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
                      Hủy
                    </Button>
                    <Button positive onClick={handleSaveUpdateBook}>
                      Lưu
                    </Button>
                  </Modal.Actions>
                </Modal>

                <Confirm
                  open={confirmOpen}
                  size='mini'
                  onCancel={() => setConfirmOpen(false)}
                  onConfirm={handleDelete}
                  cancelButton="No"
                  confirmButton="Yes"
                  content="Are you sure you want to delete this book?"
                />
              </Table.Cell>
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

export default BookManagement;