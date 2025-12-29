#!/bin/bash

# Create Laravel storage directories if they don't exist
mkdir -p /data/storage/app/public
mkdir -p /data/storage/framework/cache/data
mkdir -p /data/storage/framework/sessions
mkdir -p /data/storage/framework/views
mkdir -p /data/storage/logs

# Set proper permissions
chmod -R 775 /data/storage
chown -R www-data:www-data /data/storage

# Make static resources available for other containers
mkdir -p /data/public
cp -rT /var/www/public/ /data/public/

php artisan migrate --force

php artisan app:deploy

php artisan optimize:clear
php artisan filament:clear

exec "$@"
