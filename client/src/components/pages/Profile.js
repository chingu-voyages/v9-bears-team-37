import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import ShowError from '../Common/ShowError';
import Loading from '../Common/Loading';
import { ListGroup, Tab, Row, Col, Button } from 'react-bootstrap';
import UpdateFile from '../File/UpdateFile';
import DeleteFile from '../File/DeleteFile';

const Profile = ({ match }) => {
  const id = match.params.id;
  console.log(typeof id);
  return (
    <Query query={PROFILE_QYERY} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <Loading />;
        if (error) return <ShowError />;
        //console.log({ data });

        return (
          <Tab.Container id='list-group-tabs-example' defaultActiveKey='#link1'>
            {data.user.dlfileSet.map((pdlfile, i) => (
              <Row key={pdlfile.id}>
                <Col sm={4}>
                  <ListGroup>
                    <ListGroup.Item action href={`#${pdlfile.id}`}>
                      <span>{i + 1}</span> {pdlfile.name}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col>
                  <Tab.Content>
                    <Tab.Pane eventKey={`#${pdlfile.id}`}>
                      <Row>
                        {pdlfile.description}
                        {/* <Col>
                          <UpdateFile />
                          <DeleteFile />
                        </Col> */}
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            ))}
          </Tab.Container>
        );
      }}
    </Query>
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

export default Profile;
