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
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


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
    const [medicineData, setMedicineData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([]);

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
    
    setUserData(userData || []);
    console.log('User Data:', userData);

    const { data: medicineData, error: medicineError} = await supabase
        .from('medications')
        .select()
        .eq('uuid', mysession.data.user.id);
    
    setMedicineData(medicineData || []);
    console.log('Medicine Data:', medicineData);
    setLoading(false);

    }

    const renderMedicineTables = () => {
        const tables = [];

        userData.forEach((user) =>  {
            const userUUID = user.uuid;
            const userSubProfileID = user.id;

            medicineData.forEach((medicineEntry) => {
                if (medicineEntry.uuid === userUUID && medicineEntry.subprofile_id === userSubProfileID) {
                    tables.push(
                        <TableContainer component={Paper} key={medicineEntry.subprofile_id}>
                            <Typography variant="h6">Poop: {medicineEntry.subprofile_id}</Typography>
                            <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Dose</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                <TableCell>{medicineEntry.name}</TableCell>
                                <TableCell>{medicineEntry.dose || 'N/A'}</TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    )
                }
            })
        })
        return tables;
    }
    

    return (
        <Stack spacing={2}>
            <Divider />
            {(() => {
                const tables = renderMedicineTables();
                if (tables.length > 0 ) {
                    return tables;
                }
                else {
                    return <Typography>Could not find user </Typography>
                }
            })()}
            <Divider />
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                Submit
            </Button>
        </Stack>
    )
}