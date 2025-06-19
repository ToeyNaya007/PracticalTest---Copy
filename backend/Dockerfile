FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (รวมถึง ts-node-dev)
RUN npm install

# Install ts-node-dev globally
RUN npm install -g ts-node-dev

# Copy the rest of the app
COPY . .

# Expose the port for backend
EXPOSE 5000

# Run the backend using ts-node-dev
CMD ["npm", "run", "dev"]
