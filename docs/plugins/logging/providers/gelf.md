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

> [!NOTE]
> The username and password are both `admin`. This should only be used for local testing. If putting this into production be sure to update the password.

```docker
services:
  mongodb:
    image: mongo:4.4
    container_name: graylog-mongodb
    restart: always
    volumes:
      - /docker/graylog/data/mongodb:/data/db
    networks:
      - graylog-network

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.9
    container_name: graylog-elasticsearch
    restart: always
    environment:
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms1g -Xmx1g
      - xpack.security.enabled=false
      - xpack.monitoring.enabled=false
      - xpack.ml.enabled=false
      - network.host=0.0.0.0
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - /docker/graylog/data/elasticsearch:/usr/share/elasticsearch/data
    networks:
      - graylog-network

  graylog:
    image: graylog/graylog:4.3
    container_name: graylog
    restart: always
    depends_on:
      - mongodb
      - elasticsearch
    environment:
      - GRAYLOG_PASSWORD_SECRET=somepasswordpepper
      # Password: "admin"
      - GRAYLOG_ROOT_PASSWORD_SHA2=8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
      - GRAYLOG_HTTP_EXTERNAL_URI=http://127.0.0.1:9000/
      - GRAYLOG_ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - GRAYLOG_MONGODB_URI=mongodb://mongodb:27017/graylog
    ports:
      # Graylog web interface and REST API
      - "9000:9000/tcp"
      # Beats
      - "5044:5044/tcp"
      # Syslog TCP
      - "5140:5140/tcp"
      # Syslog UDP
      - "5140:5140/udp"
      # GELF TCP
      - "12201:12201/tcp"
      # GELF UDP
      - "12201:12201/udp"
      # Forwarder data
      - "13301:13301/tcp"
      # Forwarder config
      - "13302:13302/tcp"
    volumes:
      - /docker/graylog/data/graylog:/usr/share/graylog/data/journal
    networks:
      - graylog-network

networks:
  graylog-network:
    driver: bridge
```
