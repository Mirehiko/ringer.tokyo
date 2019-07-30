#!/bin/bash

BACKUP_DIR="./volumes/mysql/restore_from" #from current dir
# BACKUP_DIR="/media"
DATETIME=`date +%F_%H-%M-%S`
DBNAME="ringerdb"
DB_USER="root"
DB_PASSWORD="sorellina"

# /usr/local/bin/docker-compose exec -T finance_db_1 mysqldump -u${DB_USER} -p${DB_PASSWORD} --ignore-table=${DBNAME}.django_session ${DBNAME} > "${BACKUP_DIR}"/${DBNAME}_${DATETIME}.sql && \
# /usr/local/bin/docker-compose exec -T finance_db_1 mysqldump -u${DB_USER} -p${DB_PASSWORD} --no-data ${DBNAME} django_session >> "${BACKUP_DIR}"/${DBNAME}_${DATETIME}.sql

docker exec finance_db_1 /usr/bin/mysqldump -u${DB_USER} -p${DB_PASSWORD} ${DBNAME} django_session > "${BACKUP_DIR}"/${DBNAME}_${DATETIME}.sql
gzip "${BACKUP_DIR}"/${DBNAME}_${DATETIME}.sql
find "${BACKUP_DIR}" -maxdepth 1 -mindepth 1 -type f -mtime +60 -exec rm {} \;
# docker exec finance_db_1 /usr/bin/mysqldump -u root --password=sorellina --all-databases > volumes/mysql/restore_from/backup.sql


# Restore
#cat backup.sql | docker exec -i CONTAINER /usr/bin/mysql -u root --password=root DATABASE
