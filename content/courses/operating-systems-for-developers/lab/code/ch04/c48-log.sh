node gen-log.js /data/access.log 2000000
head -3 /data/access.log
javac -d . LogAnalyzer.java
time awk '{ s[$9]++ } END { for (k in s) printf "%s=%d ", k, s[k]; print "" }' /data/access.log
java LogAnalyzer /data/access.log 4
node loganalyzer.js /data/access.log 4
diff <(java LogAnalyzer /data/access.log 1 | sed -E 's/^java  W=[0-9]+ +//' | head -6) <(node loganalyzer.js /data/access.log 8 | sed -E 's/^node  W=[0-9]+ +//' | head -6) && echo "same result: Java W=1 and Node W=8"
./sweep.sh "java LogAnalyzer /data/access.log {k}" 1 2 4 8 10
./sweep.sh "node loganalyzer.js /data/access.log {k}" 1 2 4 8 10
java LogAnalyzer /data/access.log 8 3 | grep " ms$"
./sweep.sh "java LogAnalyzer /data/access.log {k} 3" 1 2 4 8 10
/usr/bin/time -f "java W=4: %e s wall, %U s user, max RSS %M KB" java LogAnalyzer /data/access.log 4 > /dev/null
/usr/bin/time -f "node W=4: %e s wall, %U s user, max RSS %M KB" node loganalyzer.js /data/access.log 4 > /dev/null
/usr/bin/time -f "java W=1: %e s wall, %U s user, max RSS %M KB" java LogAnalyzer /data/access.log 1 > /dev/null
/usr/bin/time -f "node W=1: %e s wall, %U s user, max RSS %M KB" node loganalyzer.js /data/access.log 1 > /dev/null
@ rm -f LogAnalyzer*.class
