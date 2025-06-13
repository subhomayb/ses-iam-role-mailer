// This code is only for SES authenticate using IAM role and send emails
const express = require('express');
const AWS = require('aws-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Use region where your SES is setup
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

const ses = new AWS.SES();

app.get('/send-email', async (req, res) => {
  const toAddress = req.query.to;

  if (!toAddress) {
    return res.status(400).send({ error: 'Missing "to" query parameter' });
  }

  const params = {
    Source: 'support@clipcasa.com', // must be SES verified
    Destination: {
      ToAddresses: [toAddress]
    },
    Message: {
      Subject: {
        Data: 'Hello from AWS SES via Docker'
      },
      Body: {
        Text: {
          Data: 'This email was sent using AWS SES and IAM Role in a Dockerized Node.js app.'
        }
      }
    }
  };

  try {
    const result = await ses.sendEmail(params).promise();
    res.send({ messageId: result.MessageId });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
