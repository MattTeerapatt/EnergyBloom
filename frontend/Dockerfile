# Use the official Node.js image
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN yarn build

# Use a lighter image to serve the application
FROM node:18 AS runner

# Set the working directory for the runner
WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Install production dependencies
RUN yarn install --production

# Start the application
CMD ["yarn", "start"]
