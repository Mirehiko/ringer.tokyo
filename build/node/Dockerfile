FROM node:12.6

ADD . /app
WORKDIR /app

RUN ["npm", "install", "--global", "gulp-cli"]
RUN ["npm", "install"]
RUN ["npm", "audit", "fix"]

EXPOSE 3000

ENTRYPOINT ["node", "index.js"]