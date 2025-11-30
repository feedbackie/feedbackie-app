Feedbackie is a service for collecting feedback and bug reports on articles, developed using Laravel and the FilamentPHP admin panel. It can be useful for bloggers and website owners who want to improve their content. You can use our cloud solution or self-host open source version.

Essentially, the tool has two functions:

- **Collecting bug reports**: Easily gather error corrections from your website visitors
- **Collecting feedback on content usefulness**: Track how useful your site users find the materials.

No matter how many times we try to proofread written articles, they still contain grammatical errors, inaccuracies, missing punctuation marks, and the like. It would be great if users who read an article and notice an error could suggest a correction. Feedbackie allows you to highlight text on a page, correct the error in it, and then send the correction to the administrator.

Additionally, the our world and knowledge are constantly evolving and changing so information in articles becomes outdated. Using the feedback tool, you can find out which articles need to be rewritten or updated.

## Running Using Docker

You can use our Cloud solution, and then you'll only need to follow the steps described above. Or you can deploy a self-hosted open-source version on your own server. To see how everything works, you can deploy the application using docker:

```
mkdir feedbackie
cd feedbackie
mkdir data
docker run -it --rm -v ./data:/data -p 80:80 seriyyy95/feedbackie-oss:latest
```

Note that the application stores its data in the data directory, which must be created and mounted in the container before the first run. By default, an SQLite database is used. The application will automatically create a user with the login "admin" and password "password" and you'll be able to log in at localhost.

## Running in Docker Compose

For a full deployment of the application, it's better to use Docker Compose and a PostgreSQL database. Here's an example configuration:

```yaml
volumes:
    app-data:
    db-data:
services:
    app:
        restart: unless-stopped
        init: true
        image: seriyyy95/feedbackie-oss:latest
        ports:
            - "80:80"
        volumes:
            - app-data:/data
        environment:
            - ADMIN_PASSWORD=${ADMIN_PASSWORD:-password}
            - DB_HOST=postgresql
            - DB_PORT=5432
            - DB_PASSWORD=${DB_PASSWORD:-password}
            - DB_USERNAME=${DB_USERNAME:-feedbackie-user}
            - DB_CONNECTION=pgsql
        depends_on:
            - postgresql
    postgresql:
        restart: unless-stopped
        image: postgres:latest
        environment:
            - POSTGRES_DB=feedbackie-db
            - POSTGRES_USER=${DB_USERNAME:-feedbackie-user}
            - POSTGRES_PASSWORD=${DB_PASSWORD:-password}
        volumes:
            - db-data:/var/lib/postgresql/
```

## Environment Variables

Here are the environment variables you can use to configure the container:

- ADMIN_PASSWORD - administrator password, default is password
- ADMIN_EMAIL - administrator email, default is admin@feedbackie.app
- APP_DEBUG - enable debug mode and show all errors, default is false
- APP_URL - URL where the application will be accessible, default is localhost
- APP_KEY - encryption key for the application, optional, generated automatically
- DB_HOST - database host
- DB_PORT - database port
- DB_DATABASE - database name
- DB_PASSWORD - database password
- DB_USERNAME - database username
- DB_CONNECTION - database type, available options are sqlite, pgsql, mysql, default is sqlite
