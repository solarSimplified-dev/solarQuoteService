const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});
const bucketName = process.env.GCS_BUCKET_NAME;

const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
});

async function uploadFile(file) {
  try {
    console.log('Initializing Google Cloud Storage upload...');
    console.log('Bucket name:', bucketName);
    console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
    console.log('Key file:', process.env.GOOGLE_CLOUD_KEYFILE);

    // Check if the key file exists
    if (fs.existsSync(process.env.GOOGLE_CLOUD_KEYFILE)) {
      console.log('Google Cloud key file exists');
    } else {
      console.error('Google Cloud key file does not exist');
      throw new Error('Google Cloud key file not found');
    }

    // Check if the bucket exists
    const [bucketExists] = await storage.bucket(bucketName).exists();
    if (!bucketExists) {
      console.error('The specified bucket does not exist');
      throw new Error('The specified bucket does not exist');
    }
    console.log('Bucket exists');

    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(file.originalname);

    console.log('Uploading file...');
    const uploadPromise = new Promise((resolve, reject) => {
      blob.save(file.buffer, {
        contentType: file.mimetype,
        timeout: 30000, // 30 seconds timeout
      }, (err) => {
        if (err) {
          console.error('Error during file upload:', err);
          reject(err);
        } else {
          console.log('File uploaded successfully');
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
          console.log('Public URL:', publicUrl);
          resolve(publicUrl);
        }
      });
    });

    const publicUrl = await uploadPromise;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to Google Cloud Storage:', error);
    throw error;
  }
}

async function saveToDatabase(data) {
  try {
    console.log('Attempting to save data to Firestore...');
    console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
    console.log('Key file:', process.env.GOOGLE_CLOUD_KEYFILE);

    const docRef = await firestore.collection('solarQuotes').add({
      fileUrl: data.fileUrl,
      processedResult: data.processedResult,
      fileName: data.fileName,
      createdAt: Firestore.FieldValue.serverTimestamp()
    });

    console.log('Data saved to Firestore with ID:', docRef.id);
    return { id: docRef.id };
  } catch (error) {
    console.error('Error saving data to Firestore:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.details) {
      console.error('Error details:', error.details);
    }
    throw error;
  }
}

module.exports = { uploadFile, saveToDatabase };