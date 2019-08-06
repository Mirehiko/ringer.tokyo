#!/bin/bash

until python manage.py inspectdb >/dev/null 2>&1
do
  echo ">> waiting for database..."
  sleep 5
done

echo ">> database is up."


apt update -y
apt install nano -y


python manage.py migrate --noinput
python manage.py collectstatic --noinput



# для запуска проекта через uwsgi, а не gunicorn
# exec uwsgi --ini /finances/uwsgi_conf/finances.ini
exec uwsgi --emperor /uwsgi_conf/
