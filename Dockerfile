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

# Create data directory and set correct permissions
# The data directory MUST be writable by the web server (www-data)
RUN mkdir -p /var/www/html/data \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 /var/www/html/data

# Apache config: allow .htaccess, enable in the correct dir
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
