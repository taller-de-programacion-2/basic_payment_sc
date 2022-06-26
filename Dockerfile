FROM node:17.9

WORKDIR /app

ENV NODE_ENV=production
# Add your source files

COPY . .  

COPY package.json package.json  
RUN npm install


CMD ["npm","run","start"]  