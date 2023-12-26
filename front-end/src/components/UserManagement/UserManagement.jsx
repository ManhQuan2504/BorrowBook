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
import { useSelector } from "react-redux";
import languageDataEn from "../../translations/en.json";
import languageDataVi from "../../translations/vi.json";
import { LANGUAGES } from "../../contants/path";
import 'typeface-roboto';
import * as BorrowBookService from '../../services/BorrowBookService';
import * as ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { format } from 'date-fns';
const UserManagement = () => {
  const language = useSelector((state) => state.borrowBookReducer.language);


  const [loading, setLoading] = useState(true);
  const [dataAllUser, setdataAllUser] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenEdit, setModalOpenEdit] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryTitle, setSearchQueryTitle] = useState("");
  const [searchQueryType, setSearchQueryType] = useState("");

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
  const [selectAllChecked, setSelectAllChecked] = useState(false);
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
      const resultSearch = await BorrowBookService.searchBorrowBookByIdBookIdUser(userToDelete._id);
      if(!resultSearch.data.data.length>0){
        const res = await UserService.deleteUser(access_token, userToDelete._id);
        if (res.code === 200) {
          // User deleted successfully
          await fetchData(); // Fetch data again after deletion
          Notification("Xóa thành công", res.message, "success");
         
        } 
      
      }else{
        Notification("Xoá thất bại", "Bản ghi ràng buộc với bảng mượn sách", "error");
       
      
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
        Notification("Sửa thành công", res.message, "success");
      } else {
        Notification("Sửa thất bại", res.message, "error");
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
      // if (!password) return setErrPassword("Create a password");
      // if (password.length < 6)
      //   return setErrPassword("Passwords must be at least 6 characters");
      if (!address) return setErrAddress("Enter your address");

      const res = await UserService.signUpAccount(
        clientName,
        email,
        '123456',
        phone,
        address,
        language
      );
      const dataSignUp = res?.response?.data;
      if (res?.code === 200) {
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
    const res = await UserService.getAllUserSearch(
      {  accessToken:access_token,
        limit:recordsPerPage,
        page:currentPage,
        type:searchQueryType,
        key:searchQueryTitle 
      }
      );
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
    setSearchQueryTitle(result.title.split(":")[1].trim());
    setSearchQueryType(result.description);


    // const searchType = result.description;

    try {
      const access_token = localStorage.getItem("access_token");
      const res = await UserService.getAllUserSearch(
      {  accessToken:access_token,
        limit:recordsPerPage,
        page:currentPage,
        type:result.description,
        key:result.title.split(":")[1].trim()
      }
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

  const handleExportExcel = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
     const dataExcelExport = await UserService.getAllUserSearch({
        accessToken: access_token,
        type: searchQueryType,
        key: searchQueryTitle
      });
  const dataList = Array.from(dataExcelExport.data);
  console.log("🚀 ~ file: UserManagement.jsx:334 ~ handleExportExcel ~ dataList:", dataList)
  
  const resp = await fetch(new Request("/files/templatesExcelUser.xlsx"));
  const buff = resp.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buff);
  const sheetData = workbook.getWorksheet(1);

  let rowIndex = 1;

  for (const item of dataList) {
    const {
      name, email,
      phone, address
      
    } = item;
    rowIndex++;
    sheetData.getCell(`A${rowIndex}`).value = rowIndex-1;
    sheetData.getCell(`B${rowIndex}`).value = name ? name : "";
    sheetData.getCell(`C${rowIndex}`).value = email? email : "";
    sheetData.getCell(`D${rowIndex}`).value = phone? phone : "";
    sheetData.getCell(`E${rowIndex}`).value = address? address : "";

  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "applicationi/xlsx" });
  FileSaver.saveAs(blob, `DataUser-${format(new Date(), "yyMMddHHmm")}.xlsx`);

    } catch (error) {
      console.error(error);
    }
  }

  const handleCheckboxChange = (userId) => {
    if (userId === "selectAll") {
      // Handle "Select All" checkbox separately
      setSelectAllChecked(!selectAllChecked);
      setSelectedCheckboxes(
        selectAllChecked ? [] : dataAllUser.map((user) => user._id)
      );
    } else {
      setSelectedCheckboxes((prevSelected) => {
        if (prevSelected.includes(userId)) {
          return prevSelected.filter((id) => id !== userId);
        } else {
          return [...prevSelected, userId];
        }
      });
    }
  };

  const handleEditUser = (user) => {
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

      if (res.code === 200) {
        await fetchData();
        Notification("Xóa thành công", res.message, "success");
      } else {
        Notification("Xóa thất bại", res.message, "error");
      }
    } catch (error) {
      console.error("Error deleting users", error);
    } finally {
      setSelectedCheckboxes([]);
      setSelectAllChecked(false); // Reset "Select All" checkbox state
    }
  };

  return (
    <>
      <Container className="ContainerUserManagement">
        <Header className="HeaderManagement" as="h1" textAlign="center">
          <Icon name="user outline"></Icon>
          {language === LANGUAGES.VI
            ? languageDataVi.content.userManagement.userManagementTitle
            : languageDataEn.content.userManagement.userManagementTitle}
        </Header>

        <div className="header-actions">
          <Button
            className="ButtonHandleAddUser"
            primary
            onClick={handleAddUser}
          >
            {language === LANGUAGES.VI
              ? languageDataVi.content.userManagement.buttonAddUser
              : languageDataEn.content.userManagement.buttonAddUser}
          </Button>
          <div style={{ display: "flex" }}>
            {isDeleteButtonVisible && (
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
            )}
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
              onSearchChange={handleSearchChange}
              onResultSelect={handleSearchResultSelect}
              value={searchQuery}
              results={searchResults.map((user, index) => ({
                key: index,
                title: user.name,
                description: user.type,
                value: user.value,
              }))}
              className="SearchUserManagement"
            />
          </div>
        </div>
        <Modal open={modalOpen} onClose={handleCloseModal} size="small">
          <Header content={
            language === LANGUAGES.VI
              ? languageDataVi.content.userManagement.buttonAddUser
              : languageDataEn.content.userManagement.buttonAddUser
          } />
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
                      <label>{
                        language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.name
                          : languageDataEn.content.userManagement.name
                      }</label>
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
                    <Form.Field hidden>
                      <label>{
                        language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.password
                          : languageDataEn.content.userManagement.password
                      }</label>
                      <input
                        onChange={handlePassword}
                        value='123456'
                        minLength={6}
                        type="password"
                        placeholder={
                          language === LANGUAGES.VI
                            ? languageDataVi.content.userManagement.password
                            : languageDataEn.content.userManagement.password
                        }

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
                      <label>{
                        language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.phone
                          : languageDataEn.content.userManagement.phone
                      }</label>
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
                  <Grid.Column>
                    <Form.Field>
                      <label>{
                        language === LANGUAGES.VI
                          ? languageDataVi.content.userManagement.address
                          : languageDataEn.content.userManagement.address
                      }</label>
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
                <Grid.Row columns={2}>

                </Grid.Row>
              </Grid>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={handleCloseModal}>
              {
                language === LANGUAGES.VI
                  ? languageDataVi.content.userManagement.cancel
                  : languageDataEn.content.userManagement.cancel
              }
            </Button>
            <Button positive onClick={handleSaveUser}>
              {
                language === LANGUAGES.VI
                  ? languageDataVi.content.userManagement.save
                  : languageDataEn.content.userManagement.save
              }
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
                    <Checkbox
                      checked={selectAllChecked}
                      onChange={() => handleCheckboxChange("selectAll")}
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "50px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.stt
                      : languageDataEn.content.userManagement.stt}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.name
                      : languageDataEn.content.userManagement.name}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.email
                      : languageDataEn.content.userManagement.email}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.phone
                      : languageDataEn.content.userManagement.phone}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.address
                      : languageDataEn.content.userManagement.address}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.role
                      : languageDataEn.content.userManagement.role}
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    style={{
                      width: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center"
                    }}
                  >
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.action
                      : languageDataEn.content.userManagement.action}
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
                    <Table.Cell style={{ textAlign: "center" }}> {(currentPage - 1) * recordsPerPage + index + 1}</Table.Cell>
                    <Table.Cell style={{ cursor: "pointer" }} onClick={() => handleEditUser(user)}>{user.name}</Table.Cell>
                    <Table.Cell style={{ cursor: "pointer" }} onClick={() => handleEditUser(user)}>{user.email}</Table.Cell>
                    <Table.Cell style={{ textAlign: "right", cursor: "pointer" }} onClick={() => handleEditUser(user)}>{user.phone}</Table.Cell>
                    <Table.Cell style={{ cursor: "pointer" }} onClick={() => handleEditUser(user)}>
                      {user.address ? user.address : "chưa bổ sung"}
                    </Table.Cell>
                    <Table.Cell style={{ cursor: "pointer" }} onClick={() => handleEditUser(user)} >
                      {user.isAdmin ? (
                        <Icon name="adn" color="grey">(admin)</Icon>
                      ) : (
                        <Icon name="user" color="grey">(user)</Icon>
                      )}
                    </Table.Cell>

                    <Table.Cell style={{ textAlign: "center" }}>

                      <Icon
                        className="IconDelete"
                        size="big"
                        name="delete"
                        onClick={() => handleDeleteUser(user)}
                        color="grey"
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
                <Header content={language === LANGUAGES.VI
                  ? languageDataVi.content.userManagement.confirmUserDeletion
                  : languageDataEn.content.userManagement.confirmUserDeletion} />
                <Modal.Content>
                  <p>{language === LANGUAGES.VI
                    ? languageDataVi.content.userManagement.areYouSure
                    : languageDataEn.content.userManagement.areYouSure}</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button negative onClick={handleCloseDeleteModal}>
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.cancel
                      : languageDataEn.content.userManagement.cancel}
                  </Button>
                  <Button positive onClick={handleConfirmDelete}>
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.confirm
                      : languageDataEn.content.userManagement.confirm}
                  </Button>
                </Modal.Actions>
              </Modal>
              <Modal
                open={modalOpenEdit}
                onClose={handleCloseModalEdit}
                size="small"
              >
                <Header content={language === LANGUAGES.VI
                  ? languageDataVi.content.userManagement.editUser
                  : languageDataEn.content.userManagement.editUser} />
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
                            <label>{language === LANGUAGES.VI
                              ? languageDataVi.content.userManagement.phone
                              : languageDataEn.content.userManagement.phone}</label>
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
                            <label>{language === LANGUAGES.VI
                              ? languageDataVi.content.userManagement.name
                              : languageDataEn.content.userManagement.name}</label>
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
                            <label>{language === LANGUAGES.VI
                              ? languageDataVi.content.userManagement.address
                              : languageDataEn.content.userManagement.address}</label>
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
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.cancel
                      : languageDataEn.content.userManagement.cancel}
                  </Button>
                  <Button positive onClick={handleSaveEditUser}>
                    {language === LANGUAGES.VI
                      ? languageDataVi.content.userManagement.save
                      : languageDataEn.content.userManagement.save}
                  </Button>
                </Modal.Actions>
              </Modal>

              <Table.Footer className="TableFooter">
                <Table.Row>
                  <Table.HeaderCell colSpan="8">
                    <Menu className="MenuHeader" floated="left">
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
          </Dimmer.Dimmable>
        </div>
      </Container>
    </>
  );
};

export default UserManagement;
