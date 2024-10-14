'use client'
import {
    Container,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {useState} from "react";
import Button from "@mui/material/Button";

export const DosageUnit = {
    ML: 0,
    L: 1,
    MG: 2,
    G: 3,
    KG: 4
};

export const MedType = {
    PILL: 0,
    SYRUP: 1,
    INJECTION: 2,
};

export default function Page() {
    const [unit, setUnit] = useState('');
    const [type, setType] = useState('');
    const [name, setName] = useState('');


    const handleUnitChange = (event) => {
        setUnit(event.target.value);
    }
    const handleTypeChange = (event) => {
        setType(event.target.value);
    }
    const handleNameChange = (event) => {
        setName(event.target.value);
    }
    const handleSubmit = () => {
        console.log({unit, type, name});
    }


    return (
        <Stack spacing={2}>
            <Typography variant="h4">Medication Entry</Typography>
            <Divider/>
            <Grid container spacing={1}>
                <Grid xs={12}>
                    <TextField id="filled-basic" label="Medication Name" variant="filled" onChange={handleNameChange}/>
                </Grid>
                <Grid xs={12}>
                    <FormControl variant="filled" fullWidth>
                        <InputLabel id="unit-select-label">Unit</InputLabel>
                        <Select defaultValue={DosageUnit.MG} labelId="unit-select-label" onChange={handleUnitChange} variant='filled'>
                            <MenuItem value={DosageUnit.ML}>mL</MenuItem>
                            <MenuItem value={DosageUnit.L}>L</MenuItem>
                            <MenuItem value={DosageUnit.MG}>mg</MenuItem>
                            <MenuItem value={DosageUnit.G}>g</MenuItem>
                            <MenuItem value={DosageUnit.KG}>kg</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12}>
                    <FormControl variant="filled" fullWidth>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select defaultValue={MedType.PILL} labelId="type-select-label" onChange={handleTypeChange} variant='filled' >
                            <MenuItem value={MedType.PILL}>Pill</MenuItem>
                            <MenuItem value={MedType.INJECTION}>Injection</MenuItem>
                            <MenuItem value={MedType.SYRUP}>Syrup</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container spacing={1}>

            </Grid>
            <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </Stack>
    );
}