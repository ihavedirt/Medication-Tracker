'use client';

import {
    Divider,
    Stack,
    Typography,
    Skeleton
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DownloadPDFButton from "../../ui/download-pdf-button";

export default function ExportMedicationHistory() {
    const supabase = createClient();
    const [open, setOpen] = React.useState(false);
    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(Number(event.target.value) || '');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
        setOpen(false);
        }
    };

    const DosageUnit = useMemo(() => ({
        mL: 0,
        L: 1,
        mg: 2,
        g: 3,
        kg: 4,
    }), []);
    
    const MedType = useMemo(() => ({
        Pill: 0,
        Syrup: 1,
        Injection: 2,
    }), []);
    
    const Frequency = useMemo(() => ({
        "Once Daily": 0,
        "Twice Daily": 1,
        "Three Daily": 2,
        "Four Daily": 3,
        "Every 6 Hours": 4,
        "Every 8 Hours": 5,
        "Every 12 Hours": 7,
        "Weekly": 8,
        "Monthly": 9,
        "As Needed": 10,
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
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);

    // Example data (replace this with API call to fetch user's data)
    useEffect(() => {
        const fetchSessionAndSubprofiles = async () => {
            const { data: session } = await supabase.auth.getUser();
            setMySession(session);

            if (session) {
                const { data: userData, error: userError} = await supabase
                    .from('subprofiles')
                    .select()
                    .eq('uuid', session.user.id);
                
                if (userError) {
                    console.error("Error fetching subprofiles:", userError);
                } else {
                    setUserData(userData);
                }

                const { data: medicineData, error: medicineError} = await supabase
                    .from('medications')
                    .select()
                    .eq('uuid', session.user.id);

                if (medicineError) {
                    console.error("Error fetching medications:", medicineError);
                } else {
                    setMedicineData(medicineData);
                }
                setLoading(false);
            }
        };

        fetchSessionAndSubprofiles();
    }, []);

    const renderMedicineTables = () => {
        const tables = [];

        userData.forEach((user) =>  {
            tables.push(
                <TableContainer component={Paper} key={user.id}>
                    <Typography variant="h6" paddingLeft={3} paddingTop={1}>{user.first_name} {user.last_name}</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Dose</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Frequency</TableCell>
                                <TableCell>Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {medicineData
                            .filter(medicineEntry => medicineEntry.subprofile_id === user.id)
                            .map(medicineEntry => (
                                <TableRow key={medicineEntry.id}>
                                    <TableCell>{medicineEntry.name}</TableCell>
                                    <TableCell>{medicineEntry.dose}</TableCell>
                                    <TableCell>{Object.keys(DosageUnit).find((key) => DosageUnit[key] === medicineEntry.unit)}</TableCell>
                                    <TableCell>{Object.keys(MedType).find((key) => MedType[key] === medicineEntry.type)}</TableCell>
                                    <TableCell>{Object.keys(Frequency).find((key) => Frequency[key] === medicineEntry.frequency)}</TableCell>
                                    <TableCell>{medicineEntry.medication_time}</TableCell>
                                </TableRow>
                            ))
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        })
        return tables;
    }

    return (
        <div>
            <Button onClick={handleClickOpen}>Select Users to Export</Button>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Fill the form</DialogTitle>
                <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="demo-dialog-native">Age</InputLabel>
            <Select
                native
                value={age}
                onChange={handleChange}
                input={<OutlinedInput label="Age" id="demo-dialog-native" />}
            >
                <option aria-label="None" value="" />
                <option value={10}>Ten</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
            </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-dialog-select-label">Age</InputLabel>
            <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={age}
                onChange={handleChange}
                input={<OutlinedInput label="Age" />}
            >
                <MenuItem value="">
                <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            </FormControl>
        </Box>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
    </Dialog>
            {loading ? (
            <Stack spacing={2}>
                <Typography variant="h4">Sub-Profiles</Typography>
                <Skeleton animation="wave" variant="rounded" height={120}/>
                <Skeleton animation="wave" variant="rounded" height={120}/>
                <Skeleton animation="wave" variant="rounded" height={120}/>
            </Stack>
        ) :(
        <Stack spacing={2}>
            <Typography variant="h4">Sub-Profiles</Typography>
            <Divider />
            {(() => {
                const tables = renderMedicineTables();
                if (tables.length > 0) {
                    return tables;
                }
                else {
                    return <Typography>Could not find sub profiles</Typography>
                }
            })()}
            <Divider />
        </Stack>
        )}</div>
    )
}
