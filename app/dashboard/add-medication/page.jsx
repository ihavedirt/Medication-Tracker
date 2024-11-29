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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


export default function Page() {
    const supabase = createClient();

    const DosageUnit = useMemo(() => ({
        ML: 0,
        L: 1,
        MG: 2,
        G: 3,
        KG: 4,
    }), []);
    
    const MedType = useMemo(() => ({
        PILL: 0,
        SYRUP: 1,
        INJECTION: 2,
    }), []);
    
    const Frequency = useMemo(() => ({
        ONCE_DAILY: 0,
        TWICE_DAILY: 1,
        THREE_DAILY: 2,
        FOUR_DAILY: 3,
        FIVE_MINUTES: 4,
        WEEKLY: 8,
        MONTHLY: 9,
        AS_NEEDED: 10,
    }), []);

    const formDefault = {
        name: '',
        doseage: null,
        unit: DosageUnit.MG,
        type: MedType.PILL,
        frequency: Frequency.ONCE_DAILY,
        time: dayjs(),
        subprofileId: '',
        subprofileFirstName: '',
        subprofileLastName: '',
        quantity: null
    };

    const errorDefault = {
        name: false,
        doseage: false,
        unit: false,
        type: false,
        frequency: false,
        time: false,
        subprofileId: false,
        subprofileFirstName: false,
        subprofileLastName: false,
        quantity: false
    };

    const [formData, setFormData] = useState(formDefault);
    const [errorData, setErrorData] = useState(errorDefault);
    const [mysession, setMySession] = useState();
    const [snackbarSev, setSnackbarSev] = useState({
        message: "Successfully submitted medication info!",
        severity: "success"
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subprofiles, setSubprofiles] = useState([]); // for subprofiles
    const [enterSubprofile, setEnteringSubprofile] = useState(false);

    const handleChange = (field) => (event) => {
        const value = event.target ? event.target.value : event;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    
    // Fetching primary and sub user profile data
    useEffect(() => {
        const fetchSessionAndSubprofiles = async () => {
            const { data: session } = await supabase.auth.getUser();
            setMySession(session);
            
            if (session) {
                const { data: subprofileData, error } = await supabase
                    .from('subprofiles') 
                    .select('id, first_name, last_name')
                    .eq('uuid', session.user.id);

                if (error) {
                    console.error("Error fetching subprofiles:", error);
                } else {
                    setSubprofiles(subprofileData);
                }
            }
        };

        fetchSessionAndSubprofiles();
    }, []);

    const handleSubmit = async () => {
        const newErrorData = {
            name: formData.name === '',
            doseage: !Number.isFinite(Number(formData.doseage)) || formData.doseage <= 0,
            quantity: formData.quantity  === null 
        };
    
        if (newErrorData.name || newErrorData.doseage || newErrorData.quantity) {
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
            uuid: mysession.user.id,
            subprofile_id: enterSubprofile ? formData.subprofileId : 0,
            name: formData.name,
            dose: formData.doseage,
            unit: formData.unit,
            type: formData.type,
            frequency: formData.frequency,
            medication_time: formData.time.toISOString(),
            quantity: formData.quantity
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
            <Typography variant="h4">Medication Entry</Typography>
            <Divider />
            <FormControlLabel 
                required control={
                    <Switch 
                        checked={enterSubprofile}
                        onChange={(event) => setEnteringSubprofile(event.target.checked)}
                    />
                } label="Are you Entering a subprofiles medication?" 
            />    
                <Grid container spacing = {1}>
                    {enterSubprofile && renderSelectField('Subprofiles', formData.subprofileId, handleChange('subprofileId'), 
                        subprofiles.map((subprofiles) => ({
                            label: `Subprofile: ${subprofiles.first_name|| ''} ${subprofiles.last_name || ''}`, 
                            value: subprofiles.id
                        })) 
                    )}
                </Grid>
            <Grid container spacing={1}>
                <Grid xs={12}>
                    <TextField
                        error={errorData.name}
                        label="Medication Name"
                        variant="filled"
                        value={formData.name}
                        onChange={handleChange('name')}
                        fullWidth
                        helperText="A medication name is required"
                    />
                </Grid>
                <Grid xs={12}>
                    {renderSelectField('Type', formData.type, handleChange('type'), [
                        { label: 'Pill', value: MedType.PILL },
                        { label: 'Injection', value: MedType.INJECTION },
                        { label: 'Syrup', value: MedType.SYRUP },
                    ])}
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid xs={6}>
                    <TextField
                            error={errorData.quantity}
                            label="Quantity"
                            variant="filled"
                            value={formData.quantity || ''}
                            onChange={handleChange('quantity')}
                            fullWidth
                            helperText="A quantity is required"
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid xs={12}>
                    <TextField
                            error={errorData.doseage}
                            label="Doseage"
                            variant="filled"
                            value={formData.doseage || ''}
                            onChange={handleChange('doseage')}
                            fullWidth
                            helperText="A dosage is required"
                    />
                </Grid>
                <Grid xs={12}>
                    {renderSelectField('Unit', formData.unit, handleChange('unit'), [
                        { label: 'mL', value: DosageUnit.ML },
                        { label: 'L', value: DosageUnit.L },
                        { label: 'mg', value: DosageUnit.MG },
                        { label: 'g', value: DosageUnit.G },
                        { label: 'kg', value: DosageUnit.KG },
                    ])}
                </Grid>
                <Grid xs={12}>
                    {renderSelectField('Frequency', formData.frequency, handleChange('frequency'), [
                        { label: 'Once Daily', value: Frequency.ONCE_DAILY },
                        { label: 'Twice Daily', value: Frequency.TWICE_DAILY },
                        { label: 'Three Times Daily', value: Frequency.THREE_DAILY },
                        { label: 'Four Times Daily', value: Frequency.FOUR_DAILY },
                        { label: 'Every 5 Minutes', value: Frequency.FIVE_MINUTES },
                        { label: 'Weekly', value: Frequency.WEEKLY },
                        { label: 'Monthly', value: Frequency.MONTHLY },
                        { label: 'As Needed', value: Frequency.AS_NEEDED },
                    ])}
                </Grid>
            </Grid>
            <Grid container spacing={1}>
            {formData.frequency != Frequency.AS_NEEDED ? 
                    <Grid xs={12}>
                        <TimePicker
                            label="Medication time"
                            value={formData.time}
                            onChange={handleChange('time')}
                        />
                    </Grid> 
                : null}
            </Grid>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                Submit
            </Button>
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