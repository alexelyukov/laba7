# Лабораторная работа № 7

## Примеры API
http://localhost:3000/get-test?a=10&b=13

http://localhost:3000/set-common?common=24

http://localhost:3001/get-test?a=10&b=13

## Команды NPM

Запускаются с помощью npm:

```console
npm run docker-build
```

- `docker-build` - собрать Docker-образ приложения
- `docker-push` - загрузить Docker-образ в докерхаб
- `node-start` - запустить ноду
- `registar-start` - запустить регистратор
- `stack-deploy` - деплой приложение в Docker Swarm

## Переменные окружения

- `DOCKER_REPO` - репозиторий hub.docker.com
- `NODE_VERSION` - версия контейнера
- `DOMAIN_NAME` - имя домена
- `DEBUG` - режим отладки скрипта запуска
- `PORT` - порт ноды
- `REGISTAR_HOST` - адрес регистратора
- `REGISTAR_PORT` - порт регистратора

## Деплой

Деплой в кластер Docker Swarm требует развернутого там стека реверс-прокси traefik.
Для запуска выполните команду:

```console
npm run stack-deploy
```
