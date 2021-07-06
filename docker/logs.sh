#!/usr/bin/env bash

docker logs -f $(docker ps | grep transmitter-altitude-smtp-service | awk '{print $1}')