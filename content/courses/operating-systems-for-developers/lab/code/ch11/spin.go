package main

// spin.go — hai goroutine quay vòng không gọi hàm nào, trên MỘT luồng (GOMAXPROCS=1): runtime Go chỉ giành lại
// CPU được bằng cách gửi tín hiệu SIGURG cho chính mình (async preemption, Go 1.14+).
import "sync"

func main() {
	var wg sync.WaitGroup
	for g := 0; g < 2; g++ {
		wg.Add(1)
		go func() {
			x := 0
			for i := 0; i < 2_000_000_000; i++ {
				x += i
			}
			_ = x
			wg.Done()
		}()
	}
	wg.Wait()
}
