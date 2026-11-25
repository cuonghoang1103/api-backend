#!/usr/bin/env bash
# mvn-ct.sh <thư mục dự án> <đối số mvn…> — chạy Maven trong container (Java 21), ~/.m2 dùng chung, giữ quyền người dùng
set -euo pipefail
P=$(realpath "$1"); shift
docker run --rm --name lgz-mvn --user "$(id -u):$(id -g)" -e MAVEN_CONFIG=/m2 -e HOME=/tmp -v "$HOME/.m2":/m2 -v "$P":/p -w /p \
  maven:3.9-eclipse-temurin-21 mvn -B -q -Dmaven.repo.local=/m2/repository "$@"
