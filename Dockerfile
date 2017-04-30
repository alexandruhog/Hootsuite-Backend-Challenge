FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app depecencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm install -g mocha
RUN npm install -g nodemon

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD ["npm", "start"]
