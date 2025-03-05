const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(__dirname, "../gcs-key.json"),
  projectId: process.env.GCS_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

const uploadFile = async (fileBuffer, fileName, contentType) => {
  const file = bucket.file(fileName);
  
  return new Promise((resolve, reject) => {
    const stream = file.createWriteStream({
      metadata: {
        contentType: contentType,
      },
      resumable: false
    });

    stream.on('error', (err) => reject(err));
    
    stream.on('finish', async () => {
      try {
        // Generate public URL using the bucket's public access
        const publicUrl = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${encodeURIComponent(fileName)}`;
        resolve(publicUrl);
      } catch (err) {
        reject(err);
      }
    });

    stream.end(fileBuffer);
  });
};

const generateSignedUrl = async (fileName, fileType) => {
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
    contentType: fileType,
  };

  const [url] = await bucket.file(fileName).getSignedUrl(options);
  return url;
};

const getPublicUrl = (fileName) => {
  return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${encodeURIComponent(fileName)}`;
};

module.exports = { generateSignedUrl, getPublicUrl, storage, uploadFile };
