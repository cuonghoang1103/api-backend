// echo.go — máy chủ echo Go: MỖI kết nối một goroutine, code viết kiểu CHẶN — runtime lo epoll (netpoller).
package main

import (
	"fmt"
	"net"
	"os"
)

func main() {
	ln, err := net.Listen("tcp", ":"+os.Args[1])
	if err != nil {
		panic(err)
	}
	fmt.Println("echo-go: one goroutine per connection")
	for {
		c, err := ln.Accept()
		if err != nil {
			continue
		}
		go func(c net.Conn) {
			defer c.Close()
			buf := make([]byte, 4096)
			for {
				n, err := c.Read(buf) // "chặn" goroutine — KHÔNG chặn luồng OS
				if err != nil {
					return
				}
				if _, err := c.Write(buf[:n]); err != nil {
					return
				}
			}
		}(c)
	}
}
