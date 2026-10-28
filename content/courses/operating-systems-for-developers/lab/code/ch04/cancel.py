# cancel.py — hạn chờ và huỷ trong Python.
#   python3 cancel.py asyncio    asyncio.timeout(0.3) quanh một lời gọi trả lời sau 2 s — tác vụ bị HUỶ thật
#   python3 cancel.py thread     future.result(timeout=0.3) — hết hạn, nhưng LUỒNG không huỷ được: chương trình chờ nó
#   python3 cancel.py process    việc CPU trong một tiến trình con: terminate() sau 0,3 s
import sys, time, asyncio, urllib.request, multiprocessing as mp
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FutTimeout

t0 = time.perf_counter()
def at(): return f'[{(time.perf_counter() - t0) * 1000:4.0f} ms]'

def slow_call():
    urllib.request.urlopen('http://localhost:9000/?ms=2000').read()
    print(at(), 'thread: the call finished anyway')

def spin():
    while True: pass

async def main_async():
    try:
        async with asyncio.timeout(0.3):
            reader, writer = await asyncio.open_connection('localhost', 9000)
            writer.write(b'GET /?ms=2000 HTTP/1.1\r\nHost: x\r\nConnection: close\r\n\r\n')
            await reader.read()
    except TimeoutError:
        print(at(), 'asyncio: TimeoutError — the task was cancelled at its await')

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'asyncio':
        asyncio.run(main_async())
    elif mode == 'thread':
        with ThreadPoolExecutor(1) as ex:
            f = ex.submit(slow_call)
            try: f.result(timeout=0.3)
            except FutTimeout: print(at(), 'thread: result() timed out; cancel() returns', f.cancel())
        print(at(), 'thread: leaving the with-block (it waited for the thread)')
    else:
        p = mp.Process(target=spin); p.start()
        time.sleep(0.3); p.terminate(); p.join()
        print(at(), 'process: exitcode', p.exitcode, '(= killed by signal 15, SIGTERM)')
