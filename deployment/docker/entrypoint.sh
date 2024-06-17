#!/bin/bash
/usr/local/bin/npx import-meta-env -x /home/www/node/.env -p /home/www/node/build/index.html
/usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
