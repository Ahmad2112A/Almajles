FROM node
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
EXPOSE 8160
COPY . .
CMD node api.js