# Incident

https://sundsvall.atlassian.net/wiki/spaces/SK/pages/22315023/Incident

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

DB_HOST
DB_USER
DB_PASSWORD
DB_DATABASE
EMAIL_TO
APP_URI
ENDPOINT_URI
ISYCASE_API_KEY
ISYCASE_URL
PRODUCTION
SANDBOX
DB_SANDBOX

## Kör applikationen lokalt

För att köra applikationen lokalt krävs en .env-fil med miljövariabler, PRODUCTION behöver vara "false". Applikationen startas med `node app.js` eller Nodemon.
