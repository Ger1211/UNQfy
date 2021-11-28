FROM node:14

ENV NEWSLETTER_HOST 'http://host.docker.internal:3001'
ENV LOGGING_HOST 'http://host.docker.internal:3002'

WORKDIR /home/node/unqfy

COPY package.json .
COPY package-lock.json .
RUN ["npm", "install"]

EXPOSE 8080

COPY src /home/node/unqfy/src

RUN chown -R node:users /home/node/unqfy

USER node

CMD ["npm", "run", "api"]