# good/Dockerfile — a small Node service written with the OS checklist of lesson 12.7 in mind.
FROM node:22-alpine
WORKDIR /app
# dependencies first (none here), source last — the build cache of lesson 12.3
COPY server.js ./
# a non-root user that the base image already has (uid 1000)
USER node
EXPOSE 3000
# exec form: node itself is PID 1's child under --init, and receives SIGTERM directly
CMD ["node", "server.js"]
