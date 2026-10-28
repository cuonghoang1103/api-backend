gcc -Wall -g pointers.c -o pointers && ./pointers
gcc -Wall -g sys.c -o sys && su dev -c ./sys
gcc -g overflow.c -o overflow && ./overflow "this string is far too long for eight bytes"; echo "exit=$?"
gcc -g -fsanitize=address overflow.c -o overflow-asan && ./overflow-asan "this string is far too long" 2>&1 | head -12
gcc -g null.c -o null && ./null; echo "exit=$?"
gdb -q -batch -ex run -ex bt ./null 2>&1 | tail -5
