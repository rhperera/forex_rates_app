#!/bin/bash
mkdir ~/logs
touch ~/logs/app.log
cp cacheUpdater.sh ~/cacheUpdater.sh
chmod 755 cacheUpdater.sh
crontab -l | { cat; echo "0 */1 * * *  ~/cacheUpdater.sh"; } | crontab -
docker build . -t node/forex
docker run -p 8080:8080 node/forex