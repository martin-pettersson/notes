FROM node:16-alpine

ARG environment=production
ARG version=unknown

RUN apk update && apk add --no-cache tzdata
RUN mkdir /opt/notes && chown -R node:node /opt/notes

ENV TZ=Europe/Stockholm
ENV NODE_ENV=${environment}
ENV APP_VERSION=${version}

WORKDIR /opt/notes

COPY --chown=node:node . ./

USER node

RUN npm ci && npm cache clean --force --loglevel=error

CMD ["npm", "start", "--prefix", "api"]
