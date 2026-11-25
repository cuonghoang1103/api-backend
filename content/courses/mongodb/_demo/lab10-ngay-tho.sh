#!/usr/bin/env bash
# Lab 10.7 — cách NGÂY THƠ (đừng làm thế này với hệ thống thật): đè bản sao lưu 02:00 lên lab10 bằng --drop.
docker cp -q /tmp/mgo-lab10/goc mgo-lab:/tmp/lab10-goc
docker exec mgo-lab mongorestore --drop --nsInclude 'lab10.*' /tmp/lab10-goc 2>&1 | tail -1
docker exec mgo-lab rm -rf /tmp/lab10-goc
