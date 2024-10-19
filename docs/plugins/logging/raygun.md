---
uid: Plugins.Logging.Raygun
---

# Prism Logging with Raygun

Raygun is a platform that offers analytics about managed and unmanaged exceptions within your app as well as user tracking.

```cs
containerRegistry.UsePrismLogging(logging => {
    logging.AddRaygun("RaygunApiKey");
});
```

## Local Development &amp; Debugging

Raygun offers a free Open Source version for Crash Detection that can be run in a local environment. For more information see the [Raygun Documentation](https://raygun.com/documentation/product-guides/crash-reporting/local-docker-setup/).

To get started you can copy the following docker compose sample. You can set the localpath for the volumes to persist the crash data over time and ensure that the downloaded Ollama models are persisted and do not need to be downloaded again.

```docker
services:
  raygun-aspire-portal:
    image: raygunowner/raygun-aspire-portal:latest
    container_name: raygun_local_dev
    environment:
      - ConnectionStrings__Ollama=http://ollama-service:11434
    ports:
      - "8080:8080"
    restart: always
    volumes:
      - /docker/raygun/data/errors:/app/raygun/errors
    depends_on:
      - ollama-service  # Ensure Ollama service starts before this container

  ollama-service:
    image: ollama/ollama:latest
    container_name: ollama_local_aier
    restart: always
    volumes:
      - /docker/raygun/data/ollama:/root/.ollama  # Mount local directory to container for data persistence
```

To use Raygun for local development with your Docker image, you can use the special extension as shown below:

```cs
container.UsePrismLogging(logging =>
    logging.AddLocalRaygun("http://192.168.1.11:8080/Ingestion/Entries"));
```

## Prism.Essentials Integration

The Raygun Implementation of the Logger makes reference to the [Prism.Plugin.Essentials](xref:Plugins.Essentials.GettingStarted) library. This allows us to dynamically check if various Essentials interfaces have been registered. If they have we automatically tailor the Logger to include offline support with request caching. Additionally we will automatically update the configuration to make use of the [Application Context](xref:Plugins.Essentials.AppContext) from Essentials. In order to enable sending logs in the background with the offline store, be sure to Register Prism.Plugin.Essentials first.
