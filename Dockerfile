# Demo/trial image only — builds the frontend assets, installs PHP deps,
# and serves the app with Laravel's built-in server behind Render's port.
# Not a production recipe (see README for the real Hostinger deployment path).

FROM node:22-slim AS assets
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
# Includes dev deps on purpose: this demo image seeds sample data via
# UserFactory, which needs fakerphp/faker (a dev-only package normally
# absent from a real production install).
RUN composer install --no-scripts --no-interaction --prefer-dist --ignore-platform-reqs

FROM php:8.4-cli
RUN apt-get update && apt-get install -y --no-install-recommends \
        libsqlite3-dev libzip-dev unzip git \
    && docker-php-ext-install pdo pdo_sqlite zip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

RUN mkdir -p database storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && touch database/database.sqlite \
    && chmod -R 775 storage bootstrap/cache database

ENV APP_ENV=production \
    APP_DEBUG=false \
    APP_LOCALE=ar \
    APP_KEY=base64:va3UVuLvtGvGfxXyRcvCH1AlISVKV2TQE1FDUFbJkGI= \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/app/database/database.sqlite \
    LOG_CHANNEL=stderr \
    PORT=8080

EXPOSE 8080

CMD php artisan migrate --seed --force \
    && php artisan serve --host=0.0.0.0 --port=${PORT}
