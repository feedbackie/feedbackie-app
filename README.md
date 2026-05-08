Feedbackie is a service for collecting feedback and bug reports on articles, developed using Laravel and the FilamentPHP admin panel. It can be useful for bloggers, documentation sites, and website owners who want to improve their content. You can deploy the application on your own server.

Essentially, the tool has two functions:

- **Collecting bug reports**: Gather mistakes and typos corrections from your website visitors
- **Collecting feedback on content usefulness**: Gather feedback how useful your site materials are for your visitors.

No matter how many times we try to proofread written articles, they still contain grammatical errors, inaccuracies, missing punctuation marks, and so on. It would be great if users who read an article and notice an error could suggest a correction. Feedbackie allows users to highlight text on a page, correct the error in it, and then send the correction to the administrator.

Additionally, the tech industry are constantly evolving and changing so information in articles becomes outdated. Using the feedback tool, you can allow your visitors to tell you which articles need to be rewritten or updated.

Note that the project is currently in Alpha. All features work, but some bugs still be found.

## Links

- Website: [feedbackie.app](https://feedbackie.app)
- DockerHub: [https://hub.docker.com/r/seriyyy95/feedbackie-app](https://hub.docker.com/r/seriyyy95/feedbackie-app)

## Running Using Docker

The application is supposed to be deployed on your own server using Docker. You can use the following command to try it out locally:

```
docker run -it --rm -p 80:80 seriyyy95/feedbackie-app:latest
```

In this case, the application will be available at http://localhost/admin, but all data will be lost after stopping the container. To check widgets, use the following pages:

- http://localhost/report-widget - example page with mistake report widget
- http://localhost/feedback-widget - example page with feedback collection widget

If you want to persist data, you need to mount volume to /data directory in the container. The directory should be created before the first run:

```
mkdir feedbackie
cd feedbackie
mkdir data
docker run -it --rm -v ./data:/data -p 80:80 seriyyy95/feedbackie-app:latest
```

By default, an SQLite database is used. The application will automatically create a user with the login "admin" and password "password" and you'll be able to log in at localhost.

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
        image: seriyyy95/feedbackie-app:latest
        ports:
            - "80:80"
        volumes:
            - app-data:/data
        environment:
            - ADMIN_PASSWORD=${ADMIN_PASSWORD:-password}
            - DB_HOST=postgresql
            - DB_PORT=5432
            - DB_PASSWORD=${DB_PASSWORD:-password}
            - DB_DATABASE=feedbackie_db
            - DB_USERNAME=${DB_USERNAME:-feedbackie-user}
            - DB_CONNECTION=pgsql
        depends_on:
            - postgresql
        networks:
            - default
    postgresql:
        restart: unless-stopped
        image: postgres:latest
        environment:
            - POSTGRES_DB=feedbackie-db
            - POSTGRES_USER=${DB_USERNAME:-feedbackie-user}
            - POSTGRES_PASSWORD=${DB_PASSWORD:-password}
        volumes:
            - db-data:/var/lib/postgresql/
        networks:
            - default
networks:
  default:
```

## Development

To start developing the application, you can use the provided `docker-compose.yml` file. It mounts the source code into the container, allowing you to make changes and see them reflected immediately.

First, clone the repository with submodules:

```bash
git clone --recurse-submodules https://github.com/feedbackie/feedbackie-app.git
```

Create .env file based on .env.example and adjust environment variables as needed:

```bash
cp .env.example .env
```

Then can start the development environment with the following command:

```
docker-compose -f docker-compose.yml up
```

Most functionality available in separated package named feedbackie/core. You can find it in the `packages/feedbackie/core` directory.

## Environment Variables

Here are the environment variables you can use to configure the container:

- ADMIN_PASSWORD - administrator password, default is password
- ADMIN_EMAIL - administrator email, default is admin@feedbackie.app
- ADMIN_PATH - prefix for admin panel, by default is "admin"
- APP_DEBUG - enable debug mode and show all errors, default is false
- APP_URL - URL where the application will be accessible, default is localhost
- DB_HOST - database host
- DB_PORT - database port
- DB_DATABASE - database name
- DB_PASSWORD - database password
- DB_USERNAME - database username
- DB_CONNECTION - database type, available options are sqlite, pgsql, default is sqlite

## Widget Options

To configure the widgets, you need to define JavaScript object named `feedbackie_settings` globally with the following properties:

General:

- `base_url` - URL of the application, default is empty, need to be set for widgets to work.
- `display_powered_by` - show "powered by feedbackie" text in the widgets, default is false
 
Report widget:

- `report_enabled` - enable mistake report widget, default is false
- `report_display_message` - show a message that user can report mistakes, default is true
- `report_display_button` - show button to open a mistake report form, when user selects text; default is true
- `report_message_insert_type` - method of inserting a message which tells how to send mistakes reports
- `report_message_anchor_selector` - selector of an element to which the message will be inserted

Feedback widget:

- `feedback_enabled` - enable feedback collection widget, default is false
- `feedback_sticky_ratio` - make feedback widget sticky after scrolling down the page, default is 0, which means that the widget will not be sticky
- `feedback_sticky_percent` - make feedback widget sticky after scrolling down the page by a certain percentage, default is 50
- `feedback_widget_insert_type` - method of inserting feedback widget which tells how to send mistakes reports
- `feedback_widget_anchor_selector` - selector of element to which the feedback widget will be inserted
- `feedback_widget_thtme` - theme of the feedback widget, available options are "light", "dark", and "adaptive" default is "adaptive"
