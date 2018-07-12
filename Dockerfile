FROM node:carbon-stretch
RUN mkdir /feathers-auth-local-test
WORKDIR /feathers-auth-local-test
COPY . /feathers-auth-local-test
EXPOSE 3031
RUN npm i
CMD ["npm", "start"]
