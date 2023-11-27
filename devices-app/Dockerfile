# pull official base image
FROM node:18.15.0-alpine

# set working directory
WORKDIR /usr/src/app

# install app dependencies
COPY .. .
ENV REACT_APP_API_URL=
# install and build dependencies
RUN cd sdk/ && yarn && yarn build
RUN cd && npm install -g serve
RUN cd frontend-app/ && yarn && yarn build


WORKDIR /usr/src/app/frontend-app

#CMD ["serve", "-s", "build"]
CMD ["yarn", "start"]

EXPOSE 3000