FROM node:16.9.0

WORKDIR /app

COPY . .  

RUN echo "en_US UTF-8" >> /etc/locale.gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

COPY package.json package.json  
RUN npm install --ignore-scripts
RUN npm run deploy-kovan --ignore-scripts
CMD ["npm","run","start"]  