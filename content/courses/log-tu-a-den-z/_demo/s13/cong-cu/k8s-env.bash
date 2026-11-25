# BASH_ENV cho k8s.bash: "kubectl" = kubectl bên trong container lgz-k3s (k3s v1.33.5), thư mục làm việc /lab = bản sao _demo/s13.
# Người học dùng kind/minikube/k3d thì gõ kubectl thẳng trong thư mục _demo/s13.
kubectl() { docker exec -i -w /lab lgz-k3s kubectl "$@"; }
