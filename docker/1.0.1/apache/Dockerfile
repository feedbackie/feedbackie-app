FROM php:8.3-apache-bookworm

ARG USER_ID=1000
ARG GROUP_ID=1000

ENV LD_LIBRARY_PATH=/usr/lib/
ENV LARAVEL_STORAGE_PATH=/data/storage
ENV APACHE_LOG_DIR=/data/apache/logs

RUN apt update && apt install -y $PHPIZE_DEPS libonig-dev libpq-dev libzip-dev libsqlite3-dev libicu-dev bash vim postgresql-client-15 libwebp-dev libfreetype-dev libjpeg-dev libfcgi-bin ca-certificates unzip 7zip

RUN docker-php-ext-install mbstring pdo pdo_pgsql mysqli zip gd intl pcntl exif

RUN docker-php-ext-enable opcache

RUN pecl install apcu \
    && docker-php-ext-enable apcu --ini-name 10-docker-php-ext-apcu.ini

RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.interned_strings_buffer=32'; \
        echo 'opcache.max_accelerated_files=10000'; \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.save_comments=1'; \
        echo 'opcache.revalidate_freq=60'; \
        echo 'opcache.jit=1255'; \
        echo 'opcache.jit_buffer_size=8M'; \
    } > "/usr/local/etc/php/conf.d/opcache.ini";

RUN { \
        echo 'apc.enabled=1'; \
        echo 'apc.shm_size=64M '; \
        echo 'apc.ttl=7200'; \
        echo 'apc.gc_ttl=3600'; \
        echo 'apc.max_file_size=1M '; \
    } > "/usr/local/etc/php/conf.d/apcu.ini";

COPY ./docker/apache/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod ugo+x /usr/local/bin/entrypoint.sh

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN usermod -u ${USER_ID} www-data
RUN groupmod -g ${GROUP_ID} www-data

RUN mkdir /data
RUN chown www-data /data
RUN mkdir /data/storage
RUN chown www-data /data/storage

RUN a2enmod rewrite
RUN a2enmod headers

COPY ./docker/apache/default.conf /etc/apache2/sites-enabled/000-default.conf

ADD https://github.com/feedbackie/feedbackie-app/archive/refs/tags/1.0.1-alpha.tar.gz /tmp/feedbackie.tar.gz
RUN tar -xzf /tmp/feedbackie.tar.gz -C /var/www/ --strip-components=1

RUN mkdir /var/www/packages/feedbackie/core
ADD https://github.com/feedbackie/core/archive/refs/tags/1.0.1.tar.gz /tmp/feedbackie-core.tar.gz
RUN tar -xzf /tmp/feedbackie-core.tar.gz -C /var/www/packages/feedbackie/core --strip-components=1

RUN cp -rT /var/www/storage /data/storage
RUN chown -R www-data:www-data /var/www/
RUN chown -R www-data:www-data /data/storage
RUN ls -l /data/storage

VOLUME /data
WORKDIR /var/www/
USER www-data

RUN mkdir -p /data/storage
RUN mkdir -p /data/database

ENV COMPOSER_CACHE_DIR=/var/www/.cache/composer
ENV COMPOSER_HOME=/var/www/.config/composer

RUN --mount=type=cache,target=/var/www/.cache/composer,id=composer-cache,sharing=locked,uid=1000,gid=1000 \
    composer install --no-interaction --optimize-autoloader --no-dev

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
CMD [ "apache2-foreground" ]
