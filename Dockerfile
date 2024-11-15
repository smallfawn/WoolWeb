FROM node:20-alpine

WORKDIR /app

COPY ./server/package*.json ./

RUN npm install

COPY ./server .

EXPOSE 1433

# 启动应用
CMD ["node", "index.js"]
