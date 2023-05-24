FROM node
WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install
EXPOSE 8070
COPY . .
CMD node postDoc.js