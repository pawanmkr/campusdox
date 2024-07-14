ARG NODE_IMAGE=node:20-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init curl
# Install pnpm
RUN npm install -g pnpm
# user node already exists in alpine image
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./
RUN pnpm install
COPY --chown=node:node . .

FROM dependencies AS build
RUN pnpm build

FROM base AS production
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./
COPY --chown=node:node ./.env ./
RUN pnpm install --prod
COPY --chown=node:node --from=build /home/node/app/build .
EXPOSE $PORT
CMD [ "node", "bin/server.js" ]
