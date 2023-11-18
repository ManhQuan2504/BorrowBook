import React, { useState, useEffect } from 'react';
import { Icon, Label, Table, Header, Container, Menu, Checkbox, Dimmer, Loader } from 'semantic-ui-react';
import './style.scss';

const BorrowManagement = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous operation (e.g., fetching data) to demonstrate the loading state.
    // Replace this with your actual asynchronous operation.
    const fetchData = async () => {
      // Simulate delay (you can remove this in a real application)
      await new Promise(resolve => setTimeout(resolve, 0));

      // After fetching data or completing any asynchronous operation, set loading to false
      setLoading(false);
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

  return (
    <>
      <Container className='ContainerBorrowManagement'>
        {loading && (
          <Dimmer active inverted>
            <Loader>Loading...</Loader>
          </Dimmer>
        )}
        <Header as='h1' textAlign='center'>
          Borrow Management
        </Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell> <Checkbox /></Table.HeaderCell>
              <Table.HeaderCell>STT</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>

            </Table.Row>
          </Table.Header>

          <Table.Body>



            <Table.Row>

              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>

              <Table.Cell>Cell</Table.Cell>

            </Table.Row>
            <Table.Row>

              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>

              <Table.Cell>Cell</Table.Cell>

            </Table.Row>
            <Table.Row>

              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>

              <Table.Cell>Cell</Table.Cell>

            </Table.Row>
            <Table.Row>

              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>

              <Table.Cell>Cell</Table.Cell>

            </Table.Row>
            <Table.Row>

              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>

              <Table.Cell>Cell</Table.Cell>

            </Table.Row>
            <Table.Row>

              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>

              <Table.Cell>Cell</Table.Cell>

            </Table.Row>
            <Table.Row>

              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>

              <Table.Cell>Cell</Table.Cell>

            </Table.Row>
            <Table.Row>

              <Table.Cell>
                <Checkbox />
              </Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>
              <Table.Cell>Cell</Table.Cell>

              <Table.Cell>Cell</Table.Cell>

            </Table.Row>


          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='8'>
                <Menu floated='right' pagination>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron left' />
                  </Menu.Item>
                  <Menu.Item as='a'>1</Menu.Item>
                  <Menu.Item as='a'>2</Menu.Item>
                  <Menu.Item as='a'>3</Menu.Item>
                  <Menu.Item as='a'>4</Menu.Item>
                  <Menu.Item as='a' icon>
                    <Icon name='chevron right' />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Container>
    </>
  );
};

export default BorrowManagement;
