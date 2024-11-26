import React from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

export default function SignupPage() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="First Name"
                        variant="outlined"
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        variant="outlined"
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        variant="outlined"
                        type="email"
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone Number"
                        variant="outlined"
                        type="tel"
                        required
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                    >
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Container>
    );
};