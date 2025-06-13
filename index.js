// This code is for SES authenticate using AWS Credentials if present or else IAM role and send emails
const express = require('express');
const AWS = require('aws-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Set AWS region
const region = process.env.AWS_REGION || 'us-east-1';
AWS.config.update({ region });

// Check if AWS credentials are provided via env
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('Using AWS credentials from environment variables');

  AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN // optional
  });
} else {
  console.log('Using IAM Role (EC2/ECS) credentials');
  // AWS SDK automatically uses IAM role credentials if available
}

const ses = new AWS.SES();

app.get('/send-email', async (req, res) => {
  const toAddress = req.query.to;
  if (!toAddress) {
    return res.status(400).send({ error: 'Missing "to" query parameter' });
  }

  const params = {
    Source: process.env.SES_SOURCE_EMAIL || 'verified-sender@example.com',
    Destination: {
      ToAddresses: [toAddress]
    },
    Message: {
      Subject: { Data: 'Hello from AWS SES via Docker' },
      Body: {
        Text: {
          Data: 'This email was sent using AWS SES with manual credentials logic.'
        }
      }
    }
  };

  try {
    const result = await ses.sendEmail(params).promise();
    res.send({ messageId: result.MessageId });
  } catch (err) {
    console.error('SES send error:', err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
