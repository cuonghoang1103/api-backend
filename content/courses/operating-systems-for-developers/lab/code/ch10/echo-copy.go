// echo-copy.go — y hệt echo.go nhưng dùng io.Copy(c, c): gọn hơn, và runtime tự chọn splice(2) qua một ống dẫn.
package main

import (
	"fmt"
	"io"
	"net"
	"os"
)

func main() {
	ln, err := net.Listen("tcp", ":"+os.Args[1])
	if err != nil {
		panic(err)
	}
	fmt.Println("echo-go-copy: io.Copy per connection")
	for {
		c, err := ln.Accept()
		if err != nil {
			continue
		}
		go func(c net.Conn) { io.Copy(c, c); c.Close() }(c)
	}
}
