import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, Button } from '@mui/material';

const Welcome = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container style={{ marginTop: '50px', textAlign: 'center' }}>
      <Typography variant="h4">Welcome, {user?.email}!</Typography>
      <Button variant="contained" color="secondary" onClick={logout} style={{ marginTop: '20px' }}>
        Logout
      </Button>
    </Container>
  );
};

export default Welcome;
