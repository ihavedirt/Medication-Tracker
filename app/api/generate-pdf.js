import PDFDocument from 'pdfkit'

export default function handler(req, res) {
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

    // Pipe PDF to response
    doc.pipe(res);

    // Add some content to PDF
    doc.fontSize(18).text('Medication Report', { align: 'center'});
    doc.moveDown();

    // Example data for now
    const medications = [
        { id: 1, name: 'Aspirin', dosage: '100mg'},
        { id: 2, name: 'Paracetamol', dosage: '500mg'},
    ];

    // Add table headers
    doc.fontSize(12).text('ID', { width: 100, continued: true})
        .text('Name', { width: 200, continued: true})
        .text('Dosage', { align: 'right'});
    doc.moveDown();

    // Add rows
    medications.forEach((med) => {
        doc.text(med.id, { width: 100, continued: true})
           .text(med.name, { width: 200, continued: true})
           .text(med.dosage, { align: 'right'});
    });

    // Finalize PDF
    doc.end();
}

