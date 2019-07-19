#!/bin/bash

# until python manage.py inspectdb >/dev/null 2>&1
# do
#   echo ">> waiting for database..."
#   sleep 5
# done

# echo ">> database is up."

apt update -y
apt install nano -y
# pip install mysqlclient

# nano /usr/local/lib/python3.6/site-packages/multiupload/admin.py
# from django.urls import reverse




# apply database migrations
python manage.py migrate --noinput

# collect static files
python manage.py collectstatic --noinput
