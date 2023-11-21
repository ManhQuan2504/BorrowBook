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
  Search
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
  const fetchData = async () => {
    const access_token = localStorage.getItem("access_token");
    // const limit = 10; // Set the limit to 1
    const res = await UserService.getAllUser(access_token, recordsPerPage, currentPage);
    console.log('res', res);
    setdataAllUser(res?.data);
    setTotalPages(res?.totalPage || 1);
    setTotalRecords(res?.total || 0)
    setLoading(false);
  };
  useEffect(() => {
    fetchData(); // Initial fetch when the component mounts
  }, [currentPage, recordsPerPage]);

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

  return (
    <>
      <Container className="ContainerUserManagement">
        <Header as="h1" textAlign="center">
          User Management
        </Header>
        {/* thêm 1 button thêm người dùng ở đây */}
        <Button className="ButtonHandleAddUser" primary onClick={handleAddUser}>
          Thêm Người Dùng
        </Button>
        {/* Modal for adding a new user */}
        
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


        <Dimmer.Dimmable className='DimmerTable' as={Table} dimmed={loading}> 
          <Dimmer  active={loading} inverted>
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
                    <Checkbox />
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
                    <Icon size="big" name="edit"></Icon>{" "}
                    <Icon size="big" name="delete"></Icon>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
       
            <Table.Footer className="TableFooter">
              <Table.Row>
        
                <Table.HeaderCell colSpan="8">
            <Menu className="MenuHeader" floated='left'>
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
           
            { key: 1, text: '1 bản ghi/trang', value: 1 },
            { key: 5, text: '5 bản ghi/trang', value: 5 },
            { key: 15, text: '15 bản ghi/trang', value: 15 },
            { key: 30, text: '30 bản ghi/trang', value: 30 },
            { key: 50, text: '50 bản ghi/trang', value: 50 },
            { key: 100, text: '100 bản ghi/trang', value: 100 },
            { key: 200, text: '200 bản ghi/trang', value: 200 },
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
