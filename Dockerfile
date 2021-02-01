# Stage 1 - the build process
FROM node:15.5.0-buster as build-deps
WORKDIR /usr/src/app
COPY . .
# RUN npm install babel-node
RUN yarn install
RUN yarn dist

# Stage 2 - the production environment
FROM nginx:1.12-alpine
LABEL maintainer="fuksito@gmail.com"
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
