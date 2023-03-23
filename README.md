# TOR Nodes Manager (Refactored!)
This project represents a rewritten version of [this project](https://github.com/0x0th30/tor-nodes-RestAPI), which was requested in 2021 when I interviewed for my current job. The main goal working in it is improve and show my developed skills in coding and design of scalable/maintainable applications.

![image](https://user-images.githubusercontent.com/61753537/227114101-02ca55c6-fe9d-4f10-91d2-f103e8bff7db.png)

## Building application
The application was write under Docker infrastructure so you can run `docker compose -f docker/docker-compose.yml build` inside root directory.

## Running application
To startup application and dependent services use `docker compose -f docker/docker-compose.yml up -d` inside root directory.

## Monitoring application
To get application logs run `docker compose -f docker/docker-compose.yml logs -f` inside root directory.

## Requesting endpoints
To get a complete request collection to use in this API, import the [collection file](/docs/postman-collection.json) in you Postman/Insomnia HTTP clients.
