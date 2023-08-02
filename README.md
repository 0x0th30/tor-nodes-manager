# TOR Nodes Manager
This project represents a rewritten version of [this project](https://github.com/0x0th30/tor-nodes-RestAPI), which was requested in 2021 when I interviewed for my current job. The main goal working in it is improve and show my developed skills in coding and design of scalable/maintainable applications.

## System Design
![image](/docs/system-design.png)

## Building application
The application was write under Docker infrastructure so you can run `docker compose -f docker/docker-compose.yml build` inside root directory.

## Running application
To startup application and dependent services use `docker compose -f docker/docker-compose.yml up -d` inside root directory.

## Monitoring application
To get application logs run `docker compose -f docker/docker-compose.yml logs -f` inside root directory.

## Requesting endpoints
To get a complete request collection to use in this API, import the [collection file](/docs/postman-collection.json) in your Postman/Insomnia HTTP clients.
