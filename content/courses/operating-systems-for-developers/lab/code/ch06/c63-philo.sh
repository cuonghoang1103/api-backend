@ mkdir -p /tmp/w && cp -r . /tmp/w && cd /tmp/w
gcc -O2 -pthread philo.c -o philo
./philo naive; echo "exit=$?"
./philo ordered
./philo waiter
./philo trylock
java Philo.java naive; echo "exit=$?"
java Philo.java ordered
java Philo.java waiter
gcc -O2 -pthread bb.c -o bb
./bb right
./bb wrong; echo "exit=$?"
