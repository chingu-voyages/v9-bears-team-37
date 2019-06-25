import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ListGroup, Tab, Row, Col, Button } from 'react-bootstrap';
import UpdateFile from './UpdateFile';
import DeleteFile from './DeleteFile';
import ShowError from '../Common/ShowError';
import Loading from '../Common/Loading';

const FileList = ({ dlfiles }) => {
  // const id = match.params.id;
  //console.log(id);
  console.log(window);

  // return (
  //   <Query query={PROFILE_QYERY} variables={{ id }}>
  //     {({ data, loading, error }) => {
  //       if (loading) return <Loading />;
  //       if (error) return <ShowError />;
  //       console.log({ data });
  return (
    <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
      {console.log(dlfiles)}
      {dlfiles.map((dlfile, i) => (
        <Row key={dlfile.id}>
          <Col sm={4}>
            <ListGroup>
              <ListGroup.Item action href={`#${dlfile.id}`}>
                <span>{i + 1}</span> {dlfile.name}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey={`#${dlfile.id}`}>
                <Row>
                  {dlfile.description}
                  <Col>
                    <UpdateFile dlfile={dlfile} />
                    <DeleteFile dlfile={dlfile} />
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      ))}
    </Tab.Container>
    //     );
    //   }}
    // </Query>
  );
};

const PROFILE_QYERY = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      username
      dateJoined
      dlfileSet {
        id
        name
        description
        url
      }
    }
  }
`;

export default FileList;
