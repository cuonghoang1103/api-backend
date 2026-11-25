# 13.2 — Kubernetes (k3s v1.33.5 trong container lgz-k3s, một node "lab13"). Chạy: docker cp . lgz-k3s:/lab; BASH_ENV=cong-cu/k8s-env.bash python3 chay.py k8s.bash
kubectl version 2>/dev/null | head -1; kubectl get nodes
kubectl create namespace lab13 && kubectl -n lab13 create configmap ma-c13 --from-file=c13/app.js --from-file=c13/an-ram.js
kubectl apply -f k8s/orders.yaml && kubectl -n lab13 rollout status deploy/orders --timeout=60s
sleep 5; kubectl -n lab13 get pods -o wide | awk '{print $1, $2, $3, $4, $5}' | column -t
kubectl -n lab13 logs deploy/orders --tail 3
kubectl -n lab13 logs -l app=orders --prefix --tail 2
kubectl -n lab13 logs -l app=orders --timestamps --tail 1
kubectl -n lab13 logs -l app=orders --since 3s | wc -l
kubectl apply -f k8s/hong.yaml; sleep 75
kubectl -n lab13 get pods
kubectl -n lab13 logs orders-loi | head -2
kubectl -n lab13 logs orders-loi --previous | head -2
kubectl -n lab13 describe pod orders-loi | sed -n '/^Containers:/,/^Conditions:/p' | grep -E 'State|Reason|Exit Code|Started|Finished|Restart Count|Ready'
kubectl -n lab13 describe pod an-ram | grep -E -A4 'Last State'
kubectl -n lab13 logs an-ram --previous | tail -2
kubectl -n lab13 logs anh-sai
kubectl -n lab13 get events --field-selector involvedObject.name=anh-sai --sort-by=.lastTimestamp -o custom-columns=LAST:.lastTimestamp,TYPE:.type,REASON:.reason,COUNT:.count,MESSAGE:.message | cut -c1-170
kubectl -n lab13 get events --field-selector involvedObject.name=orders-loi --sort-by=.lastTimestamp -o custom-columns=LAST:.lastTimestamp,TYPE:.type,REASON:.reason,COUNT:.count,MESSAGE:.message | cut -c1-150
kubectl -n lab13 get events --field-selector type=Warning -o custom-columns=OBJECT:.involvedObject.name,REASON:.reason,COUNT:.count
kubectl -n lab13 describe pod xong-viec | grep -E -A3 '^    (State|Last State)'
kubectl -n lab13 logs xong-viec
kubectl -n lab13 get pod an-ram -o jsonpath='{.status.containerStatuses[0].lastState.terminated}' | jq -c '{reason, exitCode, startedAt, finishedAt}'
kubectl apply -f k8s/hai-container.yaml; sleep 25
kubectl -n lab13 logs web-sidecar | tail -2
kubectl -n lab13 logs web-sidecar -c goi-thu
kubectl -n lab13 logs web-sidecar --all-containers --prefix | grep -v 'notice' | tail -4
kubectl -n lab13 get pod song-do -o custom-columns=NAME:.metadata.name,RESTARTS:.status.containerStatuses[0].restartCount,LAST:.status.containerStatuses[0].lastState.terminated.reason,EXIT:.status.containerStatuses[0].lastState.terminated.exitCode
kubectl -n lab13 get events --field-selector involvedObject.name=song-do --sort-by=.lastTimestamp -o custom-columns=REASON:.reason,COUNT:.count,MESSAGE:.message | grep -E 'Unhealthy|Killing' | cut -c1-140
kubectl -n lab13 logs song-do --previous | grep healthz | tail -2
docker exec lgz-k3s sh -c 'ls /var/log/pods | grep lab13'
docker exec lgz-k3s sh -c 'ls -l /var/log/containers | grep orders-loi | sed "s/.*orders-loi/orders-loi/"'
docker exec lgz-k3s sh -c 'ls /var/log/pods/lab13_orders-loi_*/api/'
docker exec lgz-k3s sh -c 'head -2 /var/log/pods/lab13_orders-loi_*/api/*.log'
docker exec lgz-k3s sh -c 'tail -1 /var/log/pods/lab13_web-sidecar_*/nginx/0.log'
kubectl -n lab13 delete pod orders-loi --wait=true >/dev/null; kubectl -n lab13 logs orders-loi
sleep 20; docker exec lgz-k3s sh -c 'ls /var/log/pods | grep -c orders-loi'
