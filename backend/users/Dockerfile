# # Use the Node.js image as the base image
# FROM node:16

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and yarn.lock to the container
# COPY package.json yarn.lock ./

# # Install dependencies
# RUN yarn install --frozen-lockfile

# # Copy all application files to the container
# COPY . .

# # Set environment variables
# ENV DATABASE_URL=postgresql://users:password@users-db:5432/users_db

# # Expose the port the service will run on
# EXPOSE 3007

# # Command to run your service and apply migrations
# CMD ["sh", "-c", "until pg_isready -h users-db -U users; do sleep 2; done; npx sequelize-cli db:migrate; yarn start"]


# Base image
FROM node:18

# Install PostgreSQL client (including pg_isready)
RUN apt-get update && apt-get install -y postgresql-client

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy rest of the application files
COPY . .
# # Set environment variables
ENV DATABASE_URL=postgresql://users:password@users-db:5432/users_db


# Expose port and run the application
EXPOSE 3000
CMD ["./node_modules/.bin/ts-node", "src/index.ts"]
