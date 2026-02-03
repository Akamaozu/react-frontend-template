# load node.js image
ARG NODE_VERSION=latest
FROM node:${NODE_VERSION}

# set default values
ARG PORT=3001
ARG ENV_NAME=production
ARG WORKDIR_PATH=/usr/app

# use specified values, if any
# fallback to default values
ENV PORT=${PORT}
ENV ENV_NAME=${ENV_NAME}

# set workdir
WORKDIR ${WORKDIR_PATH}

# copy source code
COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json
COPY ./public ./public
COPY ./server ./server
COPY ./utils ./utils
COPY ./src ./src

# install dependencies
RUN npm i

# expose the port that the app listens on
EXPOSE ${PORT}

# start server
CMD ["node", "./server/supervisor.js"]
