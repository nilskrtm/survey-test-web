#!/bin/bash
# converts input .env file to docker build-args string
awk '{ sub ("\\\\$", " "); printf " --build-arg %s", $0  } END { print ""  }' $@
