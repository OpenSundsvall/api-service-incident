# Incident

![bild](https://user-images.githubusercontent.com/75727533/145235092-3f1bd3b8-2943-4796-8d4d-c2cab9686066.png)


## Config

### Production-config

- **API Gateway:**                  api-i.sundsvall.se
  - **Endpoint:**                   Production
- **Server:**                       microservices.sundsvall.se
- **DB:**                           Maria DB
- **Version av integrationer:**     Produktion

### Test-config

- **API Gateway:**                  api-i-test.sundsvall.se
  - **Endpoint:**                   Production
- **Server:**                       microservices-test.sundsvall.se
- **DB:**                           Maria DB
- **Version av integrationer:**     Test

### Sandbox-config

- **API Gateway:**                  api-i-test.sundsvall.se
  - **Endpoint:**                   Sandbox
- **Server:**                       microservices-test.sundsvall.se
- **DB:**                           Hårdkodade svar
- **Version av integrationer:**     Mockade

## Integrationer

Denna applikation har integrationer mot:

* ISYCase
* Citizen (Sundsvalls kommun)

## Miljövariabler

Dessa miljövariabler måste sättas för att det ska gå att köra applikationen.

DB_HOST<br>
DB_USER<br>
DB_PASSWORD<br>
DB_DATABASE<br>
EMAIL_TO<br>
APP_URI<br>
ENDPOINT_URI<br>
ISYCASE_API_KEY<br>
ISYCASE_URL<br>
PRODUCTION<br>
SANDBOX<br>
DB_SANDBOX

## Kör applikationen lokalt

För att köra applikationen lokalt krävs en .env-fil med miljövariabler, PRODUCTION behöver vara "false". Applikationen startas med `node app.js` eller Nodemon.

## 
Copyright (c) 2021 Sundsvalls kommun
