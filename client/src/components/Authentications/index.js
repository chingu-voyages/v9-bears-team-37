import React, { useState } from 'react';

import Login from './Login';
import Register from './Register';

const Index = () => {
  const [newUser, setNewUser] = useState(true);
  return newUser ? (
    <Register setNewUser={setNewUser} />
  ) : (
    <Login setNewUser={setNewUser} />
  );
};

export default Index;
