import React, { useState, useEffect } from "react";
import {
  Icon,
  Table,
  Header,
  Container,
  Menu,
  Checkbox,
  Dimmer,
  Loader,
  Button,
  Modal,
  Form,
  Grid,
  Dropdown,
  Search,
} from "semantic-ui-react";
import "./style.scss";
import * as UserService from "../../services/UserService";
import { Notification } from "../../components/Notification/Notification";

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [dataAllUser, setdataAllUser] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  // ============= Initial State Start here =============
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const isDeleteButtonVisible = selectedCheckboxes.length > 0;
  const [selectedCount, setSelectedCount] = useState(0);

  // ============= Event Handler Start here =============

  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
    setErrPhone("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
    setErrAddress("");
  };
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalOpen(false);
  };
  const handleConfirmDelete = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      // Call the API to delete the user using userToDelete._id
      const res = await UserService.deleteUser(access_token, userToDelete._id);
      // Handle the response as needed
      if (res.code === 200) {
        // User deleted successfully
        await fetchData(); // Fetch data again after deletion
        Notification("Xóa thành công", res.message, "success");
      } else {
        Notification("Xóa thất bại", res.message, "error");
      }
    } catch (error) {
      console.error("Error deleting user", error);
    } finally {
      handleCloseDeleteModal(); // Close the modal after deletion attempt
    }
  };
  const handleRecordsPerPageChange = (e, { value }) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to the first page when changing records per page
  };
  // ================= Email Validation start here =============
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  const handleSearchChange = async (e, { value }) => {
    setSearchQuery(value);

    const searchResults = [
      { name: `Email : ${value}`, type: "email", value: `${value}` },
      { name: `Name : ${value}`, type: "name", value: `${value}` },
      { name: `Phone : ${value}`, type: "phone", value: `${value}` },
      { name: `Address : ${value}`, type: "address", value: `${value}` },
    ];

    setSearchResults(searchResults);
  };
  const handleSaveEditUser = async () => {
    // Get the user data from the state variables (editEmail, editPassword, etc.)
    const editedUserData = {
      email: editEmail,
      name: editName,
      phone: editPhone,
      address: editAddress,

      // Add other user fields if needed
    };
    console.log("editedUserData", editedUserData);

    // Add logic to send the edited user data to the API
    // For example:
    try {
      const access_token = localStorage.getItem("access_token");
      const res = await UserService.updateUserInfo(
        access_token,
        selectedUser._id,
        editedUserData
      );
      // Handle the response as needed
      if (res.code === 200) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error editing user", error);
    }

    // Close the modal after saving
    setModalOpenEdit(false);
  };

  // ================= Email Validation End here ===============
  const handleSignUp = async (e) => {
    try {
      if (!clientName) return setErrClientName("Enter your name");
      if (!email) return setErrEmail("Enter your email");
      if (!EmailValidation(email))
        return setErrEmail("Kiểm tra định dạng Email!");
      if (!phone) return setErrPhone("Enter your phone number");
      if (!password) return setErrPassword("Create a password");
      if (password.length < 6)
        return setErrPassword("Passwords must be at least 6 characters");
      if (!address) return setErrAddress("Enter your address");

      const res = await UserService.signUpAccount(
        clientName,
        email,
        password,
        phone,
        address
      );
      console.log("res", res);
      const dataSignUp = res?.response?.data;
      console.log("dataSignUp", dataSignUp);
      if (res?.code === 200) {
        setSuccessMsg(res.message);
        setClientName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setAddress("");

        Notification("Đăng ký thành công", res.message, "success");
        return true; // Registration succeeded
      } else if (dataSignUp.code !== 200) {
        Notification("Đăng ký thất bại", dataSignUp.message, "error");
        return false; // Registration failed
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setSelectedCount(selectedCheckboxes.length);
  }, [selectedCheckboxes]);
  const fetchData = async () => {
    const access_token = localStorage.getItem("access_token");
    // const limit = 10; // Set the limit to 1
    const res = await UserService.getAllUser(
      access_token,
      recordsPerPage,
      currentPage
    );
    console.log("res", res);
    setdataAllUser(res?.data);
    setTotalPages(res?.totalPage || 1);
    setTotalRecords(res?.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // Initial fetch when the component mounts
  }, [currentPage, recordsPerPage]);

  const handleSearchResultSelect = async (e, { result }) => {
    setSearchQuery(result.value);

    // Determine the search type based on the selected result
    const searchType = result.description;

    // Make an API call to search for users based on the selected type and keyword

    try {
      const access_token = localStorage.getItem("access_token");
      const res = await UserService.getAllUserSearch(
        access_token,
        recordsPerPage,
        currentPage,
        searchType,
        result.title.split(":")[1].trim()
      );
      setdataAllUser(res?.data);
      setTotalPages(res?.totalPage || 1);
      setTotalRecords(res?.total || 0);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageChange = (page) => {
    // Fetch data for the selected page
    // You need to implement the logic for fetching data based on the page number
    // console.log(`Fetching data for page ${page}`);
    setCurrentPage(page);
  };
  const handleAddUser = () => {
    // Open the modal when adding a new user
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setModalOpen(false);
  };
  const handleCloseModalEdit = () => {
    // Close the modal
    setModalOpenEdit(false);
  };

  const handleSaveUser = async () => {
    try {
      const registrationSucceeded = await handleSignUp();
      fetchData();

      if (registrationSucceeded) {
        setModalOpen(false); // Close the modal on successful registration
      }
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
      setLoading(false); // Set loading back to false after the API call is complete
    }
  };
  const handleCheckboxChange = (userId) => {
    setSelectedCheckboxes((prevSelected) => {
      if (prevSelected.includes(userId)) {
        // If user is already selected, remove it
        return prevSelected.filter((id) => id !== userId);
      } else {
        // If user is not selected, add it
        return [...prevSelected, userId];
      }
    });
  };

  const handleEditUser = (user) => {
    console.log("user", user);
    setSelectedUser(user);
    setEditEmail(user.email);
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditAddress(user.address);

    setModalOpenEdit(true);
  };
  const handleDeleteSelected = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const res = await UserService.deleteManyUser(
        access_token,
        selectedCheckboxes
      );

      // Handle the response as needed
      if (res.code === 200) {
        // Users deleted successfully
        await fetchData(); // Fetch data again after deletion
        Notification("Xóa thành công", res.message, "success");
      } else {
        Notification("Xóa thất bại", res.message, "error");
      }
    } catch (error) {
      console.error("Error deleting users", error);
    } finally {
      setSelectedCheckboxes([]); // Clear the selected checkboxes after deletion
    }
  };

  return (
    <>
      <Container className="ContainerUserManagement">
        <Header as="h1" textAlign="center">
          User Management
        </Header>

        <div className="header-actions">
          <Button
            className="ButtonHandleAddUser"
            primary
            onClick={handleAddUser}
          >
            Thêm Người Dùng
          </Button>
          <div style={{ display: "flex" }}>
          {isDeleteButtonVisible && (
            <Button
            className="ButtonDeleteSelected"
            negative
            onClick={handleDeleteSelected}
          >
            {selectedCount > 1 ? `Xóa ${selectedCount} lựa chọn` : "Xóa 1 lựa chọn"}
          </Button>
            )}
            <Button className="ButtonRefresh" icon onClick={handleRefresh}>
              <Icon name="refresh" />
            </Button>
            <Search
              placeholder="Search..."
              onSearchChange={handleSearchChange}
              onResultSelect={handleSearchResultSelect}
              value={searchQuery}
              results={searchResults.map((user, index) => ({
                key: index,
                title: user.name,
                description: user.type,
                value: user.value,
              }))}
            />
          </div>
        </div>
        <Modal open={modalOpen} onClose={handleCloseModal} size="small">
          <Header content="Thêm Người Dùng" />
          <Modal.Content>
            <Form>
              <Grid>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Form.Field>
                      <label>Email</label>
                      <input
                        onChange={handleEmail}
                        value={email}
                        type="email"
                        placeholder="john@workemail.com"
                      />
                      {errEmail && (
                        <div className="error-message">{errEmail}</div>
                      )}
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field>
                      <label>Password</label>
                      <input
                        onChange={handlePassword}
                        value={password}
                        minLength={6}
                        type="password"
                        placeholder="Create password"
                      />
                      {errPassword && (
                        <div className="error-message">{errPassword}</div>
                      )}
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Form.Field>
                      <label>Name</label>
                      <input
                        onChange={handleName}
                        value={clientName}
                        type="text"
                        placeholder="eg. John Doe"
                      />
                      {errClientName && (
                        <div className="error-message">{errClientName}</div>
                      )}
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field>
                      <label>Phone</label>
                      <input
                        onChange={handlePhone}
                        value={phone}
                        type="text"
                        placeholder="0123456789"
                      />
                      {errPhone && (
                        <div className="error-message">{errPhone}</div>
                      )}
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column>
                    <Form.Field>
                      <label>Address</label>
                      <input
                        onChange={handleAddress}
                        value={address}
                        type="text"
                        placeholder="road-001, house-115, example area"
                      />
                      {errAddress && (
                        <div className="error-message">{errAddress}</div>
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
            <Button positive onClick={handleSaveUser}>
              Lưu
            </Button>
          </Modal.Actions>
        </Modal>
        <div className="table-container">
          <Dimmer.Dimmable className="DimmerTable" as={Table} dimmed={loading}>
            <Dimmer active={loading} inverted>
              <Loader inverted>Loading...</Loader>
            </Dimmer>
            <Table className="table-content" celled>
              <Table.Header className="sticky-header">
                <Table.Row>
                  <Table.HeaderCell
                    style={{
                      width: "20px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Checkbox />
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "20px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    STT
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Email
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Phone
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Address
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Role
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    Action
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {loading && (
                <Dimmer active>
                  <Loader inverted indeterminate>
                    Loading...
                  </Loader>
                </Dimmer>
              )}
              <Table.Body>
                {dataAllUser?.map((user, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Checkbox
                        checked={selectedCheckboxes.includes(user._id)}
                        onChange={() => handleCheckboxChange(user._id)}
                      />
                    </Table.Cell>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.phone}</Table.Cell>
                    <Table.Cell>
                      {user.address ? user.address : "chưa bổ sung"}
                    </Table.Cell>
                    <Table.Cell>
                      {user.isAdmin ? (
                        <Icon name="adn">(admin)</Icon>
                      ) : (
                        <Icon name="user">(user)</Icon>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      <Icon
                        className="IconEdit"
                        size="big"
                        name="edit"
                        onClick={() => handleEditUser(user)}
                      ></Icon>{" "}
                      <Icon
                        className="IconDelete"
                        size="big"
                        name="delete"
                        onClick={() => handleDeleteUser(user)}
                      ></Icon>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
              <Modal
                open={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                size="small"
              >
                <Header content="Xác nhận xóa người dùng" />
                <Modal.Content>
                  <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button negative onClick={handleCloseDeleteModal}>
                    Hủy
                  </Button>
                  <Button positive onClick={handleConfirmDelete}>
                    Xác nhận
                  </Button>
                </Modal.Actions>
              </Modal>
              <Modal
                open={modalOpenEdit}
                onClose={handleCloseModalEdit}
                size="small"
              >
                <Header content="Sửa Người Dùng" />
                <Modal.Content>
                  <Form>
                    <Grid>
                      <Grid.Row columns={2}>
                        <Grid.Column>
                          <Form.Field>
                            <label>Email</label>
                            <input
                              onChange={(e) => setEditEmail(e.target.value)}
                              value={editEmail}
                              type="email"
                              placeholder="john@workemail.com"
                              readOnly
                            />
                            {errEmail && (
                              <div className="error-message">{errEmail}</div>
                            )}
                          </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                          <Form.Field>
                            <label>Phone</label>
                            <input
                              onChange={(e) => setEditPhone(e.target.value)}
                              value={editPhone}
                              type="text"
                              placeholder="0398870512"
                            />
                            {errPhone && (
                              <div className="error-message">{errPhone}</div>
                            )}
                          </Form.Field>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row columns={2}>
                        <Grid.Column>
                          <Form.Field>
                            <label>Name</label>
                            <input
                              onChange={(e) => setEditName(e.target.value)}
                              value={editName}
                              type="text"
                              placeholder="Đào Quang Huy Hoàng"
                            />
                            {errClientName && (
                              <div className="error-message">
                                {errClientName}
                              </div>
                            )}
                          </Form.Field>
                        </Grid.Column>
                        <Grid.Column>
                          <Form.Field>
                            <label>Address</label>
                            <input
                              onChange={(e) => setEditAddress(e.target.value)}
                              value={editAddress}
                              type="text"
                            />
                            {errAddress && (
                              <div className="error-message">{errAddress}</div>
                            )}
                          </Form.Field>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Form>
                </Modal.Content>
                <Modal.Actions>
                  <Button negative onClick={handleCloseModalEdit}>
                    Hủy
                  </Button>
                  <Button positive onClick={handleSaveEditUser}>
                    Lưu
                  </Button>
                </Modal.Actions>
              </Modal>

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
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <Icon name="chevron left" />
                      </Menu.Item>

                      {/* Render page numbers dynamically with ellipsis */}
                      {Array.from({ length: totalPages }, (_, i) => {
                        const page = i + 1;

                        // Show the current page and some pages around it
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <Menu.Item
                              key={page}
                              as="a"
                              onClick={() => handlePageChange(page)}
                              active={currentPage === page}
                            >
                              {page}
                            </Menu.Item>
                          );
                        }

                        // Show ellipsis for omitted pages
                        if (
                          page === currentPage - 3 ||
                          page === currentPage + 3
                        ) {
                          return (
                            <Menu.Item key={page} disabled>
                              ...
                            </Menu.Item>
                          );
                        }

                        return null;
                      })}

                      <Menu.Item
                        as="a"
                        icon
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <Icon name="chevron right" />
                      </Menu.Item>

                      <Dropdown
                        className="DropdownLimitPage"
                        selection
                        compact
                        options={[
                          { key: 1, text: "1 bản ghi/trang", value: 1 },
                          { key: 5, text: "5 bản ghi/trang", value: 5 },
                          { key: 15, text: "15 bản ghi/trang", value: 15 },
                          { key: 30, text: "30 bản ghi/trang", value: 30 },
                          { key: 50, text: "50 bản ghi/trang", value: 50 },
                          { key: 100, text: "100 bản ghi/trang", value: 100 },
                          { key: 200, text: "200 bản ghi/trang", value: 200 },
                        ]}
                        value={recordsPerPage}
                        onChange={handleRecordsPerPageChange}
                      />
                    </Menu>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Dimmer.Dimmable>
        </div>
      </Container>
    </>
  );
};

export default UserManagement;
