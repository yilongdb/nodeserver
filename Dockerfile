FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD npm run build
CMD npm run start
EXPOSE 3000