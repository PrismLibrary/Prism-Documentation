---
uid: Plugins.Logging.Gelf
---

# Logging with Graylog (GELF)

Graylog is a great option for Developers. We find that there are generally 2 categories of developers that really love using Graylog:

- Developers who want to have logging that is disconnected from Visual Studio but something that can remain local on their developer machine. This can work fantastic in scenarios where you may be doing a demo from a pre-deploy dev build to a device without an active Debug session in Visual Studio. In these situations we have all had great demos where something goes wrong and we wish we could see what happened. Using the GELF logger this problem can be solved by ensuring that even while you're doing your demo the logs can continue to stream to your machine for you to review later.
- Some Enterprises in particular have very strict Data policies. As such owning the full End-to-End solution can be of great importance. For these customers Graylog can provide a fantastic option as you can control your options by deploying your own Graylog server into production.

## Setup



## Local Debugging

Below is a sample docker file. You can use this to create a local Graylog stack using the [Graylog Docker image](https://hub.docker.com/r/graylog/graylog/). This can be useful for testing application logs locally. Requires [Docker](https://www.docker.com/get-docker) and Docker Compose.

- `docker-compose up`
- Navigate to [http://localhost:9000](http://localhost:9000)
- Credentials: admin/admin
- Create a UDP input on port 12201 and set `GelfLoggerOptions.Host` to `localhost`.

```docker
services:
  mongo:
    image: mongo:4.2
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.0
    environment:
      - http.host=0.0.0.0
      - transport.host=localhost
      - network.host=0.0.0.0
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
  graylog:
    image: graylog/graylog:4.0
    environment:
      - GRAYLOG_PASSWORD_SECRET="!ux*lAfQVjaRT8iI"
      - GRAYLOG_ROOT_PASSWORD_SHA2=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
      - GRAYLOG_HTTP_EXTERNAL_URI=http://localhost:9000/
    entrypoint: /usr/bin/tini -- wait-for-it elasticsearch:9200 --  /docker-entrypoint.sh
    restart: always
    depends_on:
      - mongo
      - elasticsearch
    ports:
      - 9000:9000
      - 1514:1514
      - 1514:1514/udp
      - 12201:12201
      - 12201:12201/udp
      - 12202:12202
```
