#!/usr/bin/env bash

ABSOLUTE_PROJECT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )/../.."

docker run -ti \
    -v ${ABSOLUTE_PROJECT_PATH}:/projects \
    -w /projects \
    node:12-alpine npm uninstall $@