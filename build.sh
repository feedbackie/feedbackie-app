#!/bin/bash

docker build ./\
  -f ./docker/1.0.1/fpm/Dockerfile \
  --progress=plain \
  --build-arg USER_ID=$(id -u) \
  --build-arg GROUP_ID=$(id -g) \
  -t seriyyy95/feedbackie-app:1.0.1-fpm

docker build ./\
  -f ./docker/1.0.1/apache/Dockerfile \
  --progress=plain \
 --build-arg USER_ID=$(id -u) \
  --build-arg GROUP_ID=$(id -g) \
  -t seriyyy95/feedbackie-app:1.0.1

docker build ./\
  -f ./docker/1.0.1/apache/Dockerfile \
  --progress=plain \
  --build-arg USER_ID=$(id -u) \
  --build-arg GROUP_ID=$(id -g) \
  -t seriyyy95/feedbackie-app:latest
