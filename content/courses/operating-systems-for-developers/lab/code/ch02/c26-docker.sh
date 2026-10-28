# @ chạy TỪ MÁY CHỦ: bash ch02/phien-host.sh ch02/c26-docker.sh — hai container "lắm lời" 5 giây, --label oslab=1, xoá ở cuối
docker info --format '{{.LoggingDriver}}'
docker run -d --name os-c26-chatty --label oslab=1 os-lab bash -c 'i=0; while :; do echo "debug: polling queue, iteration $((i++)), nothing to do"; done' > /dev/null; sleep 5; docker stop -t 1 os-c26-chatty > /dev/null
docker logs os-c26-chatty 2>&1 | wc -lc
docker inspect -f '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}' os-c26-chatty
docker run -d --name os-c26-rot --label oslab=1 --log-opt max-size=1m --log-opt max-file=3 os-lab bash -c 'i=0; while :; do echo "debug: polling queue, iteration $((i++)), nothing to do"; done' > /dev/null; sleep 5; docker stop -t 1 os-c26-rot > /dev/null
docker logs os-c26-rot 2>&1 | wc -lc
docker inspect -f '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}' os-c26-rot
docker logs --since 2s os-c26-rot 2>&1 | head -2
@ docker rm -f os-c26-chatty os-c26-rot > /dev/null
