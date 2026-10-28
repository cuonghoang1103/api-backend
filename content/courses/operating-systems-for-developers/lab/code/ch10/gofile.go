// gofile.go — 32 goroutine cùng đọc 32 file LẠNH 2 MiB: đọc file không đi qua netpoller, nên mỗi lần chặn giữ hẳn một luồng OS.
package main

import (
	"fmt"
	"os"
	"sync"
	"time"
)

func threads() int { e, _ := os.ReadDir("/proc/self/task"); return len(e) }

func main() {
	fmt.Println("threads before:", threads())
	var wg sync.WaitGroup
	peak := 0
	done := make(chan bool)
	go func() {
		for {
			select {
			case <-done:
				return
			default:
				if t := threads(); t > peak {
					peak = t
				}
				time.Sleep(time.Millisecond)
			}
		}
	}()
	t := time.Now()
	for i := 0; i < 32; i++ {
		wg.Add(1)
		go func(i int) { defer wg.Done(); os.ReadFile(fmt.Sprintf("/tmp/small%d", i)) }(i)
	}
	wg.Wait()
	close(done)
	fmt.Printf("32 cold files read in %v; peak threads during reads: %d\n", time.Since(t).Round(time.Millisecond), peak)
}
