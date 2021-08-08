#!/bin/bash
cp cacheUpdater.sh ~/cacheUpdater.sh
chmod 755 ~/cacheUpdater.sh
crontab -l | { cat; echo "0 */1 * * *  ~/cacheUpdater.sh"; } | crontab -
docker-compose up --build