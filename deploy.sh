#!/bin/bash

# the stupid heroku-deploy github action fails for 
echo $2 | docker login --username=$1 registry.heroku.com --password-stdin \
  && docker build --file ./Dockerfile --tag registry.heroku.com/inventario-server/web . \
  && HEROKU_API_KEY=$2 heroku container:push web --app inventario-server \
  && HEROKU_API_KEY=$2 heroku container:release web --app inventario-server 