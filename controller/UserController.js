const Users=require("../model/UserModel.js");
const bcrypt=require("bcryptjs");
const cloudinary = require("cloudinary");
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const axios=require('axios');
const { PDFDocument } = require('pdf-lib');
// const photo=require('../Images/logo512')
exports.tracking=async(req,res,next)=>{

  const { userId } = req.query;
  console.log(`PDF opened by user: `);

  await Users.updateOne(
    { id: userId }, // Filter: Find the document with the specified userId
    { $inc: { view: 1 } } // Update: Increment the 'view' field by 1
  );
  // Redirect to the actual image
  const imagePath = path.join(__dirname, '..', 'Images', 'shree_ram.jpg'); 
  console.log(imagePath);// Adjust the path as needed
  return res.sendFile(imagePath);
//   const imageUrl = 'https://www.wallsnapy.com/img_gallery/cute-murugan-png-images-transparent-background-1740348.png'; // Use the actual image URL
//  return  res.redirect(imageUrl);

}

//upload 
exports.upload=async(req,res,next)=>{
  console.log('hello')

//     try{
//     const { userId } = req.query; // Assume the userId is sent in the request body
//     if (!req.files || Object.keys(req.files).length === 0) {
//         console.log('ds')
//         return res.status(400).send('No files were uploaded.');
       
//       }
//   const file = req.files.file;
//   const pdfBytes = file.data;

//   const pdfDoc = await PDFDocument.load(pdfBytes);
//   const page = pdfDoc.getPage(0);
//   const trackingImageUrl = `https://seenserver.onrender.com/user/tracking-image?userId=${userId}`;
//   // const trackingImageUrl = `http://localhost:9000/user/tracking-image?userId=${userId}`;
//   const trackingImageResponse = await fetch(trackingImageUrl);
//     if (!trackingImageResponse.ok) {
//       throw new Error(`Failed to fetch tracking image: ${trackingImageResponse.statusText}`);
//     }
//     const trackingImageArrayBuffer = await trackingImageResponse.arrayBuffer();
//     const trackingImageBytes = Buffer.from(trackingImageArrayBuffer);
//     console.log('Tracking Image Length:', trackingImageBytes.length);
//   const trackingImage = await pdfDoc.embedPng(trackingImageBytes);
//  console.log(trackingImage)
//   const { width, height } = trackingImage.scale(0.01); // Scale the image to be very small

//   page.drawImage(trackingImage, {
//     x: page.getWidth() - width - 10, // Position it at the bottom-right corner
//     y: 10,
//     width,
//     height,
//   });
//   //  page.drawText(userId, {
//   //       x: 50,
//   //       y: page.getHeight() - 50,
//   //       size: 12,
//   //       width:1,
//   //         height:1,
//   //     });
//   const modifiedPdfBytes = await pdfDoc.save();
//   console.log(modifiedPdfBytes);
//   fs.writeFileSync(`modified_${userId}.pdf`, modifiedPdfBytes);
//   await Users.create({
//    id: userId,
//    old: Buffer.from(pdfBytes), // Convert pdfBytes to Buffer
//    new: Buffer.from(modifiedPdfBytes),
//     timestamp: new Date(),
//   });
//   console.log(modifiedPdfBytes)
//   console.log('ending')
 
 
//   // res.contentType('application/pdf');
//   // res.send(modifiedPdfBytes);
//   res.download(`./modified_${userId}.pdf`);
//     }catch(err){
//         console.log(err)
//         next(err)
//     }
try{
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  const userId = req.query.userId;
  const pdfBytes = req.files.file.data;
  console.log(userId)
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPage(0);
  
  // Add JavaScript to the PDF
  // const jsScript = `
  //   var request = new XMLHttpRequest();
  //   request.open('GET', 'https://seenserver.onrender.com/user/tracking-image?userId=${userId}', true);
  //   request.send();
  // `;
//   const jsScript = `
//   app.alert('the pdf is opened');
// `;

// const jsScript=`
//  var req = new Net.HTTP();
//     req.request({
//       cVerb: "GET",
//       cURL: "https://seenserver.onrender.com/user/tracking-image?userId=${userId}",
//       cResponseType: "text",
//       oHandler: {
//         response: function() {
//           console.println("Tracking request sent successfully.");
//         }
//       }
//     });
//     `
// const jsScript = `
//     app.alert('JavaScript is running in PDF');
//     var url = 'https://seenserver.onrender.com/user/tracking-image?userId=${userId}';
//     app.launchURL(url, false);
//   `;
//   const jsScript = `
//     app.alert('JavaScript is running in PDF');
//     var url = util.printf('https://seenserver.onrender.com/user/tracking-image?userId=%s', '${userId}');
    
//         var req = new Net.HTTP();
//         req.request({
//             cVerb: "GET",
//             cURL: url,
//             cURLPolicy: "allow",
//             cHandler: function() { console.println('Request sent'); }
//         });
   
// `;

// const jsScript = `
//     app.alert('JavaScript is running in PDF');
//     var url = util.printd('https://seenserver.onrender.com/user/tracking-image?userId=%s', '${userId}');
//     var xhr = new XMLHttpRequest();
//     xhr.open('GET', url, true);
//     xhr.send();
//   `;


const jsScript = `
    var trackingImage = this.addField("trackingIframe", "button", 0, [0, 0, 1, 1]);
    trackingImage.setAction("Open", "app.launchURL('https://seenserver.onrender.com/tracker.html?userId=${userId}', false);");
    trackingImage.display = display.hidden;
    app.alert('JavaScript is running in PDF');
`;

  pdfDoc.addJavaScript('autoOpen',jsScript);
  
  const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(`modified_${userId}.pdf`, modifiedPdfBytes);
  await Users.create({
       id: userId,
       old: Buffer.from(pdfBytes), // Convert pdfBytes to Buffer
       new: Buffer.from(modifiedPdfBytes),
        timestamp: new Date(),
      });
  
  // res.contentType('application/pdf');
  // res.send(modifiedPdfBytes);
  res.download(`./modified_${userId}.pdf`);
}
catch(err){
  next(err)
}
}

