"""
============================================================
KỊCH BẢN THU GIỌNG — dữ liệu huấn luyện F5-TTS
============================================================

⚠️ ĐÂY LÀ THỨ QUYẾT ĐỊNH CHẤT LƯỢNG, KHÔNG PHẢI SỐ GIỜ THU.

Người ta hay nghĩ fine-tune giọng là "thu càng nhiều càng giống". Sai.
Ba mươi phút phủ đủ mặt còn hơn ba tiếng đọc đều một giọng — vì model
học được cái gì thì chỉ NÓI LẠI được đúng cái đó. Đọc ba tiếng bằng
giọng phát thanh viên thì lúc cần cười nó vẫn không biết cười.

── VÌ SAO PHẢI CHIA THEO CẢM XÚC ──

F5-TTS là model nhân bản theo MẪU THAM CHIẾU: đưa nó một đoạn giọng, nó
chép lại cả chất giọng LẪN ngữ điệu của đoạn đó. Nên cảm xúc ở đầu ra
đến từ ĐOẠN MẪU, không phải từ chữ.

Việc fine-tune làm hai chuyện, và chỉ hai:
  1. Ghim chất giọng — model thôi phải đoán từ 8-30 giây, nó BIẾT sẵn
  2. Dạy model rằng giọng này CÓ THỂ cười / gắt / trầm

Rồi lúc nói, ta đưa đúng đoạn mẫu mang cảm xúc muốn có. Vì thế mỗi mục
dưới đây vừa là dữ liệu train, vừa là KHO MẪU THAM CHIẾU về sau — đoạn
thu ở mục "cười" chính là đoạn sẽ được dùng khi robot cần cười.

⚠️ Hệ quả thực tế: mục nào thu ẩu thì cảm xúc đó vĩnh viễn không dùng
được, dù tổng thời lượng có đẹp. Thà bỏ hẳn một mục còn hơn thu cho đủ.

── VÌ SAO CÂU DÀI NGẮN KHÁC NHAU ──

Cùng bài học đã trả giá ở mẫu đối thoại của robot (13/08/2026): tám mẫu
cùng dài 187-271 ký tự dạy model "luôn 220 chữ", và nó tuân răm rắp kể
cả khi được hỏi "mấy giờ rồi". Dữ liệu đồng đều dạy ra đầu ra đồng đều.

Ở đây cũng vậy nhưng về NHỊP: thu toàn câu 5 giây thì model không biết
lấy hơi giữa câu dài. Nên câu dưới đây trải từ ~3 tới ~14 giây.

── NHỮNG THỨ CỐ Ý CÓ MẶT ──

· Câu hỏi — ngữ điệu lên cuối câu, không có thì robot đọc câu hỏi nghe
  như câu kể, và nó hỏi lại người dùng suốt ngày.
· Số và thuật ngữ — đúng việc robot làm. `docSo.ts` đã đổi số sang chữ
  trước khi đưa máy đọc, nên ở đây cũng viết bằng CHỮ cho khớp.
· Đủ sáu thanh và các vần khó (-nh, -ch, -ng, -c, -t, -p).
"""
from __future__ import annotations

from typing import Dict, List, TypedDict


class Muc(TypedDict):
    khoa: str
    ten: str
    # Lời dặn cách đọc — hiện to trên màn hình lúc thu. Đây là thứ người
    # ta quên mất sau câu thứ mười, nên phải nhắc liên tục.
    dan: str
    # Mục này có được dùng làm mẫu tham chiếu cảm xúc về sau không.
    lamMau: bool
    cau: List[str]


KICH_BAN: List[Muc] = [
    {
        "khoa": "nen",
        "ten": "Giọng nền",
        "dan": (
            "Đọc như đang kể cho một người bạn ngồi đối diện. KHÔNG diễn, "
            "không lên giọng phát thanh viên. Đây là giọng mặc định của "
            "robot — thu ẩu ở đây thì hỏng tất cả những mục sau."
        ),
        "lamMau": True,
        "cau": [
            "Hôm nay trời đẹp, tôi định đi bộ một vòng quanh hồ.",
            "Cái bàn làm việc của tôi bừa quá, chắc phải dọn lại.",
            "Tôi vừa pha một ly cà phê, thơm ghê.",
            "Buổi sáng tôi hay dậy sớm, mở cửa sổ cho thoáng rồi mới làm việc.",
            "Con mèo nhà hàng xóm lại sang nằm ngoài ban công nhà tôi.",
            "Tối qua tôi ngủ hơi muộn nên sáng nay thấy uể oải.",
            "Chiếc xe máy của tôi mới thay nhớt tuần trước, chạy êm hẳn.",
            "Tôi thích những buổi chiều mưa, ngồi trong nhà nghe tiếng nước rơi trên mái tôn.",
            "Quán ăn đầu ngõ mở lại rồi, món bún của họ vẫn ngon như xưa.",
            "Cuối tuần này tôi định về quê thăm ông bà, lâu rồi chưa về.",
            "Cái máy tính này tôi dùng đã ba năm, vẫn còn chạy tốt.",
            "Tôi đang đọc một cuốn sách khá hay, nói về cách con người ra quyết định.",
            "Trời bắt đầu chuyển lạnh, tôi phải lấy áo khoác ra giặt.",
            "Buổi tối tôi thường tắt hết đèn, chỉ để một ngọn đèn bàn cho dịu mắt.",
            "Hôm qua tôi gặp lại một người bạn cũ, hai đứa ngồi nói chuyện tới khuya.",
            "Cây trước cửa nhà tôi vừa ra lá non, xanh mướt.",
            "Tôi không thích ồn ào, nên hay chọn chỗ ngồi trong góc.",
            "Chiều nay tôi phải ra bưu điện gửi một cái gói hàng.",
            "Tôi mới học được một cách nấu canh chua, ăn cũng tạm được.",
            "Điện thoại của tôi sắp hết pin rồi, để tôi cắm sạc đã.",
            "Cái áo này tôi mua từ năm ngoái, mặc mãi vẫn chưa cũ.",
            "Đường hôm nay đông quá, tôi phải đi vòng sang lối khác.",
            "Tôi hay quên chìa khoá lắm, nên lúc nào cũng để cố định một chỗ.",
            "Nhạc nhẹ buổi sáng làm tôi tỉnh táo hơn là cà phê.",
            "Tôi vừa dọn xong cái tủ sách, tìm thấy mấy cuốn tưởng mất từ lâu.",
            "Trong nhà tôi có một góc nhỏ để cây, sáng nào cũng phải tưới.",
            "Hồi nhỏ tôi hay trèo lên mái nhà ngồi nhìn trời, giờ nghĩ lại thấy liều thật.",
            "Tôi thích mùi giấy mới của một cuốn sách vừa bóc.",
            "Bữa cơm tối nhà tôi thường có canh, một món mặn và một đĩa rau luộc.",
            "Cái quạt trần kêu lạch cạch, chắc phải gọi thợ tới xem.",
            "Tôi đang tập thói quen đi ngủ trước mười một giờ, được vài hôm rồi.",
            "Hôm nọ tôi thử đi làm bằng xe buýt, hoá ra cũng tiện hơn tôi nghĩ.",
            "Buổi trưa tôi hay ngủ một giấc ngắn, dậy làm việc tỉnh táo hơn nhiều.",
            "Nhà tôi ở gần chợ nên sáng nào cũng nghe tiếng người bán hàng gọi nhau.",
            "Tôi mới đổi cái bàn phím, gõ nhẹ tay hơn cái cũ.",
            "Chiều thứ bảy tôi thường không làm gì cả, chỉ nằm nghe nhạc.",
            "Cái ổ cắm góc phòng bị lỏng, cắm vào phải giữ tay mới ăn điện.",
            "Tôi thích ăn phở buổi sáng hơn buổi tối, không hiểu vì sao.",
            "Trên đường đi làm có một hàng cây rất đẹp, mùa này lá vàng rụng đầy vỉa hè.",
            "Tôi để cái bút ở đâu đó trên bàn mà tìm mãi không ra.",
            # ── Đoạn dài: xem ghi chú "vì sao phải có câu dài" ở đầu file ──
            "Sáng nay tôi dậy sớm hơn thường lệ, pha một ấm trà rồi ngồi ngoài ban công nhìn xuống đường, "
            "thấy người ta đi lại tấp nập mà tự nhiên thấy trong lòng nhẹ nhõm, chẳng vội vàng gì cả.",
            "Hồi mới chuyển tới đây tôi không quen được, đường sá lạ, hàng xóm cũng chưa biết ai, "
            "nhưng ở được vài tháng thì thành ra thích, vì khu này yên tĩnh và có nhiều cây.",
            "Cái máy tính tôi đang dùng mua từ ba năm trước, lúc đó tôi cân nhắc mãi mới quyết, "
            "và tới giờ vẫn thấy đó là một quyết định đúng, vì nó chưa hỏng lần nào và vẫn chạy đủ nhanh cho việc của tôi.",
            "Chiều qua tôi đi bộ một vòng quanh hồ, trời hơi se lạnh, gió thổi nhẹ, "
            "trên bờ có mấy ông cụ ngồi đánh cờ, và tôi cứ đứng xem một lúc lâu rồi mới đi tiếp.",
            "Tôi có thói quen ghi lại những gì mình học được trong ngày, dù chỉ vài dòng, "
            "vì tôi nhận ra rằng thứ mình tưởng là nhớ kỹ thì chỉ vài tuần sau đã quên gần hết.",
            "Nhà tôi ở gần chợ nên sáng nào cũng ồn từ lúc năm giờ, tiếng xe, tiếng người gọi nhau, "
            "lúc đầu tôi khó chịu lắm, nhưng bây giờ thì quen rồi, thậm chí thiếu nó lại thấy lạ.",
            "Có những hôm tôi ngồi làm việc từ sáng tới tối mà chẳng ra được gì, "
            "rồi hôm sau chỉ cần một buổi là xong hết, tôi nghĩ đầu óc con người cũng cần ngày nghỉ giống như cơ bắp vậy.",
            "Cuối tuần trước tôi về quê thăm ông bà, hai cụ vẫn khoẻ, vẫn trồng rau ngoài vườn, "
            "và bữa cơm hôm đó có canh cua với cà pháo, ăn xong tôi ngồi nói chuyện với ông tới tận khuya.",
            "Tôi thích buổi tối hơn buổi sáng, vì lúc đó mọi thứ đã lắng xuống, không ai gọi điện, "
            "không có việc gì gấp, và tôi có thể ngồi yên một chỗ đọc sách hoặc nghĩ vẩn vơ mà không thấy áy náy.",
            "Cái quán cà phê ở đầu ngõ mở được hơn một năm rồi, chủ quán là một anh trạc tuổi tôi, "
            "pha cà phê rất được, và tôi hay ngồi đó vào buổi sáng thứ bảy, chọn cái bàn trong góc gần cửa sổ.",
        ],
    },
    {
        "khoa": "vui",
        "ten": "Vui, hào hứng",
        "dan": (
            "Nói nhanh hơn bình thường một chút, giọng bật lên, có năng "
            "lượng. Cứ hình dung vừa nhận được tin tốt và đang kể cho ai "
            "đó nghe."
        ),
        "lamMau": True,
        "cau": [
            "Trời ơi tôi làm được rồi!",
            "Cuối cùng cũng xong, tôi mừng quá đi mất!",
            "Cái này hay thật đấy, tôi chưa từng nghĩ ra cách đó!",
            "Tuyệt vời, đúng cái tôi đang cần luôn!",
            "Nghe tin đó tôi mừng cho bạn thật sự đấy!",
            "Xong rồi! Chạy ngon lành, không lỗi nào cả!",
            "Tôi vừa nhận được kết quả, tốt hơn tôi tưởng nhiều!",
            "Đúng rồi đúng rồi, chính xác là như vậy!",
            "Hôm nay là một ngày tuyệt vời, mọi thứ đều trôi chảy!",
            "Bạn làm nhanh quá, tôi tưởng phải mất cả tuần cơ!",
            "Ôi cái này đẹp thật, tôi thích lắm!",
            "Tôi vừa thử và nó chạy ngay lần đầu, sướng ghê!",
            "Chúc mừng nhé, xứng đáng lắm!",
            "Nhanh hơn hẳn rồi, khác biệt thấy rõ luôn!",
            "Tôi đang rất hào hứng với cái này, muốn làm ngay!",
            "Thích quá, cuối cùng cũng có người hiểu ý tôi!",
            "Được rồi được rồi, cứ thế mà làm tiếp thôi!",
            "Kết quả này vượt xa mong đợi của tôi luôn đấy!",
            "Tôi vừa tìm ra nguyên nhân rồi, hoá ra đơn giản lắm!",
            "Hay quá, tôi ghi lại để lần sau còn dùng!",
            "Nghe thôi đã thấy thích rồi, làm luôn đi!",
            "Mọi thứ vào guồng rồi, từ giờ nhẹ nhàng thôi!",
            "Tôi vui thật sự đấy, không phải nói cho có đâu!",
            "Cảm ơn nhé, hôm nay bạn cứu tôi một bàn thua trông thấy!",
            "Đúng là đáng công chờ đợi mà!",
            # ── Đoạn dài — mẫu tham chiếu cảm xúc phải đủ 5-15 giây ──
            "Trời ơi tôi vừa chạy thử xong và nó chạy ngon lành luôn, không lỗi nào cả, "
            "tôi ngồi nhìn cái màn hình mà cứ tưởng mình đọc nhầm, mất có hai ngày thôi mà xong hết rồi!",
            "Bạn không tin được đâu, cái thứ mà tôi loay hoay cả tuần không ra, "
            "sáng nay tự nhiên nghĩ ra cách khác, thử phát ăn ngay, tôi mừng quá suýt hét lên giữa phòng!",
            "Hôm nay đúng là ngày của tôi, sáng thì việc trôi chảy, trưa thì gặp lại bạn cũ, "
            "chiều lại nhận được tin vui nữa, tôi chẳng nhớ lần cuối vui thế này là bao giờ!",
            "Tuyệt vời thật đấy, tôi vừa nghe xong và thấy đúng là cách hay nhất từ trước tới giờ, "
            "vừa nhanh vừa gọn, mà lại còn dễ hiểu nữa, tôi phải ghi ngay lại kẻo quên mất!",
            "Nhanh hơn hẳn rồi bạn ạ, trước phải chờ gần năm giây, giờ chưa tới một giây đã có kết quả, "
            "khác biệt thấy rõ luôn, dùng thích hẳn, tôi ngồi bấm thử mãi mà vẫn thấy sướng!",
            "Chúc mừng bạn nhé, tôi biết bạn đã cố gắng rất nhiều cho việc này, "
            "và nhìn kết quả hôm nay thì đúng là xứng đáng với từng ngày bạn bỏ ra, tôi mừng cho bạn thật lòng!",
            "Được rồi, mọi thứ vào guồng hết rồi, từ giờ chỉ việc chạy thôi, "
            "không phải lo cái gì nữa, tôi thấy nhẹ cả người, cuối cùng cũng qua được giai đoạn khó nhất!",
            "Cái này hay thật, tôi chưa từng nghĩ có thể làm theo hướng đó, "
            "mà nghe xong thì thấy hiển nhiên quá, kiểu như nó vẫn ở đó từ đầu mà mình không nhìn ra vậy!",
        ],
    },
    {
        "khoa": "cuoi",
        "ten": "Cười khi nói",
        "dan": (
            "⚠️ MỤC KHÓ NHẤT VÀ QUAN TRỌNG NHẤT. Phải CƯỜI THẬT trong lúc "
            "nói, không phải nói xong rồi mới cười. Tiếng cười phải dính "
            "vào chữ. Cứ thoải mái, méo tiếng cũng được — méo mới đúng. "
            "Không cười nổi thì nghỉ, quay lại sau, đừng thu giả."
        ),
        "lamMau": True,
        "cau": [
            "Ha ha, buồn cười thật đấy!",
            "Không, thôi thôi, tôi chịu thua bạn rồi ha ha.",
            "Trời đất ơi, sao lại có chuyện đó được chứ!",
            "Ha ha ha, bạn nói vậy mà cũng nói được.",
            "Tôi cười muốn xỉu luôn, thật đấy.",
            "Đấy, tôi đã bảo rồi mà, ha ha.",
            "Ôi không, đừng bắt tôi kể lại chuyện đó, ngại lắm.",
            "Ha ha, tôi cũng từng làm y hệt như vậy hồi trước.",
            "Nghe xong tôi phải nhịn cười mãi mới nói tiếp được.",
            "Thôi được rồi được rồi, tôi sai, tôi sai, ha ha.",
            "Bạn hài thật đấy, tự nhiên tôi thấy đỡ căng thẳng hẳn.",
            "Ha ha, cái mặt lúc đó của tôi chắc buồn cười lắm.",
            "Đừng, đừng, tôi đang uống nước mà, sặc bây giờ.",
            "Ha ha ha, thôi tôi không hỏi nữa đâu.",
            "Chuyện này mà kể ra thì ai cũng cười cho mà xem.",
            "Tôi vừa nhớ lại chuyện hôm nọ, vẫn thấy buồn cười.",
            "Không tin nổi luôn, ha ha, sao lại thế được nhỉ.",
            "Ha ha, thôi bỏ đi, chuyện nhỏ ấy mà.",
            "Bạn làm tôi cười cả buổi sáng đấy biết không.",
            "Ha ha, đúng là chỉ có bạn mới nghĩ ra được cái đó.",
            # ── Đoạn dài — cười giữa câu, không phải cười xong mới nói ──
            "Ha ha, thôi tôi kể cho nghe, hôm đó tôi đứng chờ cả mười lăm phút trước cửa, "
            "gọi mãi không ai ra, hoá ra tôi đứng nhầm nhà, nhà bên cạnh cơ, ha ha, ngại kinh khủng!",
            "Không, đừng bắt tôi kể lại chuyện đó, ha ha, mỗi lần nhớ tới là tôi lại buồn cười, "
            "cái mặt của tôi lúc đó chắc phải ngơ ra tới mấy giây rồi mới hiểu chuyện gì đang xảy ra.",
            "Ha ha ha, bạn nói vậy mà cũng nói được, tôi đang uống nước đấy, sặc bây giờ, "
            "thôi được rồi được rồi tôi thua, tôi không cãi nữa đâu, ha ha.",
            "Tôi vừa nhớ lại chuyện hôm nọ, vẫn thấy buồn cười ghê, ha ha, "
            "cả phòng quay ra nhìn mà tôi thì cứ đứng đó không biết giấu mặt vào đâu.",
            "Ha ha, đúng là chuyện chỉ có ở nhà mình, tôi kể cho mấy đứa bạn nghe, "
            "đứa nào cũng cười, rồi cuối cùng hoá ra đứa nào cũng từng làm y hệt như thế cả.",
            "Thôi được rồi được rồi, tôi sai, tôi sai, ha ha, lần này tôi nhận, "
            "nhưng mà công bằng mà nói thì bạn cũng có phần trong đó đấy chứ, đừng có cười tôi mãi thế.",
            "Ha ha, buồn cười thật, tôi ngồi sửa cả buổi chiều, tìm đủ mọi chỗ, "
            "cuối cùng hoá ra chỉ vì thiếu đúng một dấu chấm phẩy, ha ha, mất toi ba tiếng đồng hồ.",
            "Bạn hài thật đấy, tự nhiên tôi thấy đỡ căng thẳng hẳn, ha ha, "
            "nãy giờ tôi cứ nghĩ mãi không ra, mà nghe bạn nói xong tự nhiên thấy chuyện cũng chẳng to tát gì.",
        ],
    },
    {
        "khoa": "buon",
        "ten": "Buồn, trầm",
        "dan": (
            "Nói CHẬM hơn hẳn, giọng xuống thấp, hơi thở dài hơn. Đừng "
            "khóc lóc — chỉ cần trầm và mệt, kiểu đang nói mà không muốn "
            "nói nhiều."
        ),
        "lamMau": True,
        "cau": [
            "Thôi, không sao đâu, tôi quen rồi.",
            "Tôi cũng không biết phải làm gì nữa.",
            "Buồn thật, tôi đã cố hết sức rồi mà.",
            "Có những chuyện mình không thay đổi được, đành chịu thôi.",
            "Hôm nay tôi thấy mệt, chắc để mai làm tiếp.",
            "Tôi nhớ những ngày trước, mọi thứ đơn giản hơn nhiều.",
            "Không ai nói gì cả, và tôi cũng chẳng biết bắt đầu từ đâu.",
            "Tôi tiếc lắm, giá mà lúc đó tôi để ý hơn một chút.",
            "Căn phòng trống trải quá, ngồi một mình thấy dài ghê.",
            "Tôi xin lỗi, thật sự là lỗi của tôi.",
            "Mọi người đi hết rồi, chỉ còn mình tôi ở lại.",
            "Có lẽ tôi đã sai ngay từ đầu mà không nhận ra.",
            "Tôi không muốn kể nhiều, nghĩ lại vẫn thấy nặng lòng.",
            "Đến giờ tôi vẫn chưa quen được với chuyện đó.",
            "Trời mưa suốt cả ngày, tự nhiên thấy chán.",
            "Tôi gọi mấy lần mà không ai bắt máy.",
            "Thôi kệ đi, có nói nữa cũng chẳng thay đổi được gì.",
            "Tôi ngồi đó rất lâu, không nghĩ được điều gì cả.",
            "Mọi thứ cứ trôi qua, còn tôi thì đứng yên một chỗ.",
            "Tôi mệt rồi, chỉ muốn nghỉ một hôm thôi.",
            "Nhìn lại một năm qua, tôi chẳng làm được gì đáng kể.",
            "Có lúc tôi tự hỏi mình đang cố gắng vì điều gì.",
            "Cái ghế đó giờ vẫn để đấy, không ai ngồi nữa.",
            "Tôi đã chờ rất lâu, nhưng chắc là không có ai đến đâu.",
            "Đêm nay dài quá, tôi nằm mãi mà không ngủ được.",
            # ── Đoạn dài — giọng trầm cần chỗ để chậm lại ──
            "Tôi ngồi đó rất lâu, chẳng nghĩ được điều gì cả, ngoài trời thì mưa, "
            "trong phòng thì tối, và tôi cứ để nguyên như vậy, không buồn bật đèn lên nữa.",
            "Có những chuyện mình biết là không thay đổi được, nhưng vẫn cứ nghĩ đi nghĩ lại, "
            "kiểu như nếu hôm đó mình làm khác đi một chút thì có khi mọi thứ đã không thành ra thế này.",
            "Mọi người đi hết rồi, căn phòng trống trải quá, mấy cái ghế vẫn để nguyên chỗ cũ, "
            "và tôi ngồi lại một mình, nghe rõ cả tiếng đồng hồ trên tường.",
            "Nhìn lại một năm vừa qua tôi thấy mình chẳng làm được gì đáng kể, "
            "ngày nào cũng bận, lúc nào cũng vội, mà cuối cùng hỏi lại thì không nhớ nổi mình đã bận vì cái gì.",
            "Tôi xin lỗi, thật sự là lỗi của tôi, tôi đã biết trước mà vẫn để nó xảy ra, "
            "và bây giờ thì có nói gì cũng muộn rồi, tôi chỉ mong bạn đừng nghĩ là tôi không cố.",
            "Hôm nay tôi mệt lắm, không phải mệt người mà mệt trong đầu, "
            "chỉ muốn tắt hết đi, nằm xuống, và không phải nghĩ tới bất cứ chuyện gì nữa cho tới sáng mai.",
            "Cái ghế đó giờ vẫn để đấy, không ai ngồi nữa, tôi cũng chưa dọn đi, "
            "cứ để vậy thôi, có lẽ vì dọn đi rồi thì thành ra thừa nhận là mọi thứ đã khác thật.",
            "Đêm nay dài quá, tôi nằm mãi mà không ngủ được, cứ trở mình liên tục, "
            "nghĩ hết chuyện này tới chuyện khác, tới lúc mệt quá thì trời cũng gần sáng rồi.",
        ],
    },
    {
        "khoa": "gian",
        "ten": "Bực, gắt",
        "dan": (
            "Gằn giọng, nói dứt khoát, nhấn mạnh từng chữ. KHÔNG cần hét "
            "to — gắt nằm ở cách nhấn, không ở âm lượng. Hét to sẽ vỡ "
            "tiếng và hỏng mẫu."
        ),
        "lamMau": True,
        "cau": [
            "Tôi đã nói rồi mà, sao vẫn làm sai như vậy.",
            "Đủ rồi đấy, tôi không muốn nghe thêm nữa.",
            "Chuyện này đáng ra không được phép xảy ra.",
            "Bao nhiêu lần rồi, lần nào cũng vậy.",
            "Tôi bực thật đấy, không đùa đâu.",
            "Sao lại để đến nước này mới báo cho tôi.",
            "Không, tôi không đồng ý, dứt khoát là không.",
            "Ai cho phép làm như vậy, tôi hỏi thật.",
            "Tôi mất cả buổi chiều chỉ vì cái lỗi này.",
            "Làm ơn tập trung vào, đừng để tôi phải nhắc nữa.",
            "Cái này sai từ gốc, sửa chỗ ngọn thì được gì.",
            "Tôi không hiểu nổi, tại sao lại khó đến thế.",
            "Đừng có hứa nữa, tôi cần thấy việc chứ không cần nghe.",
            "Thế là quá đáng rồi đấy, tôi nói thật.",
            "Tôi đã cảnh báo từ đầu, và giờ thì đúng như vậy.",
            "Dừng lại, đừng làm gì thêm nữa cho tới khi tôi xem xong.",
            "Cái kiểu làm việc này tôi chịu không nổi.",
            "Bạn có nghe tôi nói không đấy.",
            "Tôi hỏi một câu thôi, sao trả lời vòng vo mãi thế.",
            "Hỏng rồi, hỏng hết rồi, giờ làm lại từ đầu.",
            "Tôi không muốn nghe lý do, tôi muốn nghe cách sửa.",
            "Lần này tôi bỏ qua, nhưng không có lần sau đâu.",
            "Sao lại tự ý đổi mà không hỏi ai một câu.",
            "Tôi nói lần cuối, làm đúng như tôi vừa dặn.",
            "Thôi, khỏi cần giải thích, tôi tự làm cho nhanh.",
            # ── Đoạn dài — gắt nằm ở NHẤN, không ở âm lượng ──
            "Tôi đã nói từ đầu rồi mà, nói rõ ràng, nói trước mặt tất cả mọi người, "
            "vậy mà giờ vẫn làm sai đúng cái chỗ tôi dặn, thế thì tôi nói để làm gì.",
            "Đủ rồi đấy, tôi không muốn nghe thêm lý do nào nữa, "
            "lần nào cũng có lý do, lần nào cũng hứa lần sau, mà lần sau thì vẫn y như cũ.",
            "Sao lại để đến nước này mới báo cho tôi, chuyện xảy ra từ hôm kia, "
            "hai ngày trời không ai nói một câu, tới lúc không cứu được nữa thì mới gọi tôi vào.",
            "Tôi mất cả buổi chiều chỉ vì cái lỗi này, mà nó là lỗi đáng ra không được phép có, "
            "chỉ cần đọc lại một lượt trước khi gửi đi là thấy ngay, có khó gì đâu.",
            "Không, tôi không đồng ý, dứt khoát là không, và tôi cũng không đổi ý đâu, "
            "làm kiểu đó thì được việc hôm nay nhưng hỏng việc cả tháng sau, tôi không chấp nhận.",
            "Cái này sai từ gốc rồi, sửa chỗ ngọn thì được gì, "
            "vá tạm hôm nay thì mai lại hỏng chỗ khác, làm ơn dừng lại và làm cho đúng ngay từ đầu.",
            "Bao nhiêu lần rồi, lần nào cũng vậy, tôi nhắc, mọi người gật, rồi đâu lại vào đấy, "
            "tôi bắt đầu nghĩ là không phải mọi người không hiểu, mà là không ai coi việc này ra gì cả.",
        ],
    },
    {
        "khoa": "nghiem",
        "ten": "Nghiêm túc, giảng giải",
        "dan": (
            "Giọng đều, rõ ràng, có nhịp — như đang giải thích một khái "
            "niệm cho người mới. Ngắt câu ở dấu phẩy. Đây là giọng robot "
            "sẽ dùng khi trả lời câu hỏi kỹ thuật."
        ),
        "lamMau": True,
        "cau": [
            "Trước hết, chúng ta cần hiểu vấn đề nằm ở đâu, rồi mới bàn tới cách sửa.",
            "Có ba nguyên nhân thường gặp, và tôi sẽ nói lần lượt từng cái một.",
            "Điểm quan trọng ở đây là thứ tự, làm sai thứ tự thì kết quả sẽ khác hẳn.",
            "Nói một cách đơn giản, nó hoạt động giống như một cái van, mở ra thì dòng chảy qua.",
            "Lưu ý rằng cách này chỉ đúng khi dữ liệu đầu vào đã được kiểm tra trước.",
            "Nếu bạn làm theo đúng các bước, kết quả sẽ ổn định qua mọi lần chạy.",
            "Tôi sẽ giải thích từ đầu, để bạn nắm được vì sao lại phải làm như vậy.",
            "Điều cần nhớ là mỗi thay đổi đều có cái giá của nó, không có gì miễn phí cả.",
            "Trong trường hợp này, cách an toàn nhất là dừng lại và kiểm tra trước khi đi tiếp.",
            "Hãy hình dung nó như một dòng nước, chặn chỗ này thì nó sẽ tìm đường khác.",
            "Vấn đề không nằm ở tốc độ, mà nằm ở chỗ chúng ta đang đo sai thứ.",
            "Bước thứ nhất là chuẩn bị, bước thứ hai là kiểm tra, và bước cuối là chạy thật.",
            "Nguyên tắc chung là như vậy, nhưng luôn có ngoại lệ mà bạn cần để ý.",
            "Tôi khuyên bạn nên ghi lại, vì sau vài tuần sẽ không ai nhớ chi tiết này nữa.",
            "Khác biệt giữa hai cách nằm ở chỗ một cách kiểm tra trước, cách kia kiểm tra sau.",
            "Nếu kết quả không như mong đợi, hãy quay lại kiểm tra từ bước đầu tiên.",
            "Điều này nghe có vẻ nhỏ, nhưng về lâu dài nó tạo ra khác biệt rất lớn.",
            "Chúng ta không nên đoán, cách duy nhất chắc chắn là đo thử một lần.",
            "Tôi muốn nhấn mạnh một điểm, đừng bao giờ bỏ qua bước kiểm tra cuối cùng.",
            "Tóm lại, có hai hướng đi, và mỗi hướng phù hợp với một hoàn cảnh khác nhau.",
            "Cái khó ở đây không phải là làm, mà là biết khi nào nên dừng.",
            "Bạn cứ làm theo thứ tự này, tới đâu vướng thì hỏi tôi tới đó.",
            "Về mặt kỹ thuật thì cả hai đều được, nhưng cách thứ hai dễ bảo trì hơn.",
            "Hãy nhớ rằng một hệ thống chạy đúng chưa chắc đã là một hệ thống làm đúng.",
            "Cuối cùng, tôi muốn bạn tự thử lại một lần, làm rồi mới nhớ được.",
            # ── Đoạn dài — đây là giọng robot dùng nhiều nhất khi trả lời ──
            "Trước hết chúng ta cần thống nhất là vấn đề nằm ở đâu đã, vì nếu mỗi người hiểu một kiểu "
            "thì bàn cách sửa cũng vô ích, ai cũng sẽ sửa đúng cái mình nghĩ là hỏng, và không ai sửa đúng chỗ thật sự hỏng.",
            "Có ba nguyên nhân thường gặp ở trường hợp này, tôi sẽ nói lần lượt từng cái, "
            "cái thứ nhất là dữ liệu đầu vào không đúng như ta tưởng, cái thứ hai là thứ tự thực hiện bị đảo, "
            "và cái thứ ba, cũng là cái khó tìm nhất, là hai phần đúng riêng lẻ nhưng đặt cạnh nhau thì sai.",
            "Nói một cách đơn giản thì nó hoạt động giống như một cái van, mở ra thì dòng chảy qua, đóng lại thì dừng, "
            "nhưng điểm quan trọng là cái van này không đóng ngay lập tức, nó cần một khoảng thời gian, "
            "và chính khoảng đó là nơi mọi rắc rối sinh ra nếu ta không tính tới.",
            "Điều tôi muốn bạn nhớ nhất trong hôm nay là thế này, đừng bao giờ đoán khi có thể đo, "
            "vì một phép đo mất năm phút, còn một lần đoán sai có thể làm bạn đi nhầm hướng suốt cả tuần "
            "mà vẫn tin chắc là mình đang đi đúng.",
            "Khác biệt giữa hai cách nằm ở chỗ một cách kiểm tra trước khi làm, cách kia kiểm tra sau khi làm xong, "
            "nghe thì nhỏ nhưng hậu quả rất khác nhau, vì kiểm tra sau nghĩa là lúc phát hiện ra thì việc đã xảy ra rồi, "
            "và có những việc xảy ra rồi thì không lùi lại được.",
            "Nếu kết quả không như mong đợi thì bạn hãy quay lại kiểm tra từ bước đầu tiên chứ đừng sửa ở bước cuối, "
            "vì bước cuối chỉ là chỗ lỗi lộ ra, nó hiếm khi là chỗ lỗi sinh ra, "
            "và sửa ở chỗ lỗi lộ ra thì bạn chỉ đang giấu nó đi thôi.",
            "Tóm lại là có hai hướng đi, hướng thứ nhất nhanh hơn nhưng khó bảo trì về sau, "
            "hướng thứ hai mất công hơn lúc đầu nhưng ai đọc lại cũng hiểu, "
            "và nếu đây là thứ bạn sẽ còn dùng lâu dài thì tôi khuyên chọn hướng thứ hai.",
        ],
    },
    {
        "khoa": "hoi",
        "ten": "Câu hỏi, ngạc nhiên",
        "dan": (
            "Lên giọng ở cuối câu. Đây là mục hay bị đọc đều nhất — đọc "
            "câu hỏi bằng giọng câu kể thì robot sẽ hỏi lại người dùng "
            "nghe như đang ra lệnh."
        ),
        "lamMau": False,
        "cau": [
            "Bạn có chắc không?",
            "Thật á? Sao lại thế được nhỉ?",
            "Bây giờ là mấy giờ rồi?",
            "Bạn muốn tôi làm gì tiếp theo?",
            "Ơ, cái này ở đâu ra vậy?",
            "Bạn đã thử khởi động lại chưa?",
            "Sao bạn không nói với tôi sớm hơn?",
            "Cái nào quan trọng hơn, nhanh hay chắc?",
            "Bạn thấy thế nào, được không?",
            "Hôm nay bạn có bận gì không?",
            "Ủa, tôi tưởng chuyện đó xong lâu rồi mà?",
            "Bạn cần tôi nói lại lần nữa không?",
            "Có ai ở đây không?",
            "Chuyện gì đang xảy ra vậy?",
            "Bạn có nghe rõ tôi nói không?",
            "Tại sao lại chọn cách đó mà không phải cách kia?",
            "Đợi đã, bạn vừa nói gì cơ?",
            "Mình bắt đầu từ đâu bây giờ?",
            "Bạn có muốn tôi giải thích kỹ hơn không?",
            "Thế còn trường hợp ngược lại thì sao?",
        ],
    },
    {
        "khoa": "so",
        "ten": "Số và thuật ngữ",
        "dan": (
            "Đọc bình thường, rõ chữ. Số ở đây đã viết bằng CHỮ đúng như "
            "robot sẽ nhận — cứ đọc y như đang thấy, đừng tự đổi sang đọc "
            "từng chữ số."
        ),
        "lamMau": False,
        "cau": [
            "Tốc độ ánh sáng khoảng ba trăm nghìn ki lô mét trên giây.",
            "Nhiệt độ ngoài trời hiện tại là hai mươi tám độ C.",
            "Pin còn tám mươi bảy phần trăm, đủ dùng thêm vài tiếng nữa.",
            "Tên mạng là T P gạch nối Link gạch dưới một gạch dưới chín.",
            "Sóng wifi đang ở mức âm bốn mươi hai đề xi ben mi li oát, khá tốt.",
            "Bộ nhớ còn trống hai gi ga bai trên tổng số tám gi ga bai.",
            "Tôi đang chạy trên con chip E S P ba mươi hai S ba.",
            "Giá của nó khoảng một triệu bảy trăm năm mươi nghìn đồng.",
            "Cái cảm biến này đọc được khoảng cách từ hai xăng ti mét tới hai mét.",
            "Mô hình có chín tỉ tham số, chạy vừa đủ trên card mười hai gi ga bai.",
            "Bây giờ là bảy giờ ba mươi tư phút sáng.",
            "Có hai mươi mốt bản ghi trong cơ sở dữ liệu.",
            "Kết quả trả về sau hai phẩy bốn giây.",
            "Tần số lấy mẫu là hai mươi bốn ki lô héc.",
            "Địa chỉ ai pi của tôi là một trăm chín mươi hai chấm một sáu tám chấm một chấm mười lăm.",
            "Ngày mai là ngày mười lăm tháng tám năm hai nghìn không trăm hai mươi sáu.",
            "Dung lượng pin là hai nghìn sáu trăm mi li ăm pe giờ.",
            "Tôi cần khoảng ba mươi phút để xử lý xong việc này.",
            "Độ chính xác đạt chín mươi tư phẩy hai phần trăm.",
            "Cổng kết nối là tám nghìn không trăm chín mươi.",
        ],
    },
]


def tat_ca_cau() -> List[Dict[str, object]]:
    """Trải kịch bản thành danh sách phẳng, mỗi câu một id ổn định.

    ⚠️ ID PHẢI ỔN ĐỊNH GIỮA CÁC LẦN SỬA FILE NÀY. Nó là tên file wav trên
    đĩa; đổi id là mất liên kết giữa tiếng đã thu và chữ, mà người dùng đã
    bỏ hàng chục phút để thu. Nên id ghép từ khoá mục + số thứ tự trong
    mục, KHÔNG phải chỉ số toàn cục — thêm câu vào mục đầu sẽ không đẩy
    số của mọi mục sau.
    """
    ra: List[Dict[str, object]] = []
    for muc in KICH_BAN:
        for i, cau in enumerate(muc["cau"]):
            ra.append(
                {
                    "id": f"{muc['khoa']}-{i:03d}",
                    "muc": muc["khoa"],
                    "tenMuc": muc["ten"],
                    "dan": muc["dan"],
                    "lamMau": muc["lamMau"],
                    "chu": cau,
                }
            )
    return ra


def uoc_giay(cau: str) -> float:
    """Ước thời lượng đọc một câu, tính bằng giây.

    ⚠️ 3,2 âm tiết/giây, KHÔNG PHẢI 4,5.

    Bản đầu của hàm này lấy 4,5 — tốc độ nói chuyện nhanh — và không cộng
    khoảng lặng hai đầu. Nó báo cả kịch bản chỉ 8,7 phút, trong khi thật
    ra là 13. Sai gần một nửa, và sai theo hướng nguy hiểm nhất: nó khiến
    kịch bản trông như đã đủ dữ liệu trong khi còn thiếu.

    Đọc diễn cảm chậm hơn nói chuyện, có ngắt ở dấu phẩy, và mỗi đoạn thu
    còn 0,3 giây đệm hai đầu sau khi cắt lặng.

    Trong tiếng Việt mỗi âm tiết viết rời một từ, nên đếm từ = đếm âm tiết.
    """
    return len(cau.split()) / 3.2 + 0.3


def tom_tat() -> Dict[str, object]:
    tong = sum(len(m["cau"]) for m in KICH_BAN)
    giay = sum(uoc_giay(c) for m in KICH_BAN for c in m["cau"])
    return {
        "soCau": tong,
        "soMuc": len(KICH_BAN),
        # Để người dùng biết phải ngồi bao lâu TRƯỚC khi bắt đầu, chứ
        # không phải phát hiện ra ở câu thứ tám mươi.
        "uocPhut": round(giay / 60, 1),
        "muc": [
            {
                "khoa": m["khoa"],
                "ten": m["ten"],
                "soCau": len(m["cau"]),
                "lamMau": m["lamMau"],
                "uocPhut": round(sum(uoc_giay(c) for c in m["cau"]) / 60, 1),
                # Đoạn ≥ 30 âm tiết (~9 giây) mới dùng được làm mẫu tham
                # chiếu: F5-TTS chép ngữ điệu tốt nhất ở mẫu 5-15 giây, và
                # một câu 3 giây không đủ chỗ cho một đường ngữ điệu.
                "soDai": sum(1 for c in m["cau"] if len(c.split()) >= 30),
            }
            for m in KICH_BAN
        ],
    }
