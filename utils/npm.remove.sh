#!/usr/bin/env bash

ABSOLUTE_PROJECT_PATH=$(git rev-parse --show-toplevel)

docker run -ti \
    -v ${ABSOLUTE_PROJECT_PATH}:/projects/stats-generator \
    -w /projects/stats-generator \
    node:16 npm uninstall $@