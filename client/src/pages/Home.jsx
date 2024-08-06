import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Auth App
      </Typography>
      <Button variant="contained" color="primary" style={{ margin: '10px' }}>
        <Link to="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>
          Signup
        </Link>
      </Button>
      <Button variant="contained" color="secondary" style={{ margin: '10px' }}>
        <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
          Login
        </Link>
      </Button>
    </Container>
  );
};

export default Home;
