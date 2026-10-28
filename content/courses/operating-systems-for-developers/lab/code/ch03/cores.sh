nproc
node -p "'node: os.cpus().length=' + require('os').cpus().length + '  os.availableParallelism()=' + require('os').availableParallelism()"
java Cores.java
python3 -c "import os; print('python: os.cpu_count()=%d  process_cpu_count()=%d' % (os.cpu_count(), os.process_cpu_count()))"
