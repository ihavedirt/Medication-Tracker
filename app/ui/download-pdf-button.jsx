import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import Button from '@mui/material/Button'
import { useEffect, useMemo } from "react";
import dayjs from "dayjs";

export default function DownloadPDFButton({parentData, userData, medicineData}) {
    
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

    const handleDownload = () => {
        const doc = new jsPDF();
        const colHeaders = ['Medication', 'Medication Type', 'Dosage', 'Quantity', 'Prescribed Date (YYYY-MM-DD)'];
        const headerStyles = {
            fillColor: [240, 240, 240],
            textColor: [0],
            fontFamily: 'Courier',
            fontStyle: 'bold',
        };

        /* Add image and text to the PDF */
        var img = new Image();
        img.src = '/neohand.png'
        doc.addImage(img, "png", 10, 5, 30, 12);
        doc.setFontSize(10);
        doc.setFont('Courier', 'bold');
        doc.text(`MEDICATION HISTORY REPORT for ${dayjs().format('YYYY-MM-DD')}`, 110, 12);

        let y = 30;
        /* Line width and units */
        doc.setLineWidth(0.1);

        /* Adjusting line color */
        doc.setDrawColor(200, 200, 200);
        doc.line(10, 18, 200, 18);
        doc.setFont('Courier', 'bold');
        parentData.forEach((parent) => {
            const parentMeds = medicineData.filter((medicine) => medicine.uuid == parentData[0].uuid);

            if (parentMeds.length > 0) {
                
                doc.text(`Medication History for: ${parentData[0].first_name} ${parentData[0].last_name}`, 10, y);
                y += 10;
                
                const itemDetailsRows = parentMeds.map((med) => {
                    const formattedBirthDate = dayjs(med.medication_time).format('YYYY-MM-DD');
                    const dosageUnit = Object.keys(DosageUnit).find((key) => DosageUnit[key] === med.unit);
                    const medType = Object.keys(MedType).find((key) => MedType[key] === med.type);
                    return [
                        med.name,
                        medType,
                        `${med.dose}${dosageUnit}`,
                        med.quantity,
                        formattedBirthDate.toString(),
                    ];
                });
        
                doc.autoTable({
                    head: [colHeaders],
                    body: itemDetailsRows,
                    startY: y,
                    headStyles: {
                        fillColor: headerStyles.fillColor,
                        textColor: headerStyles.textColor,
                        fontStyle: headerStyles.fontStyle,
                        fontSize: 10,
                        font: 'Courier',
                        halign: 'left',
                    },
                    columnStyles: {
                        0: { cellWidth: 'auto' },
                        1: { cellWidth: 'auto' },
                        2: { cellWidth: 'auto' },
                        3: { cellWidth: 'auto' },
                    },
                    alternateRowStyles: { fillColor: [255, 255, 255] },
                    bodyStyles: {
                        fontSize: 10,
                        font: 'Courier',
                        cellPadding: { top: 1, right: 5, bottom: 1, left: 2 },
                        textColor: [0, 0, 0],
                        rowPageBreak: 'avoid',
                    },
                    margin: { top: 10, left: 10, right: 10 },
                });
        
                y = doc.lastAutoTable.finalY + 10;

            }
        });
        /* Loop through each user, filter their medication, display in table */
        userData.forEach((user) => {
            const userMeds = medicineData.filter((medicine) => medicine.subprofile_id == user.id);
            if (userMeds.length > 0) {
                doc.text(`Medication History for: ${user.first_name} ${user.last_name}`, 10, y);
                y += 10;
                
                const itemDetailsRows = userMeds.map((med) => {
                    const formattedBirthDate = dayjs(med.medication_time).format('YYYY-MM-DD');
                    const dosageUnit = Object.keys(DosageUnit).find((key) => DosageUnit[key] === med.unit);
                    return [
                        med.name.toString(),
                        `${med.dose}${dosageUnit}`,
                        med.quantity,
                        formattedBirthDate.toString(),
                    ];
                });
        
                doc.autoTable({
                    head: [colHeaders],
                    body: itemDetailsRows,
                    startY: y,
                    headStyles: {
                        fillColor: headerStyles.fillColor,
                        textColor: headerStyles.textColor,
                        fontStyle: headerStyles.fontStyle,
                        fontSize: 10,
                        font: 'Courier',
                        halign: 'left',
                    },
                    columnStyles: {
                        0: { cellWidth: 'auto' },
                        1: { cellWidth: 'auto' },
                        2: { cellWidth: 'auto' },
                        3: { cellWidth: 'auto' },
                    },
                    alternateRowStyles: { fillColor: [255, 255, 255] },
                    bodyStyles: {
                        fontSize: 10,
                        font: 'Courier',
                        cellPadding: { top: 1, right: 5, bottom: 1, left: 2 },
                        textColor: [0, 0, 0],
                        rowPageBreak: 'avoid',
                    },
                    margin: { top: 10, left: 10, right: 10 },
                });
        
                y = doc.lastAutoTable.finalY + 10;
            }
        });

        // Add page numbers
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.line(10, 283, 200, 283);
            doc.setPage(i);
            doc.setFont('Courier');
            doc.text(
                    `Page ${i} of ${totalPages}`,
                    185,
                    doc.internal.pageSize.getHeight() - 5
            );
        }
        /* Finally export the PDF */
        doc.save(`Medication_History_Report_${dayjs().format('YYYY-MM-DD')}.pdf`);
    }

    return (
        <Button variant="contained" color="primary" onClick={handleDownload} disabled={userData?.length == 0 && parentData?.length == 0}>
            Export Medication History
        </Button>
    );
}
