FROM node:latest
ENV AWS=true
ENV PORT=8000

WORKDIR /app
COPY ["backend/package.json", "backend/package-lock.json", "./"]
RUN npm install
COPY backend .

EXPOSE 8000
HEALTHCHECK CMD nc -z localhost 8000
CMD node src/server.js