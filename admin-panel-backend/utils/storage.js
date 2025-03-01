const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
  keyFilename: path.join(__dirname, "../gcs-key.json"),
  projectId: process.env.GCS_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

const generateSignedUrl = async (fileName, fileType) => {
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: fileType, // Add the actual file type
  };

  const [url] = await bucket.file(fileName).getSignedUrl(options);
  return url;
};

const getPublicUrl = (fileName) => {
  return `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/${fileName}`;
};

module.exports = { generateSignedUrl, getPublicUrl };
