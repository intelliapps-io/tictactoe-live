FROM --platform=linux/amd64 node:16-alpine

# RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY ./ ./

RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
# RUN npm install -g yarn

WORKDIR /home/node/app/server
RUN yarn

WORKDIR /home/node/app/client
RUN yarn

RUN yarn build-web

# Best practice: Don't run as root. Instead run as node (created in node image)
WORKDIR /home/node/app
RUN chown -R node:node .
USER node

ENV NODE_ENV=production
CMD [ "yarn", "start" ]
