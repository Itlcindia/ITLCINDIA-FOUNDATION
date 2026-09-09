const PDFDocument = require('pdfkit');

function generateReceiptPDF(donation) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (err) => reject(err));

      // Header Brand
      doc.fillColor('#1B5E20').fontSize(24).font('Helvetica-Bold').text('ITLC FOUNDATION', { align: 'center' });
      doc.fontSize(10).fillColor('#555555').font('Helvetica-Oblique').text('Serving Humanity. Protecting Nature. Saving Lives.', { align: 'center' });
      doc.font('Helvetica').fontSize(9).text('G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030', { align: 'center' });
      doc.text('Email: info@itlcfoundation.org | Website: www.itlcfoundation.org', { align: 'center' });
      doc.moveDown(1);
      doc.strokeColor('#1B5E20').lineWidth(2).moveTo(50, doc.y).lineTo(562, doc.y).stroke();
      doc.moveDown(1.5);

      // Title
      doc.fontSize(15).fillColor('#1B5E20').font('Helvetica-Bold').text('DONATION RECEIPT (UNDER SECTION 80G)', { align: 'center', underline: true });
      doc.moveDown(1.5);

      // Info Table-like Layout
      doc.fontSize(11).fillColor('#333333').font('Helvetica');
      
      const receiptNo = `ITLC-80G-${donation.id}-${new Date(donation.created_at || new Date()).getFullYear()}`;
      const donationDate = new Date(donation.created_at || new Date()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      doc.text(`Receipt No: ${receiptNo}`, 50, doc.y);
      doc.text(`Date: ${donationDate}`, 380, doc.y - 14);
      doc.moveDown(1.5);

      doc.text(`Received with thanks from:`, 50, doc.y);
      doc.font('Helvetica-Bold').fillColor('#000000').text(`${donation.donor_name}`, 220, doc.y - 14);
      doc.font('Helvetica').fillColor('#333333');
      doc.moveDown(0.8);

      doc.text(`Email Address:`, 50, doc.y);
      doc.text(`${donation.donor_email}`, 220, doc.y - 14);
      doc.moveDown(0.8);

      doc.text(`Donation Type:`, 50, doc.y);
      doc.text(`${donation.type === 'monthly' ? 'Monthly (Recurring Subscription)' : 'One-time Donation'}`, 220, doc.y - 14);
      doc.moveDown(0.8);

      doc.text(`Amount Received:`, 50, doc.y);
      doc.font('Helvetica-Bold').fillColor('#1B5E20').text(`INR ${parseFloat(donation.amount).toFixed(2)}`, 220, doc.y - 14);
      doc.font('Helvetica').fillColor('#333333');
      doc.moveDown(2);

      // Certifications
      doc.strokeColor('#DDDDDD').lineWidth(1).moveTo(50, doc.y).lineTo(562, doc.y).stroke();
      doc.moveDown(1);
      
      doc.fontSize(9).fillColor('#666666').font('Helvetica-Oblique');
      doc.text('ITLC Foundation is a registered non-profit trust in Lucknow, Uttar Pradesh, India.', { align: 'left' });
      doc.text('Donations are exempt from income tax under Section 80G of the Income Tax Act, 1961.', { align: 'left' });
      doc.text('PAN: AABTI8329D | Registration No: LKO/80G/2023-24/1109A.', { align: 'left' });
      doc.moveDown(2);

      // Signatures
      doc.fontSize(11).fillColor('#1B5E20').font('Helvetica-Bold');
      doc.text('For ITLC FOUNDATION', 350, doc.y, { align: 'right' });
      doc.moveDown(1.5);
      doc.fillColor('#333333').font('Helvetica-Bold').text('Authorized Signatory', 350, doc.y, { align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateReceiptPDF };
