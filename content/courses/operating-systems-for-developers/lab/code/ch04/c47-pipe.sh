@ node slow.js > /tmp/slow.log 2>&1 &
@ sleep 1
java -Xmx256m Pipeline.java bounded 1000000 2
java -Xmx256m Pipeline.java unbounded 1000000 2
java -Xmx256m Pipeline.java bounded 2000000 2
for i in 1 2 3; do java -Xmx256m Pipeline.java unbounded 2000000 2; echo "exit $?"; done
python3 mr.py gen /data/words.txt 1000000
python3 mr.py one /data/words.txt
python3 mr.py lines /data/words.txt 4
python3 mr.py ranges /data/words.txt 4
python3 mr.py ranges /data/words.txt 8
head -n 100000 /data/words.txt > /data/small.txt
python3 mr.py one /data/small.txt
python3 mr.py lines1 /data/small.txt 4
python3 mr.py ranges /data/small.txt 4
java Cancel.java sleep
java Cancel.java spin
java Cancel.java check
java Cancel.java http
node cancel.js fetch
node cancel.js race
node cancel.js worker
python3 cancel.py asyncio
python3 cancel.py thread
python3 cancel.py process
node gen-log.js /data/access.log 300000
java giai/Pipeline3.java /data/access.log 3 10000
java giai/Pipeline3.java /data/access.log 3 50
@ pkill -f slow.js
