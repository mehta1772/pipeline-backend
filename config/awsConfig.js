const AWS = require('aws-sdk');

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

// Test connection
s3.headBucket({ Bucket: process.env.AWS_S3_BUCKET }, function(err, data) {
  if (err) {
    console.log('❌ AWS S3 Connection Error:', err.message);
  } else {
    console.log('✅ AWS S3 Connected to bucket:', process.env.AWS_S3_BUCKET);
  }
});

module.exports = s3;