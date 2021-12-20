FROM node:12.18.1

WORKDIR /usr/payments

RUN apt-get update

EXPOSE 80
EXPOSE 3000
EXPOSE 5000

COPY package.json ./

RUN npm install -g typescript
RUN npm i
COPY . .
RUN npm run compile


RUN ls
RUN ls node_modules/
CMD ["npm", "run", "start"]
