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
ENV DATABASE_URL=postgresql://aircons:password@aircons-db:5432/aircons_db

# Expose port and run the application
EXPOSE 3001

CMD ["./node_modules/.bin/ts-node", "src/index.ts"]
