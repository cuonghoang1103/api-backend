package vn.cu;
import static org.junit.Assert.*; import static org.mockito.Mockito.*; import org.junit.Test;
public class KhoSachTest {
  @Test public void giaKho() {
    KhoSach kho = mock(KhoSach.class);
    Sach s = new Sach(); s.setTen("Java"); s.setConLai(3);
    when(kho.tim(7)).thenReturn(s);
    assertEquals(3, kho.tim(7).getConLai());
  }
}
