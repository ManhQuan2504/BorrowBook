import React, { useState, useEffect } from 'react';
import { Icon, Table, Header, Container, Menu, Checkbox, } from 'semantic-ui-react';
import './style.scss';
import * as BorrowBook from '../../services/BorrowBookService';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await BorrowBook.getBorrowBooks(page);
        setDatas(result.data.data);
        setCountPage(result.data.countPage)
      } catch (error) {
        console.error(`ERR: http://localhost:1234/api/borrowbook/get?page=${page}\n`, error);
      }
    };
    console.log(page);

    fetchData();
  }, [page]);

  

  return (
    <Container className='ContainerBookManagement'>
      <Header as='h1' textAlign='center'>
        Borrow Book Management
      </Header>

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
