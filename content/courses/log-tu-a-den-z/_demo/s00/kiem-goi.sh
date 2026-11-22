cd ~ && python3 tao-goi-log.py log-lab-thu
find . -type f | sort
wc -l web/access.log app/app.jsonl linux/auth.log
head -n 2 web/access.log
