'use client';
import {
    Alert,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography,
    Button
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useState, useMemo, useEffect } from "react";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from "dayjs";
import { createClient } from '../../../utils/supabase/client';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';

export default function Page() {
    const supabase = createClient();
    
    const formDefault = {
        firstName: '',
        lastName: '',
        birthDate: dayjs()
    };

    const errorDefault = {
        name: false,
        doseage: false,
        unit: false,
        type: false,
        frequency: false,
        time: false
    };

    const [formData, setFormData] = useState(formDefault);
    const [errorData, setErrorData] = useState(errorDefault);
    const [mysession, setMySession] = useState();
    const [snackbarSev, setSnackbarSev] = useState({
        message: "Successfully created user profile!",
        severity: "success"
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (event) => {
        const value = event.target ? event.target.value : event;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    useEffect (() => {
        supabase.auth.getUser().then((session) => {
          setMySession(session);
        });
      }, [])

    const handleSubmit = async () => {
        const newErrorData = {
            name: formData.name === '',
            doseage: !Number.isFinite(Number(formData.doseage)) || formData.doseage <= 0,
        };
    
        if (newErrorData.name || newErrorData.doseage) {
            setErrorData({
                ...errorData,
                ...newErrorData,
            });
            return;
        }
    
        setErrorData(errorDefault);

        formData.time = formData.time.set('seconds', 0).set('milliseconds', 0);
    
        setLoading(true);
        const { error } = await supabase.from("medications").insert({
            uuid: mysession.data.user.id,
            name: formData.name,
            dose: formData.doseage,
            unit: formData.unit,
            type: formData.type,
            frequency: formData.frequency,
            medication_time: formData.time.toISOString(),
        });
        setLoading(false);
        
        if(error) {
            setSnackbarSev({
                message: "An error occurred",
                severity: "error",
            });
        }
        else {
            setSnackbarSev({
                message: "Successfully submitted medication info!",
                severity: "success"
            });
        }
        setSnackbarOpen(true);
        setFormData(formDefault);
    };

    const renderSelectField = (label, value, onChange, items) => (
        <FormControl variant="filled" fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select value={value} onChange={onChange} variant="filled">
                {items.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    const handleClose = () => {
        setSnackbarOpen(false);
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h4">Create Subprofile</Typography>
            <Divider />
            <Grid container spacing={2}>
                <Grid xs={12}>
                    <TextField
                        error={errorData.firstName}
                        label="First Name"
                        variant="filled"
                        value={formData.firstName}
                        onChange={handleChange('firstName')}
                        fullWidth
                        helperText="Please enter first name"
                    />
                </Grid>
                <Grid xs={12}>
                <TextField
                        error={errorData.lastName}
                        label="Last Name"
                        variant="filled"
                        value={formData.lastName}
                        onChange={handleChange('lastName')}
                        fullWidth
                        helperText="Please enter last name"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid xs={12}>
                <DatePicker
                    label = "Birth date"
                    defaultValue = {dayjs()}
                    slots = {{ openPickerIcon: InsertInvitationIcon}}
                />
                </Grid>
            </Grid>
            
            <Grid container spacing={1}>
                <Grid xs={12}>
                    <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                        Create Profile
                    </Button>
                </Grid>
            </Grid>
            
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                message="Note archived"
                onClose={handleClose}
            >
                <Alert
                    severity={snackbarSev.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarSev.message}
                </Alert>
            </Snackbar>
            
        </Stack>
    );
}