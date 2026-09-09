export interface DonationReceiptDetails {
  receiptNo: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  type: string;
  date: string;
  paymentId: string;
}

function escapePdfText(text: string): string {
  return (text || '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function numberToWords(num: number): string {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero Rupees Only';
  
  function convert(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
  }

  return convert(Math.floor(num)) + ' Rupees Only';
}

/**
 * Builds a 100% standard, standalone PDF 1.4 binary
 */
export function generatePdfBlob(details: DonationReceiptDetails): Blob {
  const {
    receiptNo,
    donorName,
    donorEmail,
    donorPhone,
    amount,
    type,
    date,
    paymentId,
  } = details;

  const amountWords = numberToWords(amount);

  let stream = '';
  
  // Header background bar (Dark Green)
  stream += 'q\n';
  stream += '0.031 0.227 0.153 rg\n'; // #083a27
  stream += '0 732 595 110 re f\n';
  
  // Accent strip (Light Green)
  stream += '0.086 0.502 0.224 rg\n'; // #168039
  stream += '0 726 595 6 re f\n';
  stream += 'Q\n';

  // Text inside header
  stream += 'BT\n';
  stream += '/F1 22 Tf\n';
  stream += '1 1 1 rg\n'; // White
  stream += '40 795 Td (ITLC FOUNDATION) Tj\n';
  stream += 'ET\n';

  stream += 'BT\n';
  stream += '/F2 10 Tf\n';
  stream += '0.64 0.90 0.75 rg\n';
  stream += '40 780 Td (Empowering Communities Through Learning & Care | Registered Public Trust) Tj\n';
  stream += 'ET\n';

  stream += 'BT\n';
  stream += '/F2 9 Tf\n';
  stream += '0.85 0.95 0.90 rg\n';
  stream += '40 750 Td (Registered Office: G1/0049, Olive Wood Villa, Golf City, Lucknow, UP - 226030) Tj\n';
  stream += '40 738 Td (Website: itlcfoundation.org | Contact: info@itlcfoundation.com | Helpline: +91 93361 88402) Tj\n';
  stream += 'ET\n';

  // Title: Official Donation Receipt (80G)
  stream += 'BT\n';
  stream += '/F1 15 Tf\n';
  stream += '0.086 0.502 0.224 rg\n'; // Dark Green
  stream += '40 685 Td (DONATION RECEIPT - SECTION 80G TAX EXEMPT) Tj\n';
  stream += 'ET\n';

  // Subtitle / Legal line
  stream += 'BT\n';
  stream += '/F2 9.5 Tf\n';
  stream += '0.3 0.3 0.3 rg\n';
  stream += '40 668 Td (Exemption under Section 80G\\(5\\)\\(vi\\) of the Income Tax Act, 1961. Unique Reg. No: AACTI3479DE20241) Tj\n';
  stream += 'ET\n';

  // Table box outline
  stream += 'q\n';
  stream += '0.85 0.90 0.88 RG\n'; // Border color
  stream += '1 w\n';
  stream += '40 400 515 240 re S\n';
  
  // Table row divider lines
  stream += '40 600 515 0 re S\n';
  stream += '40 560 515 0 re S\n';
  stream += '40 520 515 0 re S\n';
  stream += '40 480 515 0 re S\n';
  stream += '40 440 515 0 re S\n';
  
  // Column divider
  stream += '240 400 0 240 re S\n';
  stream += 'Q\n';

  // Table header background for amount
  stream += 'q\n';
  stream += '0.93 0.97 0.95 rg\n';
  stream += '40 400 515 40 re f\n';
  stream += 'Q\n';

  // Table Labels (Left Column)
  stream += 'BT\n';
  stream += '/F1 10 Tf\n';
  stream += '0.35 0.4 0.45 rg\n';
  stream += '55 618 Td (Receipt Number) Tj\n';
  stream += '0 -40 Td (Date & Time of Donation) Tj\n';
  stream += '0 -40 Td (Donor Full Name) Tj\n';
  stream += '0 -40 Td (Contact Details) Tj\n';
  stream += '0 -40 Td (Transaction / Payment ID) Tj\n';
  stream += '/F1 12 Tf\n';
  stream += '0.031 0.227 0.153 rg\n';
  stream += '0 -40 Td (Total Amount Received) Tj\n';
  stream += 'ET\n';

  // Table Values (Right Column)
  stream += 'BT\n';
  stream += '/F1 10.5 Tf\n';
  stream += '0.031 0.227 0.153 rg\n';
  stream += '255 618 Td (' + escapePdfText(receiptNo) + ') Tj\n';
  stream += '/F2 10 Tf\n';
  stream += '0.1 0.1 0.1 rg\n';
  stream += '0 -40 Td (' + escapePdfText(date) + ') Tj\n';
  stream += '/F1 10.5 Tf\n';
  stream += '0 -40 Td (' + escapePdfText(donorName) + ') Tj\n';
  stream += '/F2 10 Tf\n';
  stream += '0.1 0.1 0.1 rg\n';
  stream += '0 -40 Td (' + escapePdfText(donorEmail + ' | +91 ' + donorPhone) + ') Tj\n';
  stream += '0 -40 Td (' + escapePdfText(paymentId + ' (' + type + ')') + ') Tj\n';
  stream += '/F1 14 Tf\n';
  stream += '0.086 0.502 0.224 rg\n';
  stream += '0 -40 Td (INR ' + escapePdfText(amount.toLocaleString('en-IN')) + '/- (' + escapePdfText(amountWords) + ')) Tj\n';
  stream += 'ET\n';

  // 80G Exemption Box
  stream += 'q\n';
  stream += '0.96 0.98 0.96 rg\n';
  stream += '0.086 0.502 0.224 RG\n';
  stream += '1.5 w\n';
  stream += '40 280 515 95 re B\n';
  stream += 'Q\n';

  stream += 'BT\n';
  stream += '/F1 10 Tf\n';
  stream += '0.086 0.502 0.224 rg\n';
  stream += '55 352 Td (SECTION 80G TAX BENEFIT CERTIFICATE) Tj\n';
  stream += '/F2 8.5 Tf\n';
  stream += '0.25 0.25 0.25 rg\n';
  stream += '0 -16 Td (This certifies that the donation of INR ' + amount.toLocaleString('en-IN') + ' received from ' + escapePdfText(donorName) + ' is eligible for) Tj\n';
  stream += '0 -13 Td (50% deduction under Section 80G of the Income Tax Act, 1961. ITLC Foundation is a registered public charity.) Tj\n';
  stream += '0 -13 Td (PAN: AABTI8329D  |  12A Reg: AACTI3479DE20241  |  Validity: AY 2025-26 to AY 2027-28) Tj\n';
  stream += '0 -13 Td (No goods or services were provided in exchange for this contribution.) Tj\n';
  stream += 'ET\n';

  // Signatures and Seal
  stream += 'q\n';
  stream += '0.8 0.8 0.8 RG\n';
  stream += '1 w\n';
  stream += '370 190 170 0 re S\n';
  stream += 'Q\n';

  stream += 'BT\n';
  stream += '/F1 9 Tf\n';
  stream += '0.1 0.1 0.1 rg\n';
  stream += '370 175 Td (For ITLC FOUNDATION) Tj\n';
  stream += '/F2 8.5 Tf\n';
  stream += '0.4 0.4 0.4 rg\n';
  stream += '370 160 Td (Authorized Signatory) Tj\n';
  stream += '370 148 Td (Digitally Verified & Stamped) Tj\n';
  stream += 'ET\n';

  // Thank you note at bottom
  stream += 'BT\n';
  stream += '/F1 11 Tf\n';
  stream += '0.086 0.502 0.224 rg\n';
  stream += '40 180 Td (Thank You For Your Generous Support!) Tj\n';
  stream += '/F2 8.5 Tf\n';
  stream += '0.4 0.4 0.4 rg\n';
  stream += '40 162 Td (Your kindness educates children, plants trees & creates lasting change in UP.) Tj\n';
  stream += '40 150 Td (A computer-generated receipt. Does not require physical signature.) Tj\n';
  stream += 'ET\n';

  // Footer bar
  stream += 'q\n';
  stream += '0.94 0.95 0.96 rg\n';
  stream += '0 0 595 40 re f\n';
  stream += 'Q\n';

  stream += 'BT\n';
  stream += '/F2 8 Tf\n';
  stream += '0.45 0.5 0.55 rg\n';
  stream += '140 18 Td (ITLC Foundation - A Registered Charitable Trust in Uttar Pradesh, India - All Rights Reserved) Tj\n';
  stream += 'ET\n';

  const streamLength = new TextEncoder().encode(stream).length;

  const objects: string[] = [];
  objects[1] = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  objects[2] = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  objects[3] = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n';
  objects[4] = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  objects[5] = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  objects[6] = `6 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj\n`;

  let pdf = '%PDF-1.4\n';
  const offsets: string[] = [];
  offsets[0] = '0000000000 65535 f \n';

  for (let i = 1; i <= 6; i++) {
    offsets[i] = String(pdf.length).padStart(10, '0') + ' 00000 n \n';
    pdf += objects[i];
  }

  const startxref = pdf.length;
  pdf += 'xref\n0 7\n';
  for (let i = 0; i <= 6; i++) {
    pdf += offsets[i];
  }
  pdf += 'trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF';

  return new Blob([pdf], { type: 'application/pdf' });
}

/**
 * Triggers instant native PDF file download directly to the user's computer/phone
 */
export function downloadReceiptPdf(details: DonationReceiptDetails) {
  try {
    const blob = generatePdfBlob(details);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeReceiptNo = (details.receiptNo || 'Receipt').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `ITLC_Donation_Receipt_${safeReceiptNo}.pdf`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
  } catch (err) {
    console.error('Failed to download PDF directly:', err);
    printReceiptInvoice(details);
  }
}

/**
 * Opens a clean, official A4 printable receipt window for previewing or printing
 */
export function printReceiptInvoice(details: DonationReceiptDetails) {
  const amountWords = numberToWords(details.amount);
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>ITLC Foundation Receipt - ${details.receiptNo}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1f2937; margin: 0; padding: 20px; background: #fff; }
    .receipt-box { max-width: 720px; margin: 0 auto; border: 2px solid #083a27; border-radius: 12px; overflow: hidden; }
    .header { background: #083a27; color: #fff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px; }
    .header p { margin: 4px 0 0; font-size: 12px; color: #a3e6c0; }
    .header .addr { font-size: 11px; color: #e2e8f0; margin-top: 6px; opacity: 0.9; }
    .content { padding: 24px; }
    .badge { display: inline-block; background: #eef8f2; color: #168039; font-weight: bold; font-size: 12px; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; border: 1px solid #c8e2d3; margin-bottom: 12px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; border: 1px solid #e2e8f0; }
    th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    td.label { color: #64748b; font-weight: 500; width: 40%; }
    td.val { color: #083a27; font-weight: bold; text-align: right; }
    tr.total { background: #eef8f2; }
    tr.total td { font-size: 17px; font-weight: 800; color: #168039; }
    .tax-box { background: #f8fafc; border-left: 4px solid #168039; padding: 12px 14px; border-radius: 4px; font-size: 12px; color: #334155; margin: 20px 0; line-height: 1.5; }
    .signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding-top: 16px; }
    .seal { text-align: right; }
    .seal-line { border-top: 1px solid #94a3b8; width: 180px; margin-bottom: 4px; display: inline-block; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: center; margin-bottom: 16px;">
    <button onclick="window.print()" style="background: #168039; color: white; border: none; padding: 10px 24px; border-radius: 20px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">🖨️ Print / Save as PDF</button>
  </div>
  <div class="receipt-box">
    <div class="header">
      <h1>ITLC FOUNDATION</h1>
      <p>Empowering Communities Through Learning & Care &bull; Registered Public Charitable Trust</p>
      <div class="addr">G1/0049, Olive Wood Villa, Golf City, Lucknow, Uttar Pradesh – 226030</div>
      <div class="addr">Email: info@itlcfoundation.com | Helpline: +91 93361 88402 | Web: itlcfoundation.org</div>
    </div>
    <div class="content">
      <div style="text-align: center;">
        <span class="badge">✓ Official 80G Tax Exemption Receipt</span>
      </div>
      <table>
        <tr>
          <td class="label">Receipt Number:</td>
          <td class="val">${details.receiptNo}</td>
        </tr>
        <tr>
          <td class="label">Date of Donation:</td>
          <td class="val">${details.date}</td>
        </tr>
        <tr>
          <td class="label">Donor Full Name:</td>
          <td class="val">${details.donorName}</td>
        </tr>
        <tr>
          <td class="label">Email Address:</td>
          <td class="val">${details.donorEmail}</td>
        </tr>
        <tr>
          <td class="label">Mobile Number:</td>
          <td class="val">+91 ${details.donorPhone}</td>
        </tr>
        <tr>
          <td class="label">Payment / Transaction ID:</td>
          <td class="val">${details.paymentId}</td>
        </tr>
        <tr>
          <td class="label">Donation Type:</td>
          <td class="val">${details.type}</td>
        </tr>
        <tr class="total">
          <td>Total Amount Donated:</td>
          <td class="val">₹ ${details.amount.toLocaleString('en-IN')}/-</td>
        </tr>
        <tr>
          <td class="label">Amount in Words:</td>
          <td class="val" style="font-size: 12px; font-style: italic;">${amountWords}</td>
        </tr>
      </table>

      <div class="tax-box">
        <strong>Income Tax Exemption (Section 80G):</strong><br/>
        Donations to ITLC Foundation qualify for 50% deduction under Section 80G of the Income Tax Act, 1961.<br/>
        <strong>PAN:</strong> AABTI8329D &bull; <strong>12A Reg. No:</strong> AACTI3479DE20241 &bull; <strong>Validity:</strong> AY 2025–26 to AY 2027–28
      </div>

      <div class="signatures">
        <div>
          <div style="font-size: 13px; font-weight: bold; color: #083a27;">Thank You For Your Support!</div>
          <div style="font-size: 11px; color: #64748b;">Your contribution directly supports education, animal care & tree plantation.</div>
        </div>
        <div class="seal">
          <div class="seal-line"></div>
          <div style="font-size: 12px; font-weight: bold; color: #083a27;">For ITLC FOUNDATION</div>
          <div style="font-size: 11px; color: #64748b;">Authorized Signatory</div>
        </div>
      </div>

      <div class="footer">
        This is an electronically generated official receipt. Verified under ITLC Foundation digital audit systems.
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
