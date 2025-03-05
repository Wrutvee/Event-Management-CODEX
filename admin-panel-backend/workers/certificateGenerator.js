const { parentPort } = require('worker_threads');
const PDFDocument = require('pdfkit');
const { storage, uploadFile } = require('../utils/storage');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

async function generateCertificate(userData, eventData) {
  try {
    // Create PDF document with proper dimensions
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      autoFirstPage: false // Prevent automatic first page creation
    });

    // Create a buffer to collect PDF chunks
    const chunks = [];
    doc.on('data', chunks.push.bind(chunks));

    // Create canvas with A4 landscape dimensions (mm to pixels at 72 DPI)
    const width = 842; // A4 width in points (297mm)
    const height = 595; // A4 height in points (210mm)
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Load and draw certificate template
    try {
      const template = await loadImage(path.join(__dirname, '../templates/certificate.png'));
      ctx.drawImage(template, 0, 0, width, height);
    } catch (err) {
      console.error('Template loading error:', err);
      // Create a basic background if template fails to load
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, width, height);
    }

    // Add text styling
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add participant name
    ctx.font = 'bold 48px "Times New Roman"';
    ctx.fillText(userData.name, width / 2, height / 2);

    // Add event name
    ctx.font = '24px "Times New Roman"';
    ctx.fillText(eventData.eventName, width / 2, (height / 2) + 60);

    // Add date
    const date = new Date(eventData.eventDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(date, width / 2, (height / 2) + 100);

    // Add page to PDF
    doc.addPage({
      size: [width, height],
      margin: 0
    });

    // Add canvas as image to PDF
    doc.image(canvas.toBuffer('image/png'), 0, 0, {
      fit: [width, height],
      align: 'center',
      valign: 'center'
    });

    // End the document
    doc.end();

    return new Promise(async (resolve, reject) => {
      doc.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          const fileName = `certificates/${eventData.eventId}/${userData.email.replace('@', '_')}.pdf`;
          
          // Upload with correct content type
          const publicUrl = await uploadFile(pdfBuffer, fileName, 'application/pdf');
          
          parentPort.postMessage({
            type: 'certificate-generated',
            data: {
              userEmail: userData.email,
              certificateUrl: publicUrl
            }
          });
          
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

  } catch (error) {
    console.error(`Error generating certificate for ${userData.email}:`, error);
    parentPort.postMessage({
      type: 'certificate-error',
      data: {
        userEmail: userData.email,
        error: error.message
      }
    });
  }
}

// Signal ready to parent
parentPort.postMessage({ type: 'ready' });

// Listen for generation requests
parentPort.on('message', async ({ type, eventData, users }) => {
  if (type === 'generate') {
    try {
      for (const user of users) {
        try {
          await generateCertificate(user, eventData);
        } catch (error) {
          console.error(`Error generating certificate for ${user.email}:`, error);
          parentPort.postMessage({
            type: 'certificate-error',
            data: {
              userEmail: user.email,
              error: error.message
            }
          });
        }
      }
      
      parentPort.postMessage({
        type: 'completion',
        data: { success: true }
      });
    } catch (error) {
      console.error('Process users error:', error);
      parentPort.postMessage({
        type: 'completion',
        data: { 
          success: false,
          error: error.message 
        }
      });
    }
  }
});
