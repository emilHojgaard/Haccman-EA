FROM node:22-alpine
WORKDIR /HACCMAN-EA
COPY . .
RUN yarn install --production
CMD ["node", "./frontend/src/main.js"]