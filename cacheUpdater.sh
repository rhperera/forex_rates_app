#!/bin/bash
printf 'Sending cache command' >> ~/logs/app.log
curl -S http://localhost:8080/api/v1/updateCache