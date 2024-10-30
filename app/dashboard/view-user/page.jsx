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

    const formDefault = {
        name: '',
        doseage: 0,
        unit: DosageUnit.MG,
        type: MedType.PILL,
        frequency: Frequency.ONCE_DAILY,
        time: dayjs()
    };

    const errorDefault = {
        name: false,
        doseage: false,
        unit: false,
        type: false,
        frequency: false,
        time: false
    };

    const [mysession, setMySession] = useState();
    const [loading, setLoading] = useState(false);

    useEffect (() => {
        supabase.auth.getUser().then((session) => {
          setMySession(session);
        });
      }, [])

    const handleSubmit = async() => {

    setLoading(true);
    const { data: userData, error: userError} = await supabase
        .from('subprofiles')
        .select()
        .eq('uuid', mysession.data.user.id);
    

    console.log('User Data:', userData);

    const { data: medicineData, error: medicineError} = await supabase
        .from('medications')
        .select()
        .eq('uuid', mysession.data.user.id);
    
    console.log('Medicine Data:', medicineData);
    setLoading(false);

    }
    return (
        <Stack spacing={2}>
            <Typography>View User Page</Typography>
            <Divider />
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                Submit
            </Button>
        </Stack>
    )
}