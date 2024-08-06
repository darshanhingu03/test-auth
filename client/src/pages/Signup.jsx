import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(email, password, twoFactorEnabled);
      if (data.twoFactorEnabled) {
        setQrCode(data.qrCode);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleQrCodeScanned = () => {
    navigate("/login");
  };

  return (
    <Container style={{ marginTop: "50px", maxWidth: "400px" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
            />
          }
          label="Enable Two-Factor Authentication"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "20px" }}
        >
          Signup
        </Button>
        {error && (
          <Typography color="error" style={{ marginTop: "20px" }}>
            {error}
          </Typography>
        )}
        {qrCode && (
          <>
            <img src={qrCode} alt="QR Code" style={{ marginTop: "20px" }} />
            <Button
              variant="contained"
              color="secondary"
              style={{ marginTop: "20px" }}
              onClick={handleQrCodeScanned}
            >
              I have scanned the QR code
            </Button>
          </>
        )}
      </form>
    </Container>
  );
};

export default Signup;
