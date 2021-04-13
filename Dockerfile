FROM node:14.16.1-alpine3.13

ENV \
  PORT=3000 \
  REGISTAR_PORT=4000 \
  WORKDIR=/app

WORKDIR $WORKDIR


RUN set -ex; \
  apk add --no-cache netcat-openbsd

COPY --chown=node:node package.json package-lock.json ${WORKDIR}/

RUN set -ex; \
  npm i;

COPY --chown=node:node node.js registar.js ${WORKDIR}/
COPY --chown=root:root --chmod=0755 docker-entrypoint.sh /

USER node

ENTRYPOINT "/docker-entrypoint.sh"
CMD ["node-start"]
