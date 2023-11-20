import React, { useState, useEffect } from 'react';
import { Icon, Table, Header, Container, Menu, Checkbox, Label, Button } from 'semantic-ui-react';
import './style.scss';
import * as BookServices from '../../services/BookService';

const BookManagement = () => {
  const [countPage, setCountPage] = useState(0);
  const [page, setPage] = useState(1)
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await BookServices.getBooks(page);
        setDatas(result.data.data);
        setCountPage(result.data.countPage)
      } catch (error) {
        console.error('ERR: , error');
      }
    };
    console.log(page);

    fetchData();
  }, [page]);


  return (
    <Container className='ContainerBookManagement'>
      <Header as='h1' textAlign='center'>
        Book Management
      </Header>

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