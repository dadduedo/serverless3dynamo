#!/usr/bin/env bash

docker stop $(docker ps | grep transmitter-altitude-smtp-service | awk '{print $1}')
docker rm -f transmitter-altitude-smtp-service