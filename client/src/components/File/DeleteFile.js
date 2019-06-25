import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Button } from 'react-bootstrap';
import { GET_DLFILES_QUERY } from '../pages/Root';
// import { PROFILE_QYERY } from '../pages/Root';

const DeleteFile = ({ dlfile }) => {
  const currentUser = useContext(UserContext);
  const isCurrentUser = currentUser.id === dlfile.postedBy.id;
  return (
    isCurrentUser && (
      <Mutation
        mutation={DELETE_TRACK_MUTATION}
        variables={{ dlfileId: dlfile.id }}
        onCompleted={data => {
          console.log(data);
        }}
        refetchQueries={() => [{ query: GET_DLFILES_QUERY }]}
      >
        {deleteDlfile => (
          <>
            <Button onClick={deleteDlfile}>Delete</Button>
          </>
        )}
      </Mutation>
    )
  );
};

const DELETE_TRACK_MUTATION = gql`
  mutation($dlfileId: Int!) {
    deleteDlfile(dlfileId: $dlfileId) {
      dlfileId
    }
  }
`;

export default DeleteFile;
