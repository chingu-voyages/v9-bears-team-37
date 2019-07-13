import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient, { gql } from 'apollo-boost';
import Dashboard from './components/Common/Dashboard';
import Auth from './components/Authentications';
import { GRAPHQL_API_URL } from './config';
import { GET_DLFILES_QUERY } from './components/pages/Root';

import { Container, Row, Col } from 'react-bootstrap';

const client = new ApolloClient({
  uri: GRAPHQL_API_URL,
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    const token = localStorage.getItem('authToken') || '';
    operation.setContext({
      headers: {
        Authorization: `JWT ${token}`
      }
    });
  },
  clientState: {
    defaults: {
      isLoggedIn: !!localStorage.getItem('authToken')
    }
  }
});

const IS_LOGGED_IN_QUERY = gql`
  query {
    isLoggedIn @client
  }
`;

const GET_DLFILE_QUERY = gql`
  query getDownloadFile($email: String!, $fileToken: String!) {
    dlfile(email: $email, fileToken: $fileToken) {
      id
      name
      description
      url
    }
  }
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <Container fluid={true} className="App">
      <Row>
        <Col sm={6}>
          <Dashboard />
        </Col>
        <Col sm={6}>
          <Query query={IS_LOGGED_IN_QUERY}>
            {({ data }) => (data.isLoggedIn ? <App /> : <Auth />)}
          </Query>
        </Col>
      </Row>
    </Container>
  </ApolloProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
