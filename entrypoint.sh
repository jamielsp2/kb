#!/bin/bash
set -e

echo "[STARTUP] Checking directory permissions..."
# Ensure the data directory is writable by Apache
# We use /var/www/html/data because that is where the volume is mounted
mkdir -p /var/www/html/data
chown -R www-data:www-data /var/www/html/data
chmod -R 775 /var/www/html/data

echo "[STARTUP] Permissions set. Starting Apache..."
exec apache2-foreground
