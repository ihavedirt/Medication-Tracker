'use client';

import * as React from "react";
import Button from '@mui/material/Button';

export default function DownloadPDFButton() {
    const handleDownload = async () => {
        const response = await fetch('/api/generate-pdf');
        const blob = await response.blob();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Medication_Report.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <Button variant="contained" color="primary" onClick={handleDownload}>
            Export Medication History
        </Button>
    );
}