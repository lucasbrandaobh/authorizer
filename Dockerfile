FROM node:10
LABEL maintainer="Carlos Lucas Brandão Silva"

COPY . /home/authorizer
WORKDIR /home/authorizer

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]