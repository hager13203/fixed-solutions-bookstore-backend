# Use Node 18 Alpine
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose app port
EXPOSE 7005

# Start the app
CMD ["node", "."]
