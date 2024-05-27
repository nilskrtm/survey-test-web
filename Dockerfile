FROM node:18-alpine

ARG VITE_HTML_TITLE="Dummy Title"
ARG VITE_HTML_DESCRIPTION="Dummy Description"
ARG VITE_IMPRINT_ADDRESS="Address Line 1;Address Line 2; Address Line 3"
ARG VITE_IMPRINT_CONTACT="Contact Line 1;Contact Line 2; Contact Line 3"
ARG VITE_APP_DOWNLOAD_URL="http://static.test.local/app.apk"
ARG VITE_API_ENDPOINT="http://api.test.local"
ARG VITE_API_TIMEOUT=5000
ARG VITE_WS_ENDPOINT="ws://api.test.local/ws"
ARG VITE_WS_RECONNECT_TIMEOUT=5000

# install nginx and supervisor
RUN apk update \
    && apk add nginx \
    && apk add supervisor

# remove default nginx config
RUN rm -f /etc/nginx/http.d/default.conf

# add custom nginx config
ADD deployment/docker/nginx/default.conf /etc/nginx/http.d/default.conf

# add supervisor config
COPY deployment/docker/supervisor/supervisord.conf /etc/supervisor/supervisord.conf

# add supervisor nginx job
COPY deployment/docker/supervisor/supervisor.nginx.conf /etc/supervisor/conf.d/supervisor.nginx.conf

# create node_modules directory and add rights
RUN mkdir -p /home/www/node/node_modules && chown -R node:node /home/www/node

# create supervisor log directory and add rights
RUN mkdir -p /var/log/supervisor && chown -R node:node /var/log/supervisor

# set work directory
WORKDIR /home/www/node

# copy dependency files
COPY package*.json ./

# install dependencies
RUN npm ci --no-fund

# copy source code
COPY --chown=node:node . ./

# create env file to use for building
RUN touch .env \
    && echo "VITE_HTML_TILE=$VITE_HTML_TITLE" >> .env \
    && echo "VITE_HTML_DESCRIPTION=$VITE_HTML_DESCRIPTION" >> .env \
    && echo "VITE_IMPRINT_ADDRESS=$VITE_IMPRINT_ADDRESS" >> .env \
    && echo "VITE_IMPRINT_CONTACT=$VITE_IMPRINT_CONTACT" >> .env \
    && echo "VITE_APP_DOWNLOAD_URL=$VITE_APP_DOWNLOAD_URL" >> .env \
    && echo "VITE_API_ENDPOINT=$VITE_API_ENDPOINT" >> .env \
    && echo "VITE_API_TIMEOUT=$VITE_API_TIMEOUT" >> .env \
    && echo "VITE_WS_ENDPOINT=$VITE_WS_ENDPOINT" >> .env \
    && echo "VITE_WS_RECONNECT_TIMEOUT=$VITE_WS_RECONNECT_TIMEOUT" >> .env


# build app
RUN npm run build

# set supervisor entrypoint
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
