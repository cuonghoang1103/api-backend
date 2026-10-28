// EchoNio.java — máy chủ echo bằng Java NIO thuần: MỘT luồng, một Selector (trên Linux = epoll).
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.*;
import java.util.Iterator;

public class EchoNio {
    public static void main(String[] a) throws Exception {
        Selector sel = Selector.open();                                   // epoll_create1
        ServerSocketChannel ss = ServerSocketChannel.open();
        ss.bind(new InetSocketAddress(Integer.parseInt(a[0])), 4096);
        ss.configureBlocking(false);
        ss.register(sel, SelectionKey.OP_ACCEPT);                         // epoll_ctl(ADD) — có thể hoãn tới select()
        System.out.println("echo-nio: " + sel.getClass().getName());
        ByteBuffer buf = ByteBuffer.allocateDirect(4096);
        while (true) {
            sel.select();                                                 // epoll_wait
            for (Iterator<SelectionKey> it = sel.selectedKeys().iterator(); it.hasNext(); ) {
                SelectionKey k = it.next();
                it.remove();
                if (k.isAcceptable()) {
                    SocketChannel c;
                    while ((c = ss.accept()) != null) { c.configureBlocking(false); c.register(sel, SelectionKey.OP_READ); }
                } else if (k.isReadable()) {
                    SocketChannel c = (SocketChannel) k.channel();
                    buf.clear();
                    int n;
                    try { n = c.read(buf); } catch (java.io.IOException e) { n = -1; }
                    if (n < 0) { k.cancel(); c.close(); continue; }
                    buf.flip();
                    c.write(buf);                                         // tin 64 byte: ghi một lần là hết
                }
            }
        }
    }
}
