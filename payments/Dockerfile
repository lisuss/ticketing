FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev

RUN apk add --no-cache mongodb-tools
COPY . .

CMD ["npm", "start"]
