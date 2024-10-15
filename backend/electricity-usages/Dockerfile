# # # Use the Node.js image as the base image
# # FROM node:16

# # # Set the working directory inside the container
# # WORKDIR /app

# # # Copy package.json and yarn.lock to the container
# # COPY package.json yarn.lock ./

# # # Install dependencies (including ts-node)
# # RUN yarn install --frozen-lockfile

# # # Copy all application files to the container
# # COPY . .

# # # Set environment variables (these can be overridden by Docker Compose)
# # ENV PG_USER=users
# # ENV PG_PASSWORD=password
# # ENV PG_HOST=users-db
# # ENV PG_DATABASE=users_db
# # ENV PG_PORT=5432

# # # Expose the port the service will run on
# # EXPOSE 3007

# # # Command to run your service
# # CMD ["yarn", "start"]


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

# # Set environment variables (these can be overridden by Docker Compose)
# ENV DATABASE_URL=postgresql://usages:password@usages-db:5432/usages_db

# # Expose the port the service will run on
# EXPOSE 3003

# # Command to run your service and apply migrations
# CMD ["sh", "-c", "until pg_isready -h usages-db -U usages; do sleep 2; done; npx sequelize-cli db:migrate; yarn start"]


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
ENV DATABASE_URL=postgresql://usages:password@usages-db:5432/usages_db

# Expose port and run the application
EXPOSE 3000
CMD ["./node_modules/.bin/ts-node", "src/index.ts"]
