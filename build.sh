docker build -t ourcodestyle_ui .
docker tag ourcodestyle_ui fuksito/ourcodestyle_ui:latest
docker push fuksito/ourcodestyle_ui:latest
