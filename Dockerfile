#stage 1
FROM node:13.5.0-alpine3.10 as builder
COPY package.json package-lock.json ./
RUN npm config set strict-ssl false
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN npm run-script build

#stage 2
FROM bitnami/nginx:latest
COPY --from=builder /ng-app/dist /app
CMD ["nginx", "-g", "daemon off;"]
