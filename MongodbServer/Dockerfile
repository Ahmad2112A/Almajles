FROM node
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
EXPOSE 8090
COPY . .
CMD node AccessMDB.js