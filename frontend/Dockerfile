FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app for production
RUN npm run build  # เพิ่มบรรทัดนี้

# Expose the port for frontend
EXPOSE 3000

# Run the frontend with Next.js
CMD ["npm", "run", "start"]
