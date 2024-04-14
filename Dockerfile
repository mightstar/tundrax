# Use the official Node.js 20.12.2 image as a base
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy .npmrc file to the working directory
COPY .npmrc .npmrc

# Copy .env.example file to the working directory as .env
COPY .env.example .env

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your Nest.js application will run
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
