import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Button, Typography } from '@mui/material';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container style={{ marginTop: '50px', maxWidth: '400px' }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.email}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={{ marginTop: '20px' }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
