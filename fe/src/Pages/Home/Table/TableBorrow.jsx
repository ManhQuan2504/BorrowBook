import React, { useEffect } from 'react';
import { Container, Table } from 'semantic-ui-react';

function TableBooks({ activeItem }) {
  useEffect(() => {
    console.log("Active item changed:", activeItem);
  }, [activeItem]);

  return (
    <>
      <Container>

        <Table celled fixed singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>TableBorrow</Table.HeaderCell>
              <Table.HeaderCell>TableBorrow</Table.HeaderCell>
              <Table.HeaderCell>TableBorrow</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>John</Table.Cell>
              <Table.Cell>Approved</Table.Cell>
              <Table.Cell
                title={[
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
                  'et dolore magna aliqua.',
                ].join(' ')}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Jamie</Table.Cell>
              <Table.Cell>Approved</Table.Cell>
              <Table.Cell>Shorter description</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Jill</Table.Cell>
              <Table.Cell>Denied</Table.Cell>
              <Table.Cell>Shorter description</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Container>
    </>
  );
}

export default TableBooks;
