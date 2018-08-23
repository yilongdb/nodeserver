FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
#CMD npm run build
#CMD npm run start
CMD npm run build && npm run product
#CMD sh docker-start.sh
EXPOSE 3000