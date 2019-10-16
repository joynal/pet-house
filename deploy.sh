#!/bin/bash
docker build -t joynalabedin/pet-house .
docker push joynalabedin/pet-house

ssh remote_server << EOF
docker pull joynalabedin/pet-house
docker stop api-pet-house || true
docker rm api-pet-house || true
docker rmi joynalabedin/pet-house:current || true
docker tag joynalabedin/pet-house:latest joynalabedin/pet-house:current
docker run -d --restart always --name api-pet-house -p 4000:4000 joynalabedin/pet-house:current
EOF
