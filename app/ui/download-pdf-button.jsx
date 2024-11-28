import { jsPDF } from "jspdf";
import Button from '@mui/material/Button'
import { user } from "@nextui-org/theme";
export default function DownloadPDFButton({userData, medicineData}) {
    const handleDownload = () => {
        const doc = new jsPDF();

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
        // Add content to the PDF
        doc.setFontSize(18);
        doc.text('Medication Report', 105, 20, { align: 'center' });

        let y = 30;
        doc.setFontSize(12);

        userData.map((user) => {
            medicineData.filter((medicine) => medicine.subprofile_id == user.id).forEach((med) => {
                doc.text(`First Name: ${user.first_name} | Last Name: ${user.last_name} | Dosage: ${med.dosage}`, 10, y);
                y += 10;
            });
        });
        /*medications.forEach((med) => {
            doc.text(`First Name: ${med.first_name} | Last Name: ${med.name} | Dosage: ${med.dosage}`, 10, y);
            y += 10;
        });*/

        // Download the PDF
        doc.save('Medication_Report.pdf');
    };

    return (
        <Button variant="contained" color="primary" onClick={handleDownload}>
            Export Medication History
        </Button>
    );
}
