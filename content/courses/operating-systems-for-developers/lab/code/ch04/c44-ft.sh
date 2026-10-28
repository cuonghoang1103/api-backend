@ apt-get update -qq > /dev/null 2>&1
python3 gil.py
ls /usr/bin/python3*
apt-cache search --names-only '^python3\.1[3-9]' | grep -ciE 'nogil|freethread|python3\.1[3-9]t'
apt-cache policy python3.14-nogil python3.14t 2>&1 | head -3
