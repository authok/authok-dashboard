FROM node:16-alpine3.11 AS dependencies

WORKDIR /opt

COPY package.json .

RUN yarn install



FROM node:16-alpine3.11 AS builder

WORKDIR /opt

COPY --from=dependencies /opt/package.json .
COPY --from=dependencies /opt/node_modules ./node_modules

COPY . .

ARG MAX_OLD_SPACE_SIZE=8000
ENV NODE_OPTIONS=--max_old_space_size=$MAX_OLD_SPACE_SIZE
RUN yarn build

RUN ls -lh .


FROM nginx:latest as production

# history模式下支持页面刷新
RUN sed -i '/index.html index.htm;/a\        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

COPY --from=builder /opt/dist /usr/share/nginx/html