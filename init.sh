#!/bin/bash

cd "$( dirname "${BASH_SOURCE[0]}" )"

mkdir -p volumes/media volumes/static volumes/mysql/db volumes/mysql/restore_from


# Restore
#cat backup.sql | docker exec -i CONTAINER /usr/bin/mysql -u root --password=root DATABASE