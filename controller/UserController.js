const Users=require("../model/UserModel.js");
const bcrypt=require("bcryptjs");
const cloudinary = require("cloudinary");
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
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
  const imagePath = path.join(__dirname, '..', 'Images', 'logo512.png'); // Use the actual image URL
 return res.sendFile(imagePath);

}
exports.upload=async(req,res,next)=>{
    try{
    const { userId } = req.query.userId; // Assume the userId is sent in the request body
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('ds')
        return res.status(400).send('No files were uploaded.');
      }
  const file = req.files.file;
  const pdfBytes = file.data;

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPage(0);
  const trackingImageUrl = `http://localhost:9000/user/tracking-image`;
 
    const trackingImageResponse = await fetch(trackingImageUrl);
    if (!trackingImageResponse.ok) {
      throw new Error(`Failed to fetch tracking image: ${trackingImageResponse.statusText}`);
    }
    const trackingImageArrayBuffer = await trackingImageResponse.arrayBuffer();
    const trackingImageBytes = Buffer.from(trackingImageArrayBuffer);
  const trackingImage = await pdfDoc.embedPng(trackingImageBytes);

  const { width, height } = trackingImage.scale(0.05); // Scale the image to be very small

  page.drawImage(trackingImage, {
    x: page.getWidth() - width - 10, // Position it at the bottom-right corner
    y: 10,
    width,
    height,
  });

  const modifiedPdfBytes = await pdfDoc.save();

  await Users.create({
   id: userId,
   old: Buffer.from(pdfBytes), // Convert pdfBytes to Buffer
   new: Buffer.from(modifiedPdfBytes),
    timestamp: new Date(),
  });
  res.contentType('application/pdf');
  res.send(modifiedPdfBytes);
    }catch(err){
        console.log(err)
        next(err)
    }
}

