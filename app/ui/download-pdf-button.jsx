import { jsPDF } from "jspdf";
import Button from '@mui/material/Button'
export default function DownloadPDFButton() {
    const handleDownload = () => {
        const doc = new jsPDF();

        // Add content to the PDF
        doc.setFontSize(18);
        doc.text('Medication Report', 105, 20, { align: 'center' });

        const medications = [
            { id: 1, name: 'Aspirin', dosage: '100mg' },
            { id: 2, name: 'Paracetamol', dosage: '500mg' },
        ];

        let y = 30;
        doc.setFontSize(12);
        medications.forEach((med) => {
            doc.text(`ID: ${med.id} | Name: ${med.name} | Dosage: ${med.dosage}`, 10, y);
            y += 10;
        });

        // Download the PDF
        doc.save('Medication_Report.pdf');
    };

    return (
        <Button variant="contained" color="primary" onClick={handleDownload}>
            Export Medication History
        </Button>
    );
}
