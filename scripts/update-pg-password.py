#!/usr/bin/env python3
import subprocess, urllib.parse, re, os

pw = os.environ.get('PG_PW', '')
if not pw:
    print('ERROR: PG_PW env var not set')
    exit(1)

# Update password in PostgreSQL server
r = subprocess.run(
    ['docker', 'compose', '-f', '/opt/cuonghoangdev/docker-compose.yml',
     'exec', '-T', 'postgres',
     'psql', '-U', 'postgres', '-d', 'postgres',
     '-c', f'ALTER USER postgres PASSWORD \'{pw}\';'],
    capture_output=True, text=True
)
print('PG OK' if r.returncode == 0 else 'PG FAIL: ' + r.stderr.strip())

# Update DATABASE_URL in .env with URL-encoded password
encoded = urllib.parse.quote(pw, safe='')
with open('/opt/cuonghoangdev/.env', 'r') as f:
    content = f.read()
content = re.sub(
    r'^DATABASE_URL=.*',
    'DATABASE_URL=postgresql://postgres:' + encoded + '@postgres:5432/cuonghoangdev_db?schema=public',
    content, flags=re.MULTILINE
)
with open('/opt/cuonghoangdev/.env', 'w') as f:
    f.write(content)
print('DATABASE_URL updated')
