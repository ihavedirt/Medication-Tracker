'use client';
import {
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
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
        EVERY_6: 4,
        EVERY_8: 5,
        EVERY_12: 7,
        WEEKLY: 8,
        MONTHLY: 9,
        AS_NEEDED: 10,
    }), []);

    const [formData, setFormData] = useState({
        name: '',
        doseage: 0,
        unit: DosageUnit.MG,
        type: MedType.PILL,
        frequency: Frequency.ONCE_DAILY,
        time: dayjs()
    });

    const errorDefault = {
        name: false,
        doseage: false,
        unit: false,
        type: false,
        frequency: false,
        time: false
    };

    const [errorData, setErrorData] = useState(errorDefault);
    const [mysession, setMySession] = useState();

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
    
        const { error } = await supabase.from("medications").insert({
            uuid: mysession.data.user.id,
            name: formData.name,
            dose: formData.doseage,
            unit: formData.unit,
            type: formData.type,
            frequency: formData.frequency,
            medication_time: formData.time.toISOString(),
        });
        console.log(error);
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

    return (
        <Stack spacing={2}>
            <Typography variant="h4">Medication Entry</Typography>
            <Divider />
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
                <Grid xs={12}>
                    <TextField
                            error={errorData.doseage}
                            label="Doseage"
                            variant="filled"
                            value={formData.doseage}
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
            </Grid>
            <Grid container spacing={1}>
                <Grid xs={12}>
                    {renderSelectField('Frequency', formData.frequency, handleChange('frequency'), [
                        { label: 'Once Daily', value: Frequency.ONCE_DAILY },
                        { label: 'Twice Daily', value: Frequency.TWICE_DAILY },
                        { label: 'Three Times Daily', value: Frequency.THREE_DAILY },
                        { label: 'Four Times Daily', value: Frequency.FOUR_DAILY },
                        { label: 'Every 6 Hours', value: Frequency.EVERY_6 },
                        { label: 'Every 8 Hours', value: Frequency.EVERY_8 },
                        { label: 'Every 12 Hours', value: Frequency.EVERY_12 },
                        { label: 'Weekly', value: Frequency.WEEKLY },
                        { label: 'Monthly', value: Frequency.MONTHLY },
                        { label: 'As Needed', value: Frequency.AS_NEEDED },
                    ])}
                </Grid>
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
            <Button variant="contained" onClick={handleSubmit}>
                Submit
            </Button>
        </Stack>
    );
}