FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN addgroup -S app && adduser -S app -G app
USER app
ENV PORT=3000
EXPOSE 3000
CMD ["node", "seerver.js"]
