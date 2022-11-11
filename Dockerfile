FROM node:18-alpine

RUN mkdir /opt/notes && chown -R node:node /opt/notes

WORKDIR /opt/notes

USER node
