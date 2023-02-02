FROM node:16-alpine as builder
USER node
WORKDIR /app
COPY --chown=node:node package.json .
RUN yarn install
COPY --chown=node:node . .
RUN yarn build
 
FROM node:16-alpine
USER node
ENV NODE_ENV=prod
COPY --from=builder --chown=node:node /app/package.json /app/
WORKDIR /app
EXPOSE 3000
RUN yarn install --production=true
COPY --from=builder --chown=node:node /app/dist dist
CMD [ "yarn", "start:prod" ]