#!/bin/bash
# Atlas KB — Permission Corrector for SQLite
# Ensures the persistent volume is writable by Apache/PHP

echo "Setting permissions for /var/www/html/data..."
chown -R www-data:www-data /var/www/html/data
chmod -R 775 /var/www/html/data

# Start Apache in the foreground
echo "Starting Apache..."
apache2-foreground
