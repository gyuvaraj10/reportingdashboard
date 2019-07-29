FROM node:10.16.0-alpine
RUN npm install -g @angular/cli
RUN mkdir /app
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN ng build
EXPOSE 4200
CMD [ npm start ]