# Use an official Node runtime as a parent image
FROM node:20.0.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run app.js when the container launches
CMD ["node", "app.js"]


