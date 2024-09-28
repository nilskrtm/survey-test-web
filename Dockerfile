FROM node:20-alpine

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

# build app
RUN npm run build

# expose nginx port
EXPOSE 80

# copy entrypoint
COPY deployment/docker/entrypoint.sh ./

# inject environment vars and set supervisor as entrypoint
ENTRYPOINT ["sh", "./entrypoint.sh"]
