import React, { useEffect } from 'react';
import { Container, Breadcrumb } from 'semantic-ui-react';
import TableBooks from './Table/TableBooks';
import TableUser from './Table/TableUser';
import TableBorrow from './Table/TableBorrow';

function Home({ activeItem }) {
  useEffect(() => {
  }, [activeItem]);
  console.log(activeItem);

  const renderActiveItem = () => {
    switch (activeItem) {
      case 'Management Books':
        return <TableBooks />;
      case 'Management User':
        return <TableUser />;
      case 'Management BorrowBook':
        return <TableBorrow />;
      default:
        return null;
    }
  };

  return (
    <>
      <Container>
        <Breadcrumb>
          <Breadcrumb.Section link>Home</Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>{activeItem}</Breadcrumb.Section>
        </Breadcrumb>

        {renderActiveItem()}
      </Container>
    </>
  );
}

export default Home;
