FROM node
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
EXPOSE 8080
COPY . .
CMD node getDoc.js