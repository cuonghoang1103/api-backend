// EchoNetty.java — máy chủ echo Netty 4.2 với transport epoll GỐC (JNI, không qua Selector của JDK), 2 luồng event loop.
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.epoll.*;
import io.netty.channel.socket.SocketChannel;

public class EchoNetty {
    public static void main(String[] a) throws Exception {
        EventLoopGroup group = new MultiThreadIoEventLoopGroup(2, EpollIoHandler.newFactory());
        ServerBootstrap b = new ServerBootstrap().group(group).channel(EpollServerSocketChannel.class)
            .option(ChannelOption.SO_BACKLOG, 4096)
            .childHandler(new ChannelInitializer<SocketChannel>() {
                @Override protected void initChannel(SocketChannel ch) {
                    ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                        @Override public void channelRead(ChannelHandlerContext ctx, Object msg) { ctx.writeAndFlush(msg); }
                    });
                }
            });
        System.out.println("echo-netty: native epoll available = " + Epoll.isAvailable());
        b.bind(Integer.parseInt(a[0])).sync().channel().closeFuture().sync();
    }
}
