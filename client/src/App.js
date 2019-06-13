import React from 'react';
import NavBar from './components/NavBar';
import DashBoard from './components/DashBoard';
import SideBar from './components/SideBar';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  return (
    <Container className="App">
      <Row>
        <Col sm={12}>
          <NavBar />
        </Col>
      </Row>
      <Row>
        <Col sm={8}>
          <DashBoard />
        </Col>
        <Col sm={4}>
          <SideBar />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
