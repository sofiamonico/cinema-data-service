# Cinema Data Service

Este servicio proporciona una API para gestionar datos relacionados con películas, usuarios y roles en un sistema de cine.

## Requisitos previos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (opcional, para desarrollo local)

## Levantar el proyecto con Docker

### 1. Clona este repositorio:
   ```bash
   git clone git@github.com:sofiamonico/cinema-data-service.git
   cd cinema-data-service
   ```

### 2. Crea un archivo `.env` basado en el ejemplo proporcionado:
   ```bash
   cp .env.example .env
   ```

### 3. Modifica las variables en el archivo `.env` según tus necesidades:
   ```
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=tu_clave_secreta_aqui
   ```

### 4. Levanta el proyecto con Docker:

  ```bash
    docker-compose up --build
  ```

Este comando iniciará:
- El servicio de API en el puerto especificado en `.env` (por defecto 3000)
- Una base de datos PostgreSQL en el puerto 5432

### 5. Correr migraciones

> **IMPORTANTE**: Las migraciones deben ser ejecutadas antes de ejecutar cualquier comando CLI que dependa de la estructura de la base de datos.


### Ejecutar migraciones

```bash
docker-compose exec api npm run migration:run
```


### 6. Ejecutar comandos CLI


#### Crear un usuario super admin
```bash
$ docker exec cinema-data-service_api_1 npm run command -- create:user-super-admin --email="admin@example.com" --password="SecurePass123"
```

#### Sincronizar películas con la API de Star Wars
```bash
$ docker exec cinema-data-service_api_1 npm run command -- sync:get-films-from-swapi
```
## Ejecucion de los tests

#### Ejecutar todos los tests

```bash
$ docker exec cinema-data-service_api_1 npm run test
```

#### Ejecutar tests unitarios

```bash
$ docker exec cinema-data-service_api_1 npm run test src/....
```

#### Ejecutar tests de integración
```bash
$ docker exec cinema-data-service_api_1 npm run test:integration
```

## Endpoints de la API

La documentación de la API está disponible en:

```
http://localhost:3000/docs
```

## Puertos utilizados

- **API**: Puerto especificado en `.env` (por defecto 3000)
- **PostgreSQL**: 5432
