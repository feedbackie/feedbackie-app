docker build ./\
  -f ./docker/fpm/Dockerfile \
  --progress=plain \
  --build-arg USER_ID=$(id -u) \
  --build-arg GROUP_ID=$(id -g) \
  -t seriyyy95/feedbackie-app:fpm-latest

docker build ./\
  -f ./docker/apache/Dockerfile \
  --progress=plain \
  --build-arg USER_ID=$(id -u) \
  --build-arg GROUP_ID=$(id -g) \
  -t seriyyy95/feedbackie-app:latest
