FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install SQLite dependencies and PHP extensions
RUN apt-get update && apt-get install -y libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Enable Apache headers module
RUN a2enmod headers

# Copy all project files
COPY . /var/www/html/

# Ensure data directory exists
RUN mkdir -p /var/www/html/data

# Copy and set up the entrypoint script
# This script will fix permissions for the SQLite volume at runtime
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

# Apache config: allow .htaccess
RUN echo '<Directory /var/www/html>\n\
    AllowOverride All\n\
    Options -Indexes +FollowSymLinks\n\
    Require all granted\n\
</Directory>' > /etc/apache2/conf-available/atlas.conf \
    && a2enconf atlas

# PHP settings for production
RUN echo "display_errors = Off\n\
error_reporting = E_ALL & ~E_DEPRECATED\n\
upload_max_filesize = 32M\n\
post_max_size = 32M\n\
session.cookie_secure = 0\n\
session.cookie_httponly = 1\n\
session.cookie_samesite = Lax" \
    > /usr/local/etc/php/conf.d/atlas.ini

EXPOSE 80

# Use the script to start the container
ENTRYPOINT ["entrypoint.sh"]
