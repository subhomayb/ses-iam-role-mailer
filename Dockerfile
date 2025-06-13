FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY index.js .

EXPOSE 3000

CMD ["npm", "start"]
