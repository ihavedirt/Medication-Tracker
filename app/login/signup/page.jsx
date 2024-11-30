"use client";
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { signup } from '../actions';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhoneNumber = (phoneNumber) => {
        const re = /^\d{10}$/; // Simple validation for 10-digit phone numbers
        return re.test(String(phoneNumber));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length <= 6) {
            newErrors.password = 'Password must be more than 6 characters';
        }
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!validatePhoneNumber(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Invalid phone number';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        signup([{ id: 'credentials', name: 'Email and Password' }], formData);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="First Name"
                        variant="outlined"
                        required
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Last Name"
                        variant="outlined"
                        required
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        variant="outlined"
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        variant="outlined"
                        required
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Phone Number"
                        variant="outlined"
                        required
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        type="submit"
                    >
                        Sign Up
                    </Button>
                    <Link href="/login" passHref>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            sx={{ mt: 2 }}
                        >
                            Back to Login
                        </Button>
                    </Link>
                </form>
            </Box>
        </Container>
    );
}