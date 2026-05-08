FROM node:20-alpine

WORKDIR /app

# Install dependencies first for layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
