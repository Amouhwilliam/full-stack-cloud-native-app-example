FROM node:18.15.0-alpine

WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN yarn install
ENV VITE_WS_URL=
ENV VITE_API_URL=
COPY . .

#RUN yarn build
#RUN npm install -g serve 

#CMD ["serve", "-s", "dist", "-l", "5173"]
CMD ["yarn", "dev"]

EXPOSE 5173