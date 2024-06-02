#!/bin/bash
npx import-meta-env -x .env -p build/index.html
/usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
