#!/usr/bin/env bash

ABSOLUTE_PROJECT_PATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )/.."

docker run -d \
    -v ${ABSOLUTE_PROJECT_PATH}:/projects \
    \
    -e AWS_ACCESS_KEY_ID=root \
    -e AWS_SECRET_ACCESS_KEY=root \
    -e REGION=eu-west-1 \
    -e DB_ENDPOINT=http://dynamodb:8000 \
    \
    -w /projects \
    -p 728:3000 \
    --network="verisure" \
    --name="transmitter-altitude-smtp-service" \
    node:18-alpine npm run dev