# echo_async.py — máy chủ echo Python asyncio: một luồng, vòng lặp sự kiện trên selectors.EpollSelector.
import asyncio, sys

async def handle(reader, writer):
    try:
        while data := await reader.read(4096):
            writer.write(data)
            await writer.drain()      # backpressure: chờ bộ đệm gửi vơi bớt
    except ConnectionError:           # khách cắt ngang (RST): bình thường với máy chủ thật
        pass
    finally:
        writer.close()

async def main():
    srv = await asyncio.start_server(handle, port=int(sys.argv[1]), backlog=4096)
    print('echo-asyncio:', type(asyncio.get_running_loop()._selector).__name__, flush=True)
    await srv.serve_forever()

asyncio.run(main())
