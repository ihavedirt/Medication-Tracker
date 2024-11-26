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
import dayjs from "dayjs";
import { createClient } from '../../../utils/supabase/client';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import DownloadPDFButton from "../../ui/download-pdf-button";

export default function Page() {
    const supabase = createClient();

    const formDefault = {
        first_name: '',
        last_name: '',
        birth_date: dayjs()
    };

    const errorDefault = {
        first_name: false,
        last_name: false,
        birth_date: false
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

    // Handle date change
    const handleDateChange = (newDate) => {
        setFormData((prev) => ({ ...prev, birth_date: newDate}));
    };

    useEffect (() => {
        supabase.auth.getUser().then((session) => {
          setMySession(session);
        });
      }, [])

    const handleSubmit = async () => {
        
        const newErrorData = {
            first_name: formData.first_name === '',
            last_name: formData.last_name === '',
            birth_date: !dayjs(formData.birth_date).isValid() || dayjs(formData.birth_date).isAfter(dayjs(), 'day')
        };
        
        if (newErrorData.first_name || newErrorData.last_name || newErrorData.birth_date) {
            setErrorData({
                first_name: newErrorData.first_name,
                last_name: newErrorData.last_name,
                birth_date: newErrorData.birth_date ? "Please enter a valid birth date." : false,
            });
            return;
        }

        const formattedBirthDate = dayjs(formData.birth_date).format('YYYY-MM-DD');
        setErrorData(errorDefault);
        setLoading(true);

        const { error } = await supabase.from("subprofiles").insert({
            first_name: formData.first_name,
            last_name: formData.last_name,
            birth_date: formattedBirthDate, // Use formatted date
            uuid: mysession.data.user.id,
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
                message: "Successfully created subprofile!",
                severity: "success"
            });
        }
        setSnackbarOpen(true);
        setFormData(formDefault);
    };

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
                        error={errorData.first_name}
                        label="First Name"
                        variant="filled"
                        value={formData.first_name}
                        onChange={handleChange('first_name')}
                        fullWidth
                        helperText={errorData.first_name ? "Please enter first name" : ""}
                    />
                </Grid>
                <Grid xs={12}>
                <TextField
                        error={errorData.last_name}
                        label="Last Name"
                        variant="filled"
                        value={formData.last_name}
                        onChange={handleChange('last_name')}
                        fullWidth
                        helperText={errorData.last_name ? "Please enter last name" : ""}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid xs={12}>
                <DatePicker
                    label = "Date of Birth"
                    value = {formData.birth_date} // Bind DatePicker value
                    onChange = {handleDateChange}
                    defaultValue = {dayjs()}
                    disableFuture
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
            <div>
                <DownloadPDFButton/>
            </div>
        </Stack>
    );
}