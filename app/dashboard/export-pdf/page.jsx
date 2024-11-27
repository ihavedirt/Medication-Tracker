'use client';

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import DownloadPDFButton from "../../ui/download-pdf-button";
import { createClient } from '../../../utils/supabase/client';

export default function ExportMedicationHistory() {
    const [medications, setMedications] = useState([]);

    // Example data (replace this with API call to fetch user's data)
    useEffect(() => {
        const fetchSession = async () => {
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

                
            }
        }
        // Simulating fetching data from an API
        const fetchedMedications = [
            { id: 1, name: 'Aspirin', dosage: '100mg', date: '2024-11-01' },
            { id: 2, name: 'Paracetamol', dosage: '500mg', date: '2024-11-05' },
            { id: 3, name: 'Ibuprofen', dosage: '200mg', date: '2024-11-10' },
        ];
        setMedications(fetchedMedications);
    }, []);

    

    return (
        <Paper sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Export Medication History
            </Typography>
            <Typography variant="body1" paragraph>
                Here is the list of your medications. You can export this history to a PDF document.
            </Typography>

            <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Dosage</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {medications.map((med) => (
                            <TableRow key={med.id}>
                                <TableCell>{med.id}</TableCell>
                                <TableCell>{med.name}</TableCell>
                                <TableCell>{med.dosage}</TableCell>
                                <TableCell>{med.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div>
                <DownloadPDFButton/>
            </div>
        </Paper>
    );
}
