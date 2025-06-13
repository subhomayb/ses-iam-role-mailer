# SES Mailer 

A simple Node.js + Express app that sends emails using AWS SES.  
Supports AWS credentials via OS environment variables or IAM roles (e.g., EC2/ECS) whichever is present.  
Dockerized for easy deployment.

## 🚀 Features

- Send email using AWS SES
- Accept recipient email via browser (`/send-email?to=...`) 
- Example: http://localhost:3000/send-email?to=recipient@example.com
- Use AWS credentials or fallback to IAM role
- Docker-ready

## 🧪 Usage

### Build Docker image

```bash
docker build -t ses-mailer .

Run with AWS credentials:
```bash
docker run -p 3000:3000 \
  -e AWS_ACCESS_KEY_ID=your-access-key \
  -e AWS_SECRET_ACCESS_KEY=your-secret-key \
  -e AWS_SESSION_TOKEN=your-session-token \
  -e AWS_REGION=us-east-1 \
  -e SES_SOURCE_EMAIL=verified-sender@example.com \
  ses-mailer

Run with IAM Role (on EC2 or ECS)
```bash
docker run -p 3000:3000 \
  -e AWS_REGION=us-east-1 \
  -e SES_SOURCE_EMAIL=verified-sender@example.com \
  ses-mailer

Call the API
Open in your browser or use curl:
http://localhost:3000/send-email?to=recipient@example.com




