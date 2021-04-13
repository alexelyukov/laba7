#!/bin/sh
set -e

if [ "${DEBUG}" = TRUE ] || [ "${DEBUG}" = true ]; then
  set -x
fi

if [ -n "${REGISTAR_HOST}" ] && [ -n "${REGISTAR_PORT}" ]; then
  mode=node
  echo -n "Waiting for ${REGISTAR_HOST}:${REGISTAR_PORT} connection... "
  while ! nc -w 1 -z ${REGISTAR_HOST} ${REGISTAR_PORT} &> /dev/null; do echo -n .; sleep 1; done
  echo "done"
else
  mode=registar
fi

case $mode in
  'node' )
    exec npm run node-start
    ;;
  'registar' )
    exec npm run registar-start
    ;;
  * )
    echo "Invalid command $1"
    exit 1
esac
