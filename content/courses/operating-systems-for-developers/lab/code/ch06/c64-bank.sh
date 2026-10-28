python3 banker.py safety
python3 banker.py request P1 1,0,2 P4 3,3,0 P0 0,2,0
python3 banker.py detect
python3 banker.py detect P2 0,0,1
python3 banker.py pool 2 2
node pool-deadlock.js 1
node pool-deadlock.js 2; echo "exit=$?"
node pool-deadlock.js 2 timeout
node pool-deadlock.js 2 pass-client
node await-cycle.mjs; echo "exit=$?"
node await-cycle.mjs server & sleep 0.5; curl -s -m 2 localhost:3000/; echo "curl exit=$?"
ps -o pid,stat,pcpu,cmd -C node; kill %1; wait 2>/dev/null
node pool-starve.js shared
node pool-starve.js bulkhead
