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

import re
from typing import Dict, List, TypedDict


class _MucGoc(TypedDict):
    khoa: str
    ten: str
    # Lời dặn cách đọc — hiện to trên màn hình lúc thu. Đây là thứ người
    # ta quên mất sau câu thứ mười, nên phải nhắc liên tục.
    dan: str
    # Mục này có được dùng làm mẫu tham chiếu cảm xúc về sau không.
    lamMau: bool
    cau: List[str]


class Muc(_MucGoc, total=False):
    # Mục giảng bài có thuật ngữ tiếng Anh: mỗi câu được gắn danh sách
    # thuật ngữ (`tuAnh`) để màn hình thu hiện nút nghe mẫu + chấm từng từ.
    tuAnh: bool
    # Mục câu THUẦN tiếng Anh (khoá `anh`): màn hình có nút nghe mẫu cả câu,
    # backend chấm bằng Whisper ngôn ngữ `en` không mớm, và `xuong.py` xuất
    # nó ra bộ dữ liệu RIÊNG — không trộn vào F5 tiếng Việt.
    tiengAnh: bool


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
    {
        "khoa": "trung",
        "ten": "Tiếng miền Trung",
        "dan": (
            "⚠️ SỬA CÂU CHO ĐÚNG KIỂU BẠN NÓI TRƯỚC KHI ĐỌC. Bấm 'Sửa "
            "chữ' nếu câu nào nghe không thuận miệng — miền Trung mỗi vùng "
            "một khác (Nghệ Tĩnh, Quảng Bình, Huế, Quảng Nam), và đọc một "
            "câu KHÔNG PHẢI giọng mình là dạy model một giọng giả. Thà bỏ "
            "câu đó còn hơn.\n\n"
            "Đọc thật tự nhiên, như đang nói với người cùng quê."
        ),
        "lamMau": True,
        "cau": [
            # ── Lõi chung mọi vùng miền Trung: mô, tê, răng, rứa, chi, ni, nớ ──
            "Đi mô rứa?",
            "Răng rứa? Có chuyện chi à?",
            "Cái ni là cái chi rứa?",
            "Có chi mô, chuyện nhỏ mà.",
            "Bây chừ mấy giờ rồi hè?",
            "Cái nớ để đó tui làm cho.",
            "Ăn cơm chưa rứa?",
            "Nói rứa mà cũng nói được à.",
            "Đứa nớ đi mô từ sáng tới chừ không thấy về.",
            "Tui có biết mô mà nói.",
            "Rứa là xong rồi hè, khoẻ.",
            "Chờ tui một chút, tui ra liền.",
            "Trời ni mà đi ra ngoài là ướt hết.",
            "Mần chi mà lâu rứa không biết.",
            "Thôi được rồi, để mai tính.",
            # ── Câu dài — vừa là dữ liệu, vừa là mẫu tham chiếu giọng Trung ──
            "Hôm ni trời nắng dữ quá, đi mô cũng thấy mệt, "
            "chắc tui ở nhà cho khoẻ chứ không đi đâu nữa mô.",
            "Cái chuyện nớ tui nghe rồi, mà nghe răng cũng thấy lạ lạ, "
            "không biết có thiệt không nữa, để tui hỏi lại đã rồi tính.",
            "Bây chừ mà đi ra chợ thì đông lắm, chờ trưa trưa một chút "
            "cho vắng bớt rồi hẵng đi, chứ chen chúc mệt lắm.",
            "Nhà tui ở gần đó, đi bộ mấy phút là tới, "
            "rứa mà lâu ni bận quá nên cũng ít khi qua chơi.",
            "Hồi nhỏ tui hay theo mấy đứa trong xóm ra đồng chơi tới tối mới về, "
            "về nhà là bị la, mà bữa sau vẫn đi, chừ nghĩ lại thấy vui.",
            "Tui nói thiệt chứ không phải nói cho vui mô, "
            "cái ni mà làm được là hay lắm đó, ai cũng khen chứ không phải một mình tui.",
            "Mưa từ chiều tới chừ chưa tạnh, đường sá ướt nhẹp, "
            "ra ngoài chi cho cực, ở trong nhà uống miếng nước chè cho ấm bụng.",
            # ── Có cảm xúc, để mẫu tham chiếu vừa mang giọng vừa mang tình ──
            "Trời ơi hay quá, rứa là được rồi!",
            "Tui bực thiệt đó, nói hoài mà cứ rứa.",
            "Ha ha, răng mà buồn cười rứa không biết!",
            "Thôi, cũng chẳng biết nói răng nữa, để rứa đi.",
            "Mừng cho hắn, cực khổ lâu ni chừ mới được rứa.",
            "Đủ rồi nghe, tui không muốn nghe thêm chi nữa hết.",
        ],
    },
]


# ══════════════════════════════════════════════════════════
#  GIẢNG BÀI — THUẬT NGỮ TIẾNG ANH (thêm 14/10/2026)
# ══════════════════════════════════════════════════════════
#
# VÌ SAO CÓ: giọng F5 đã train chỉ học tiếng Việt, nên khi đọc bài giảng
# nó phiên âm thuật ngữ ("Node.js", "useState", "querySelector") một cách
# vấp váp — người nghe chê "sai hết nhất là tiếng Anh". Muốn model đọc
# đúng thì nó phải được NGHE chính giọng chủ kênh đọc những từ đó, đặt
# trong câu giảng bài thật.
#
# CÁCH ĐỌC:
#   · Thuật ngữ tiếng Anh đọc theo TIẾNG ANH CHUẨN (giọng Mỹ). Trang thu có
#     nút 🔊 cạnh từng thuật ngữ để nghe mẫu, 🐢 để nghe chậm từng phần,
#     kèm IPA và cách đọc gần đúng.
#   · Phần tiếng Việt đọc tự nhiên như đang giảng: chậm, rõ, ngắt ở dấu
#     phẩy. Đây cũng là giọng sẽ được dùng làm MẪU THAM CHIẾU cho video.
#
# ⚠️ CHỮ GIỮ ĐÚNG CHÍNH TẢ TIẾNG ANH, KHÔNG PHIÊN ÂM. Sau khi train ta đưa
# thẳng "useState" vào F5, nên dữ liệu train phải dạy model rằng chuỗi ký
# tự "useState" phát ra âm /juːz steɪt/. Viết "diu xtết" ở đây là dạy nó
# một chuỗi ký tự khác hẳn thứ sẽ được đưa vào.
#
# ⚠️ CHỈ DÙNG KÝ TỰ CÓ TRONG VOCAB của checkpoint (`hynt_vocab.txt`, 2566
# dòng). Vocab có đủ a-z A-Z 0-9 . - _ / nhưng KHÔNG có `<` và dấu huyền
# ngược — nên không viết thẻ kiểu "<div>", số viết bằng chữ (theo
# `docSo.ts`). Đã kiểm bằng `kiem_vocab()` dưới đây với file vocab thật.
#
# ⚠️ ID ỔN ĐỊNH: thêm câu thì thêm vào CUỐI mục, đừng chèn giữa — id là
# `<khoa>-NNN` theo vị trí trong mục.
#
# Thuật ngữ: danh sách `TU_ANH` bên dưới. Cách đọc (IPA, gần đúng, chữ cho
# giọng máy đọc mẫu) nằm ở `frontend/src/components/admin/xuongTuDien.ts` —
# KHOÁ HAI BÊN PHẢI KHỚP. Mỗi thuật ngữ có mặt ≥ 2 lần, ở đầu / giữa / cuối
# câu khác nhau; mỗi câu 1–3 thuật ngữ.

_DAN_GIANG = (
    "Đọc như đang giảng cho lớp: chậm, rõ, ngắt hơi ở dấu phẩy. Phần tiếng "
    "Việt đọc tự nhiên. Chữ TÔ MÀU là thuật ngữ tiếng Anh — đọc theo tiếng "
    "Anh chuẩn (Mỹ): bấm 🔊 nghe mẫu trước khi thu, không chắc thì bấm 🐢. "
    "Vấp hay ngập ngừng thì bấm R thu lại."
)

KICH_BAN_GIANG: List[Muc] = [
    {
        "khoa": "giang-react",
        "ten": "Giảng bài — React, FER202",
        "dan": _DAN_GIANG,
        "lamMau": True,
        "tuAnh": True,
        "cau": [
            "React là một thư viện JavaScript dùng để dựng giao diện người dùng.",
            "Trong bài này, chúng ta sẽ làm quen với React từ con số không.",
            "Mỗi component giống như một viên gạch nhỏ, ghép nhiều viên lại thì thành một trang hoàn chỉnh.",
            "Các bạn để ý nhé, tên của một component luôn viết hoa chữ cái đầu.",
            "JSX trông rất giống HTML, nhưng thật ra nó là JavaScript được viết theo một cú pháp đặc biệt.",
            "Khi chương trình chạy, toàn bộ JSX sẽ được dịch ra thành những lời gọi hàm bình thường.",
            "Dữ liệu mà cha truyền xuống cho con thì ta gọi là props.",
            "props chỉ để đọc, con tuyệt đối không được tự sửa dữ liệu mà cha đưa xuống.",
            "Còn state là dữ liệu riêng của component, và nó có thể thay đổi theo thời gian.",
            "Mỗi lần state thay đổi, React sẽ render lại đúng phần giao diện liên quan.",
            "Muốn có một biến nhớ được giá trị giữa các lần vẽ lại, ta gọi useState.",
            "useState trả về một mảng gồm hai phần tử: giá trị hiện tại và hàm để cập nhật nó.",
            "Đừng bao giờ gán thẳng giá trị mới cho state, hãy luôn đi qua hàm cập nhật.",
            "useEffect dùng để chạy những việc phụ, ví dụ gọi API hay đặt hẹn giờ.",
            "Mảng phụ thuộc ở cuối useEffect quyết định khi nào đoạn code bên trong chạy lại.",
            "Nếu mảng phụ thuộc để trống, useEffect chỉ chạy đúng một lần sau lần render đầu tiên.",
            "Quên dọn dẹp trong useEffect là nguyên nhân của rất nhiều lỗi khó tìm.",
            "Một hook thực chất chỉ là một hàm đặc biệt, có tên bắt đầu bằng chữ use.",
            "Luật quan trọng nhất là chỉ được gọi hook ở cấp cao nhất của component.",
            "Không được đặt một hook bên trong câu lệnh if hay trong vòng lặp for.",
            "useContext giúp ta lấy dữ liệu dùng chung mà không phải truyền props qua từng tầng.",
            "Trước khi dùng useContext, ta phải bọc cây component bằng một Provider.",
            "Provider nhận một giá trị và chia sẻ nó cho tất cả các component nằm bên trong.",
            "Context rất tiện cho những thứ như giao diện sáng tối hay thông tin người đăng nhập.",
            "Nhưng các bạn đừng lạm dụng Context, vì mỗi lần giá trị đổi là cả nhánh bên dưới vẽ lại.",
            "useRef cho ta một chiếc hộp nhỏ, đổi giá trị bên trong mà không làm trang vẽ lại.",
            "Cách dùng phổ biến nhất của useRef là trỏ thẳng tới một phần tử trên trang, ví dụ một ô input.",
            "Khi logic cập nhật state bắt đầu rối, hãy chuyển sang useReducer.",
            "useReducer nhận vào một hàm reducer và một giá trị ban đầu.",
            "Một reducer là hàm thuần, nhận state cũ cùng một action, rồi trả về state mới.",
            "useMemo nhớ lại kết quả của một phép tính nặng, để không phải tính lại mỗi lần render.",
            "useCallback cũng giống vậy, nhưng thứ nó nhớ là chính cái hàm.",
            "Chỉ dùng useMemo và useCallback khi đã đo thấy chậm, đừng dùng theo thói quen.",
            "Redux là một thư viện quản lý state tập trung cho cả ứng dụng.",
            "Trong Redux, toàn bộ dữ liệu nằm chung trong một store duy nhất.",
            "Muốn thay đổi dữ liệu trong store, ta phải dispatch một action.",
            "Mỗi action là một object nhỏ, mô tả chuyện gì vừa xảy ra.",
            "Khi ta gọi dispatch, Redux chuyển yêu cầu đó tới đúng hàm xử lý.",
            "Nhờ có reducer, mọi thay đổi trong store đều đi qua một chỗ và rất dễ dò lỗi.",
            "Để chuyển trang mà không tải lại, ta dùng thư viện React Router.",
            "Mỗi Route ánh xạ một đường dẫn tới một component cụ thể.",
            "Các bạn bọc toàn bộ ứng dụng trong Router, rồi khai báo từng Route bên trong.",
            "Thay vì thẻ liên kết thông thường, hãy dùng Link để chuyển trang mượt hơn.",
            "Link không làm tải lại trang, nên state của ứng dụng vẫn còn nguyên.",
            "useNavigate cho phép ta chuyển trang bằng code, ví dụ sau khi đăng nhập thành công.",
            "Sau khi lưu xong, ta gọi hàm mà useNavigate trả về để quay lại trang danh sách.",
            "Muốn đọc mã sản phẩm nằm trên đường dẫn, ta dùng useParams.",
            "useParams trả về một object chứa tất cả tham số trên đường dẫn.",
            "Outlet là chỗ để các trang con hiện ra bên trong trang cha.",
            "Thiếu Outlet thì trang con có khai báo đúng đến đâu cũng không bao giờ hiện lên.",
            "Mọi thứ nằm giữa thẻ mở và thẻ đóng của một component sẽ được truyền vào qua children.",
            "Nhờ children, ta có thể viết một khung chung rồi nhét nội dung khác nhau vào.",
            "Bootstrap là bộ giao diện có sẵn, giúp trang đẹp lên mà không cần viết nhiều CSS.",
            "Với React, ta nên dùng React-Bootstrap thay vì gắn Bootstrap theo kiểu cũ.",
            "React-Bootstrap biến mỗi thành phần giao diện thành một component dùng được ngay.",
            "Thanh menu nằm trên cùng mà các bạn đang thấy chính là một Navbar.",
            "Navbar sẽ tự thu gọn thành nút ba gạch khi màn hình nhỏ lại.",
            "Mỗi sản phẩm ta hiển thị trong một Card, gồm ảnh, tên và giá.",
            "Card rất hợp để làm lưới sản phẩm, vì kích thước các ô đều nhau.",
            "Khi người dùng bấm xoá, ta mở một Modal để hỏi lại cho chắc.",
            "Modal hiện đè lên trang, và chỉ đóng khi người dùng bấm nút hoặc bấm ra ngoài.",
            "Container giữ cho nội dung nằm gọn ở giữa và có khoảng cách hai bên.",
            "Các bạn bọc lưới sản phẩm trong một Container để trang không bị dàn sát mép.",
            "Vite là công cụ tạo dự án React rất nhanh, nhanh hơn hẳn cách cũ.",
            "Chỉ cần một lệnh npm, Vite đã dựng sẵn cho ta cả bộ khung dự án.",
            "Virtual DOM là một bản sao nhẹ của trang web, nằm ngay trong bộ nhớ.",
            "React so sánh hai bản Virtual DOM, rồi chỉ sửa đúng những chỗ thật sự thay đổi.",
            "Với những trang ít người vào, ta dùng lazy để chỉ tải phần đó khi thật sự cần.",
            "Đi kèm với lazy luôn là Suspense, để hiện dòng chữ đang tải trong lúc chờ.",
            "Suspense nhận một giao diện dự phòng và hiện nó cho tới khi phần kia tải xong.",
            "Khi render một danh sách, mỗi phần tử phải có một key không trùng.",
            "key giúp React nhận ra phần tử nào được thêm, phần tử nào bị xoá.",
            "Đừng dùng index của mảng làm key nếu danh sách có thể đổi thứ tự.",
            "onClick nhận vào một hàm, và hàm đó chạy mỗi khi người dùng bấm.",
            "Một lỗi rất hay gặp là gọi hàm ngay trong onClick thay vì truyền hàm vào.",
            "Với ô nhập liệu, ta bắt sự kiện onChange để cập nhật state theo từng phím gõ.",
            "onChange chạy mỗi lần nội dung trong ô thay đổi, dù chỉ là một ký tự.",
            "Khi người dùng gửi biểu mẫu, hàm xử lý gắn ở onSubmit sẽ được gọi.",
            "Trong onSubmit, việc đầu tiên là chặn trình duyệt tải lại trang.",
            "Next.js là một bộ khung xây trên React, có sẵn định tuyến và dựng trang phía máy chủ.",
            "Sang chương nâng cao, chúng ta sẽ chuyển một dự án nhỏ sang Next.js.",
            "TypeScript thêm kiểu dữ liệu vào JavaScript, để bắt lỗi ngay khi đang gõ.",
            "Khai báo kiểu cho props bằng TypeScript giúp ta tránh truyền nhầm dữ liệu.",
            "Cuối mỗi file component, ta thường viết export default để file khác dùng được.",
            "Một file chỉ có đúng một export default, nhưng có thể có nhiều export thường.",
            "Toán tử spread giúp ta chép một mảng hay một object sang bản mới.",
            "Khi state là một object, hãy dùng spread để giữ lại các trường cũ.",
            "destructuring cho phép tách các trường của object ra thành từng biến riêng.",
            "Hầu như component nào cũng dùng destructuring để lấy props cho gọn.",
            "arrow function viết ngắn hơn hàm thường, và các bạn sẽ gặp nó suốt khoá học.",
            "Trong React, các bạn sẽ thấy arrow function xuất hiện ở khắp mọi nơi.",
            "template literal dùng dấu nháy ngược, cho phép chèn biến thẳng vào giữa chuỗi.",
            "Muốn ghép tên lớp động cho thẻ, ta hay dùng template literal.",
            "Bây giờ chúng ta thử ghép mọi thứ lại: component cha giữ state, truyền dữ liệu xuống con qua props, "
            "và con báo ngược lên cha bằng một hàm được truyền xuống.",
            "Các bạn hãy nhớ quy trình này: người dùng bấm nút, onClick gọi hàm cập nhật, state thay đổi, "
            "và React tự động vẽ lại đúng phần giao diện cần thiết.",
            "Khi dự án lớn dần, việc truyền dữ liệu qua năm sáu tầng component trở nên rất mệt, "
            "và đó chính là lúc ta nghĩ tới Context hoặc Redux.",
            "Thông thường mình sẽ gọi API trong useEffect, lưu kết quả vào state, "
            "rồi trong lúc chờ thì hiện một dòng chữ đang tải cho người dùng đỡ sốt ruột.",
            "Trong bài lab này, các bạn sẽ dựng một trang danh sách sản phẩm bằng React-Bootstrap, "
            "mỗi sản phẩm là một Card, và bấm vào thì mở ra phần chi tiết trong một Modal.",
            "Một điều mình muốn các bạn ghi nhớ là JSX chỉ được trả về một phần tử gốc duy nhất, "
            "nên khi có nhiều thẻ nằm ngang hàng thì phải bọc chúng lại.",
            "Giờ ta mở file App lên, và xoá hết phần code mẫu đi nhé.",
            "Router phải bọc ở ngoài cùng, nếu không Link sẽ báo lỗi ngay.",
            "Hàm dispatch là cách duy nhất để thay đổi dữ liệu trong Redux.",
            "Mình sẽ đặt cả Navbar lẫn Outlet vào một component khung chung.",
            "Cái hay của useRef là nó giữ nguyên giá trị qua mọi lần vẽ lại.",
            "Hãy tưởng tượng store như một nhà kho chung mà cả ứng dụng cùng đọc.",
            "Các bạn chạy thử lại xem nút đã nhận onClick chưa.",
            "Vite khởi động gần như tức thì, kể cả với dự án khá lớn.",
            "Đó là lý do mình khuyên các bạn học thật kỹ useState trước khi đụng tới Redux.",
            "Một Provider có thể bọc một Provider khác, xếp lồng nhiều tầng cũng được.",
            "Nếu các bạn quên truyền key, mở Console lên sẽ thấy ngay một dòng cảnh báo màu vàng.",
            "Hầu hết những lỗi đầu tiên với useEffect đến từ việc quên khai báo mảng phụ thuộc, "
            "khiến hàm chạy đi chạy lại mãi không dừng, và trình duyệt bắt đầu đơ dần.",
            "Mình hay ví Redux như một cuốn sổ cái của cả lớp: ai muốn ghi gì cũng phải nộp một action, "
            "và chỉ có reducer mới được cầm bút ghi vào sổ.",
            "Khi gặp một đoạn JSX quá dài, các bạn đừng ngại tách nó ra thành một component nhỏ hơn, "
            "đặt tên cho rõ nghĩa, như vậy người đọc sau sẽ cảm ơn các bạn.",
            "Đến phần cuối khoá, chúng ta sẽ đưa cả dự án lên Next.js và viết lại bằng TypeScript, "
            "nên các bạn cứ yên tâm học chắc phần nền trước đã.",
            "Muốn tránh lọc lại danh sách mỗi lần gõ phím, ta bọc phép lọc trong useMemo.",
            "export default đặt ở cuối file, còn import thì đặt ở đầu file.",
            "Muốn khỏi phải tự đổi dữ liệu sang JSON, các bạn có thể dùng axios.",
        ],
    },
    {
        "khoa": "giang-js",
        "ten": "Giảng bài — JavaScript",
        "dan": _DAN_GIANG,
        "lamMau": True,
        "tuAnh": True,
        "cau": [
            "JavaScript là ngôn ngữ chạy trong trình duyệt, giúp trang web biết phản ứng với người dùng.",
            "Có ba cách khai báo biến, đó là var, let và const.",
            "const dùng cho những giá trị không gán lại, còn let dùng khi giá trị cần thay đổi.",
            "Bây giờ các bạn gần như không cần dùng var nữa.",
            "Mặc định mình luôn dùng const, chỉ khi nào phải gán lại thì mới đổi sang let.",
            "Một function nhận đầu vào, xử lý, rồi trả kết quả ra bằng return.",
            "Khi gặp return, hàm dừng lại ngay và những dòng phía dưới bị bỏ qua.",
            "Ta có thể truyền một function vào một function khác như một giá trị bình thường.",
            "Hàm được truyền vào để gọi lại sau, người ta gọi là callback.",
            "callback lồng nhau quá nhiều tầng sẽ tạo ra code rất khó đọc.",
            "Promise ra đời để thay thế những chuỗi callback lồng nhau đó.",
            "Một Promise có ba trạng thái: đang chờ, thành công và thất bại.",
            "Ta dùng then để lấy kết quả khi Promise thành công.",
            "Còn catch sẽ bắt lỗi nếu có bất kỳ bước nào thất bại.",
            "Cách viết hiện đại hơn là dùng async và await.",
            "Từ khoá await chỉ được dùng bên trong một hàm có async.",
            "Với async và await, code bất đồng bộ đọc lên giống hệt code tuần tự.",
            "Bọc lời gọi await trong try và catch để xử lý lỗi cho gọn.",
            "fetch là hàm có sẵn của trình duyệt để gửi request lên server.",
            "Kết quả của fetch là một Promise, nên ta phải chờ nó.",
            "Nhận được response rồi, ta gọi thêm một bước nữa để đọc dữ liệu JSON.",
            "JSON là định dạng văn bản để trao đổi dữ liệu giữa trình duyệt và máy chủ.",
            "Nhiều bạn thích axios hơn fetch vì nó tự đổi JSON giúp mình.",
            "Một array là danh sách các giá trị có thứ tự, đánh số từ không.",
            "Thuộc tính length cho biết array đang có bao nhiêu phần tử.",
            "map biến mỗi phần tử thành một phần tử mới, và trả về một mảng mới cùng độ dài.",
            "Trong React, ta dùng map để biến một danh sách dữ liệu thành danh sách thẻ.",
            "filter giữ lại những phần tử thoả điều kiện, còn lại thì bỏ đi.",
            "Muốn tìm các sản phẩm còn hàng, ta gọi filter trên mảng sản phẩm.",
            "reduce gom cả mảng lại thành một giá trị duy nhất, ví dụ tổng tiền giỏ hàng.",
            "Tính tổng tiền bằng reduce thì ngắn hơn hẳn tự viết vòng lặp.",
            "forEach chỉ đi qua từng phần tử, nó không trả về mảng mới như map.",
            "Nếu chỉ cần in ra từng dòng thì dùng forEach là đủ.",
            "Một object gom nhiều thông tin liên quan vào một chỗ, theo từng cặp tên và giá trị.",
            "Mỗi thuộc tính trong object có một cái tên và một value.",
            "Mọi ô nhập liệu đều có thuộc tính value để đọc chữ người dùng vừa gõ.",
            "string là kiểu chuỗi ký tự, còn number là kiểu số.",
            "Chuỗi rỗng, số không và null đều bị coi là sai khi đặt trong câu điều kiện.",
            "boolean chỉ có hai giá trị là true và false.",
            "Hàm này trả về true nếu email hợp lệ, ngược lại thì trả về false.",
            "Biến khai báo mà chưa gán gì thì mang giá trị undefined.",
            "undefined nghĩa là chưa có giá trị, còn null là ta cố tình để trống.",
            "Lỗi kinh điển nhất của người mới học là đọc thuộc tính của undefined.",
            "Câu lệnh if kiểm tra một điều kiện, đúng thì chạy khối bên trong.",
            "Nếu điều kiện sai, chương trình nhảy xuống nhánh else.",
            "Vòng lặp for lặp lại một khối lệnh với số lần biết trước.",
            "Mỗi vòng loop, biến đếm lại tăng thêm một đơn vị.",
            "index là vị trí của phần tử trong mảng, bắt đầu đếm từ không.",
            "DOM là cây các phần tử mà trình duyệt dựng ra từ file HTML.",
            "JavaScript thay đổi giao diện bằng cách sửa trực tiếp trên DOM.",
            "querySelector tìm phần tử đầu tiên khớp với một selector.",
            "Ta có thể truyền cho querySelector một tên class, một id, hoặc tên thẻ.",
            "getElementById tìm đúng một phần tử theo id của nó.",
            "Ngày nay mình dùng querySelector nhiều hơn getElementById vì nó linh hoạt hơn.",
            "addEventListener gắn một hàm để lắng nghe sự kiện trên một phần tử.",
            "Mình gọi addEventListener với sự kiện click, rồi truyền vào hàm xử lý.",
            "Mỗi lần người dùng click, trình duyệt tạo ra một event mang đầy đủ thông tin.",
            "Từ object event, ta biết được người dùng vừa bấm vào phần tử nào.",
            "textContent chỉ đặt chữ thuần, còn innerHTML sẽ hiểu cả thẻ bên trong.",
            "Cẩn thận với innerHTML, vì chèn dữ liệu người dùng vào đó rất dễ bị tấn công.",
            "Muốn thay chữ trong một thẻ cho an toàn, hãy dùng textContent.",
            "console.log in giá trị ra Console để ta xem code đang chạy thế nào.",
            "Khi chưa hiểu lỗi nằm ở đâu, cứ console.log từng bước ra mà xem.",
            "setTimeout hẹn giờ để chạy một hàm sau một khoảng thời gian.",
            "Dù đặt setTimeout bằng không giây, hàm đó vẫn phải xếp hàng chờ.",
            "Đó là nhờ event loop, cơ chế giúp JavaScript làm nhiều việc mà chỉ có một luồng.",
            "Hiểu event loop rồi thì các bạn sẽ hết thắc mắc vì sao code chạy không theo thứ tự.",
            "scope là phạm vi mà một biến còn được nhìn thấy.",
            "Biến khai báo bằng let chỉ sống trong scope của khối chứa nó.",
            "closure là khi một hàm bên trong vẫn nhớ được biến của hàm bên ngoài.",
            "Nhờ closure, ta có thể tạo ra những biến riêng mà bên ngoài không đụng tới được.",
            "hoisting là hiện tượng phần khai báo được đưa lên đầu phạm vi trước khi code chạy.",
            "Vì có hoisting, gọi một hàm trước khi khai báo nó vẫn chạy được.",
            "localStorage lưu dữ liệu ngay trên trình duyệt, tắt máy mở lại vẫn còn.",
            "localStorage chỉ lưu được chuỗi, nên ta phải đổi object sang JSON trước khi cất.",
            "Muốn chia nhỏ chương trình ra nhiều file, ta dùng import và export.",
            "Mỗi file JavaScript như vậy được gọi là một module.",
            "import luôn đặt ở đầu, để lấy những gì module khác đã chia sẻ.",
            "Gọi API thực chất là gửi một request và chờ nhận lại dữ liệu.",
            "Hầu hết API ngày nay đều trả về dữ liệu dạng JSON.",
            "Mình sẽ viết một async function nhỏ để lấy danh sách người dùng.",
            "Hàm này nhận một array số và trả về một array mới đã lọc.",
            "Lọc xong, ta map tiếp để lấy ra đúng phần tên.",
            "Bây giờ các bạn để ý dòng này: ta dùng fetch để gửi yêu cầu, chờ kết quả bằng await, "
            "rồi đổi dữ liệu nhận được sang JSON trước khi hiển thị lên trang.",
            "Một Promise giống như tờ phiếu hẹn ở quán ăn, bạn chưa có món ngay, "
            "nhưng biết chắc lát nữa sẽ được gọi, dù là món đã xong hay báo hết món.",
            "Khi viết vòng lặp, các bạn luôn tự hỏi ba câu: bắt đầu từ đâu, dừng ở đâu, "
            "và mỗi vòng loop thì tăng thêm bao nhiêu.",
            "Ba hàm map, filter và reduce là bộ ba mà mình dùng gần như mỗi ngày, "
            "nắm chắc ba hàm này là xử lý được phần lớn dữ liệu dạng danh sách.",
            "Đừng học thuộc lòng cú pháp của arrow function, hãy viết thử mười lần, "
            "tự khắc tay sẽ nhớ mà không cần nghĩ.",
            "Khi mở Console lên và thấy dòng chữ đỏ báo lỗi undefined, các bạn đừng hoảng, "
            "hãy đọc kỹ xem nó báo ở dòng nào trước đã.",
            "Ta khai báo một const tên là danh sách, gán cho nó một mảng rỗng.",
            "Hàm này nhận một string và trả về chính chuỗi đó viết hoa.",
            "Kiểu number trong JavaScript dùng chung cho cả số nguyên lẫn số thực.",
            "Một biến boolean thường được đặt tên bắt đầu bằng chữ is hoặc has.",
            "Nếu không có else, khi điều kiện sai thì chẳng có gì xảy ra cả.",
            "Trong câu lệnh if này, ta kiểm tra người dùng đã đăng nhập hay chưa.",
            "Vòng for này đi từ đầu đến cuối danh sách.",
            "Muốn lấy phần tử cuối cùng thì dùng length trừ đi một.",
            "Tìm thấy rồi thì trả về index, còn không thì trả về âm một.",
            "Lỗi này là do ta quên viết return ở cuối hàm.",
            "try sẽ chạy thử khối lệnh, có lỗi thì nhảy sang catch ngay.",
            "Mỗi event đều mang theo thông tin về phần tử đã phát ra nó.",
            "Chỉ cần click một lần là danh sách sẽ mở ra.",
            "then nối tiếp nhau thành một chuỗi, bước này xong mới tới bước sau.",
            "Một module có thể gom nhiều hàm liên quan lại với nhau.",
            "scope của một biến quyết định những ai được phép đọc nó.",
            "Bài tập về nhà: viết một function nhận vào một array điểm số, dùng filter lấy ra các điểm từ năm trở lên, "
            "rồi tính điểm trung bình của chúng.",
            "Các bạn nhớ cho mình là var có những hành vi rất khó đoán do hoisting, "
            "nên trong mọi bài lab của môn này, chúng ta chỉ khai báo biến theo cách mới.",
            "Khi bấm nút mà không thấy gì xảy ra, hãy kiểm tra xem addEventListener đã gắn đúng phần tử chưa, "
            "rồi mới nghi tới những chỗ khác.",
            "Mỗi Promise đều có thể nối thêm then.",
            "Muốn hiện thông báo rồi tự tắt sau ba giây, ta dùng setTimeout.",
            "Kết quả của một phép so sánh luôn là một boolean, đúng hoặc sai.",
            "null là giá trị ta tự gán khi muốn nói rằng chỗ này đang trống.",
            "false là một trong hai giá trị của kiểu đúng sai.",
            "Bộ đếm số lần bấm này là một ví dụ rất gọn của closure.",
            "Cả setTimeout lẫn fetch đều phải nhờ tới event loop mới chạy được.",
            "Giỏ hàng vẫn còn sau khi tải lại trang là nhờ ta đã cất nó vào localStorage.",
        ],
    },
    {
        "khoa": "giang-web",
        "ten": "Giảng bài — HTML, CSS",
        "dan": _DAN_GIANG,
        "lamMau": True,
        "tuAnh": True,
        "cau": [
            "HTML là bộ khung, CSS là quần áo, còn JavaScript là phần cử động của trang web.",
            "Mọi trang HTML đều có hai phần chính là head và body.",
            "Phần head chứa thông tin cho trình duyệt, người xem không nhìn thấy trực tiếp.",
            "Mọi thứ người dùng thấy trên trang đều nằm trong body.",
            "Thẻ meta khai báo bảng mã, và quan trọng nhất là thẻ meta cho viewport.",
            "Thiếu thẻ cấu hình viewport, trang của bạn sẽ bị thu nhỏ xíu trên điện thoại.",
            "Mỗi element gồm thẻ mở, phần nội dung và thẻ đóng.",
            "Một tag có thể mang thêm attribute để mô tả rõ hơn.",
            "attribute luôn viết trong thẻ mở, theo dạng tên bằng giá trị.",
            "div là chiếc hộp đa năng, dùng để gom các phần tử lại thành khối.",
            "span thì khác div, nó nằm gọn trong dòng chữ chứ không xuống dòng.",
            "Dùng span khi chỉ muốn tô màu một vài chữ trong câu.",
            "Đường dẫn của liên kết nằm trong thuộc tính href.",
            "href có thể trỏ tới một trang khác, hoặc tới một phần ngay trong trang.",
            "Thẻ ảnh cần hai thứ: src để biết ảnh ở đâu, và alt để mô tả ảnh.",
            "Nếu src sai đường dẫn, trình duyệt sẽ hiện một khung ảnh vỡ.",
            "alt giúp người khiếm thị nghe được tấm ảnh đó nói về điều gì.",
            "Mỗi image trên trang nên được nén nhỏ để tải nhanh hơn.",
            "Ta đặt width và height cho ảnh để trang không bị giật khi tải.",
            "width là chiều ngang, height là chiều cao của phần tử.",
            "class dùng chung cho nhiều phần tử, còn id thì mỗi trang chỉ có một.",
            "Để định dạng cho một nhóm thẻ, các bạn đặt cùng một class cho chúng.",
            "Một form gồm nhiều ô input, và mỗi ô nên có một label đi kèm.",
            "Mỗi ô input nên có một dòng chữ để người dùng biết phải nhập gì.",
            "Bấm vào label thì con trỏ sẽ nhảy thẳng vào ô tương ứng.",
            "Một button nằm trong form sẽ mặc định gửi biểu mẫu đi khi bấm.",
            "Nhớ đặt loại cho từng button, nếu không nó sẽ gửi biểu mẫu ngoài ý muốn.",
            "Dữ liệu dạng hàng và cột thì dùng table, đừng dùng table để dàn trang.",
            "Một table chuẩn có phần đầu bảng, phần thân bảng và từng ô dữ liệu.",
            "header là phần đầu trang, thường chứa biểu tượng và thanh điều hướng.",
            "footer nằm cuối trang, chứa thông tin liên hệ và bản quyền.",
            "nav là vùng chứa các liên kết điều hướng chính.",
            "Mỗi section là một phần nội dung có chủ đề riêng.",
            "Dùng header và footer đúng chỗ thì trang dễ đọc hơn cho cả máy tìm kiếm.",
            "Trong section này, ta đặt ba thẻ sản phẩm nằm ngang nhau.",
            "Thanh điều hướng nav của chúng ta sẽ có bốn liên kết.",
            "CSS quyết định màu sắc, kích thước và vị trí của mọi thứ trên trang.",
            "Một selector chọn ra những phần tử mà quy tắc CSS sẽ áp vào.",
            "selector theo class bắt đầu bằng dấu chấm, theo id thì bắt đầu bằng dấu thăng.",
            "padding là khoảng đệm bên trong, nằm giữa nội dung và đường viền.",
            "margin là khoảng cách bên ngoài, đẩy các phần tử ra xa nhau.",
            "border là đường viền bao quanh phần tử.",
            "Nhiều bạn hay nhầm padding với margin, cứ nhớ một cái ở trong, một cái ở ngoài đường viền.",
            "Thêm một border mỏng màu xám, chiếc thẻ trông gọn gàng hẳn.",
            "flexbox giúp xếp các phần tử theo một hàng hoặc một cột rất dễ.",
            "Với flexbox, căn giữa một phần tử chỉ còn mất hai dòng.",
            "grid thì mạnh hơn khi bố cục có cả hàng lẫn cột.",
            "Lưới sản phẩm ba cột này mình dựng bằng grid.",
            "Thuộc tính display quyết định phần tử hiển thị theo kiểu nào.",
            "Muốn bật flexbox, ta đổi giá trị của display.",
            "position cho phép đặt phần tử ở một vị trí chính xác trên trang.",
            "Khi các phần tử đè lên nhau, z-index quyết định cái nào nằm trên.",
            "z-index chỉ có tác dụng với phần tử đã được đặt position.",
            "font là kiểu chữ, còn color là màu chữ.",
            "Chọn một font dễ đọc quan trọng hơn chọn một kiểu chữ thật cầu kỳ.",
            "Ta đổi color của tiêu đề sang màu xanh đậm.",
            "hover là trạng thái khi con chuột đang rê lên phần tử.",
            "Thêm hiệu ứng hover cho nút để người dùng biết nó bấm được.",
            "Một trang responsive tự co giãn cho vừa mọi kích thước màn hình.",
            "Để làm trang responsive, ta dùng media query.",
            "media query cho phép viết luật CSS riêng cho màn hình nhỏ.",
            "Trước khi bắt đầu viết bất cứ dòng CSS nào, các bạn hãy phác bố cục ra giấy, "
            "xác định phần nào dùng flexbox, phần nào dùng grid.",
            "Bài tập hôm nay là dựng một trang giới thiệu bản thân bằng HTML, có ảnh đại diện, "
            "một đoạn giới thiệu, và một danh sách liên kết tới các trang mạng xã hội.",
            "Mình muốn các bạn tập thói quen mở trang trên cả điện thoại lẫn máy tính, "
            "vì một trang không responsive là mất ngay một nửa số người xem.",
            "Khi một phần tử nằm lệch mà không hiểu vì sao, hãy bật đường viền tạm cho nó, "
            "thường là do margin hoặc padding đang lớn hơn ta tưởng.",
            "Nếu một ảnh thiếu alt, công cụ chấm điểm trang sẽ trừ điểm ngay.",
            "Mở file index lên, ta sẽ bắt đầu viết code ở đây.",
            "Đặt tên class sao cho đọc vào là hiểu ngay phần tử đó dùng để làm gì.",
            "Trong một trang, mỗi element đều nằm trong một element cha nào đó.",
            "Mình sẽ đặt cả ảnh và chữ vào chung một div cho dễ căn chỉnh.",
            "Với ô nhập mật khẩu, attribute type phải đặt là password.",
            "Mỗi tag mở ra thì phải nhớ đóng lại, không thì trang sẽ vỡ bố cục.",
            "Đổi color của nút khi hover là cách đơn giản nhất để trang sinh động hơn.",
            "Đường dẫn của mỗi image nên viết tương đối, để chuyển sang máy khác vẫn chạy.",
            "Trang hiện đẹp trên máy tìm kiếm là nhờ một thẻ meta mô tả viết tốt.",
            "Thẻ mở và thẻ đóng ghép lại thành một tag hoàn chỉnh.",
            "Muốn tô đậm một chữ mà không xuống dòng, ta bọc nó trong span.",
            "Biểu tượng và thanh điều hướng, ta đặt chung trong header.",
            "Phần giới thiệu dịch vụ sẽ nằm gọn trong một section.",
            "body là nơi chứa mọi thứ hiển thị trên trang.",
            "Riêng tấm ảnh này, mình chỉ đặt width, còn chiều cao để trình duyệt tự tính.",
            "height mà đặt cứng quá thì nội dung dài sẽ tràn ra ngoài.",
            "Khung thẻ sản phẩm sẽ mềm mại hơn nếu bo tròn góc của border.",
            "Viết CSS cho gọn, các bạn gom những selector giống nhau lại một chỗ.",
            "Cả trang chỉ nên dùng một hoặc hai font.",
        ],
    },
    {
        "khoa": "giang-cong-cu",
        "ten": "Giảng bài — công cụ, Git, HTTP",
        "dan": _DAN_GIANG,
        "lamMau": True,
        "tuAnh": True,
        "cau": [
            "Node.js cho phép chạy JavaScript ở ngoài trình duyệt.",
            "Cài Node.js xong, các bạn sẽ có luôn npm đi kèm.",
            "npm là kho thư viện khổng lồ, gõ một lệnh là cài được thư viện về.",
            "npx chạy một công cụ mà không cần cài hẳn vào máy.",
            "Ta dùng npx để tạo nhanh một dự án mới.",
            "Mọi thông tin của dự án nằm trong file package.json.",
            "package.json ghi lại tên dự án và danh sách thư viện đang dùng.",
            "Thư mục node_modules chứa toàn bộ thư viện đã cài, và nó rất nặng.",
            "Không bao giờ đẩy node_modules lên GitHub, vì nó rất nặng và cài lại được.",
            "Mở terminal lên, gõ lệnh cài đặt rồi nhấn phím Enter.",
            "Trong terminal, mỗi lệnh chạy xong sẽ trả về một dấu nhắc mới.",
            "VS Code là trình soạn thảo mà mình dùng trong suốt khoá học.",
            "Các bạn cài thêm extension Prettier để code tự định dạng khi lưu.",
            "ESLint sẽ gạch chân những chỗ code có khả năng gây lỗi.",
            "Mình bật cả Prettier lẫn ESLint cho mọi dự án.",
            "Mỗi extension nên cài có chọn lọc, cài nhiều quá thì máy sẽ chậm.",
            "Nhấn Ctrl cộng với phím S để lưu file.",
            "Gõ vài chữ đầu rồi nhấn Tab, VS Code sẽ tự điền phần còn lại.",
            "Giữ Ctrl rồi bấm vào tên hàm để nhảy tới chỗ khai báo.",
            "Nhấn Tab để thụt lề dòng code vào trong.",
            "Git là công cụ lưu lại lịch sử thay đổi của dự án.",
            "GitHub là nơi cất kho Git của bạn trên mạng.",
            "Mỗi commit là một lần chụp lại trạng thái của code.",
            "Viết lời nhắn commit rõ ràng để sau này đọc lại còn hiểu.",
            "push đẩy các commit từ máy bạn lên GitHub.",
            "pull thì ngược lại, kéo thay đổi mới nhất từ trên mạng về máy.",
            "Mỗi tính năng mới, mình tách ra làm trên một branch riêng.",
            "Làm xong trên branch đó, ta merge nó trở lại nhánh chính.",
            "merge xong mà có xung đột thì phải sửa tay từng chỗ.",
            "clone tải nguyên một kho từ GitHub về máy.",
            "Đầu buổi lab, các bạn clone repository của bài tập về trước.",
            "Một repository chứa toàn bộ code cùng với lịch sử thay đổi.",
            "Mọi người hay gọi tắt repository là repo.",
            "Mở repo của bạn lên và đọc file README trước tiên.",
            "README là trang giới thiệu dự án, ai vào cũng đọc nó đầu tiên.",
            "Muốn đóng góp vào dự án của người khác, ta mở một pull request.",
            "pull request giúp cả nhóm xem lại code trước khi gộp vào.",
            "localhost là chính máy tính của bạn, không đi ra ngoài mạng.",
            "Dự án đang chạy ở localhost, port ba nghìn.",
            "Mỗi port giống như một cánh cửa riêng cho từng chương trình.",
            "server nhận yêu cầu, xử lý, rồi trả kết quả về.",
            "client là phía người dùng, thường chính là trình duyệt.",
            "client gửi request, rồi chờ phía bên kia trả lời.",
            "Mỗi response đều kèm một mã status cho biết thành công hay thất bại.",
            "status hai trăm là thành công, bốn trăm lẻ bốn là không tìm thấy.",
            "HTTP là giao thức mà trình duyệt và máy chủ dùng để nói chuyện với nhau.",
            "HTTPS là HTTP có mã hoá, an toàn hơn rất nhiều.",
            "Ngày nay trang web nào cũng phải chạy HTTPS.",
            "URL là địa chỉ đầy đủ của một trang trên mạng.",
            "Nhìn vào URL, ta biết ngay trang đang dùng giao thức nào.",
            "method cho biết ta muốn làm gì với dữ liệu.",
            "GET dùng để lấy dữ liệu, POST dùng để gửi dữ liệu mới lên.",
            "Mặc định, mọi request mà trình duyệt gửi đi đều là GET.",
            "Đăng ký tài khoản thì phải dùng POST, vì ta đang tạo dữ liệu mới.",
            "Đổi method trong công cụ thử API rồi gửi lại xem sao.",
            "REST là cách thiết kế API phổ biến nhất hiện nay.",
            "Mỗi endpoint là một đường dẫn mà server mở ra cho ta gọi.",
            "Theo chuẩn REST, mỗi endpoint đại diện cho một loại dữ liệu.",
            "cookie là mẩu dữ liệu nhỏ mà trình duyệt tự gửi kèm mỗi request.",
            "Sau khi đăng nhập, server trả về một token.",
            "token phải được cất cẩn thận, lộ ra là người khác vào được tài khoản.",
            "Đăng nhập xong, token thường được lưu trong cookie.",
            "Lỗi CORS xảy ra khi trang gọi sang một tên miền khác mà không được phép.",
            "Gặp CORS thì phải sửa ở phía máy chủ, sửa ở trình duyệt không ăn thua.",
            "database là nơi cất dữ liệu lâu dài của ứng dụng.",
            "Mỗi lần người dùng đặt hàng, đơn hàng được ghi vào database.",
            "frontend là phần người dùng nhìn thấy, backend là phần chạy ở phía sau.",
            "Môn này tập trung vào frontend, phần backend mình sẽ học ở môn sau.",
            "Một lập trình viên full-stack làm được cả hai phía.",
            "Học vững frontend trước rồi mới lên full-stack là con đường an toàn.",
            "build gom toàn bộ code lại thành một bản gọn nhẹ để chạy thật.",
            "Chạy lệnh build xong, ta deploy thư mục kết quả lên mạng.",
            "deploy là đưa ứng dụng lên máy chủ để ai cũng truy cập được.",
            "Một bug là một chỗ chương trình chạy không như ta muốn.",
            "debug là quá trình đi tìm và sửa bug.",
            "Kỹ năng debug quan trọng không kém gì kỹ năng viết code.",
            "Viết test giúp ta biết code còn chạy đúng sau mỗi lần sửa.",
            "Chạy test trước khi nộp bài, đừng để thầy phát hiện lỗi thay mình.",
            "Nhấn phím F mười hai để mở DevTools ngay trên trình duyệt.",
            "Trong DevTools, tab Console hiện ra mọi lỗi của trang.",
            "Tab Network cho ta xem từng request mà trang đã gửi đi.",
            "Mở Network lên, các bạn sẽ thấy rõ API trả về những gì.",
            "Mình dùng Chrome cho mọi bài trong khoá học này.",
            "Chrome có bộ công cụ cho lập trình viên rất mạnh.",
            "Mỗi browser hiển thị trang hơi khác nhau một chút.",
            "Mở browser lên và gõ địa chỉ trang vào.",
            "website của chúng ta sẽ có ba trang chính.",
            "Một website tốt phải tải nhanh trên cả điện thoại.",
            "Gõ lệnh install để cài thư viện vào dự án.",
            "Lệnh npm install đọc package.json rồi tải đủ thư viện về.",
            "Mỗi script trong package.json là một lệnh tắt.",
            "Ta thêm một script mới để chạy dự án ở chế độ phát triển.",
            "Quy trình làm việc hằng ngày của mình rất đơn giản: sáng mở máy thì pull về, "
            "làm xong một phần nhỏ thì commit, cuối ngày thì đẩy hết lên cho cả nhóm cùng xem.",
            "Khi trang báo lỗi trắng xoá, việc đầu tiên không phải là sửa code lung tung, "
            "mà là mở DevTools lên, đọc lỗi trong Console thật chậm, rồi mới đoán nguyên nhân.",
            "Mỗi lần các bạn gõ một địa chỉ rồi nhấn Enter, trình duyệt đã âm thầm gửi đi một request, "
            "chờ server trả lời, rồi mới vẽ trang ra cho các bạn xem.",
            "push xong rồi thì các bạn vào GitHub kiểm tra lại nhé.",
            "Đừng quên commit trước khi chuyển sang branch khác.",
            "Sau khi deploy, các bạn nhớ mở trang thật lên và bấm thử mọi nút, "
            "vì chạy được ở máy mình chưa chắc đã chạy được trên mạng.",
            "Lần đầu dùng Git ai cũng sợ làm hỏng, nhưng các bạn cứ yên tâm, "
            "gần như mọi thứ đã commit rồi đều lấy lại được.",
            "Khi mở một dự án mới tải về, việc đầu tiên là đọc README, "
            "rồi chạy npm install, rồi mới tới chạy thử.",
            "Nếu thấy lỗi CORS, các bạn đừng vội sửa phần giao diện, "
            "vì vấn đề nằm ở cấu hình phía server.",
            "Một URL đầy đủ gồm giao thức, tên miền, đường dẫn và có khi có thêm tham số ở cuối.",
            "Dùng Node.js, các bạn có thể viết cả phần máy chủ bằng chính ngôn ngữ đã học.",
            "Mỗi lần thêm thư viện, npm sẽ tự cập nhật lại package.json.",
            "Nhấn tổ hợp phím Ctrl và dấu huyền để mở nhanh terminal trong VS Code.",
            "Mình hay tách ra một branch nhỏ, sửa xong mới merge vào.",
            "Đẩy code lên GitHub thường xuyên cũng là một cách sao lưu miễn phí.",
            "Trong ví dụ này, ứng dụng có một backend nhỏ viết bằng Node.js.",
            "Thầy sẽ chấm bài qua link repo mà các bạn nộp.",
            "Nhớ thêm node_modules vào danh sách bỏ qua trước lần commit đầu tiên.",
            "Mở Chrome lên, vào phần cài đặt rồi tìm extension mà mình vừa nói.",
            "Lệnh clone chỉ cần chạy đúng một lần cho mỗi repository.",
            "Một trang dùng HTTP thường sẽ bị trình duyệt đánh dấu là không an toàn.",
            "Đường dẫn tới mỗi endpoint đều nằm trong tài liệu của API.",
            "Mọi thay đổi của các bạn đều được lưu lại trong Git.",
            "Commit xong rồi thì nhớ push lên ngay, đừng để dồn tới cuối tuần.",
            "Trình duyệt mà các bạn dùng hằng ngày chính là một client.",
            "Máy chủ xử lý xong sẽ gửi lại một response.",
            "Các bạn chép nguyên URL rồi dán vào ô địa chỉ.",
            "API của dự án này được thiết kế theo kiểu REST.",
            "Trang gọi sang tên miền khác thì máy chủ phải cho phép CORS.",
            "backend nhận dữ liệu, kiểm tra kỹ, rồi mới ghi vào database.",
            "full-stack nghĩa là làm được cả giao diện lẫn phần máy chủ.",
            "Trước khi nộp bài, các bạn chạy thử lệnh build.",
            "Ngồi đoán mò thì lâu lắm, mở công cụ ra mà debug.",
            "Code chạy được rồi chưa chắc đã không có bug.",
            "Mỗi hàm quan trọng nên có ít nhất một test.",
            "Request nào báo đỏ thì mở tab Network ra xem.",
            "Trang này phải chạy tốt trên mọi browser.",
            "Cuối khoá, mỗi bạn sẽ có một website của riêng mình.",
            "Prettier tự căn lề, tự thêm dấu chấm phẩy mỗi khi các bạn lưu file.",
            "Form đăng ký sẽ gửi dữ liệu bằng method POST.",
            "POST thì gửi dữ liệu nằm trong phần thân của request.",
        ],
    },
]

KICH_BAN.extend(KICH_BAN_GIANG)


# ══════════════════════════════════════════════════════════
#  MỤC "ĐỌC TIẾNG ANH" — giọng mẫu sạch cho máy nhân bản giọng tiếng Anh
# ══════════════════════════════════════════════════════════
#
# Thêm 14/10/2026. Câu THUẦN tiếng Anh, giảng bài lập trình web / React /
# JavaScript — đúng kiểu câu sẽ cần ở video bài giảng bản tiếng Anh.
#
# ── VÌ SAO CÓ MỤC NÀY ──
#
# Các mục `giang-*` là câu tiếng Việt xen thuật ngữ — dạy F5 tiếng Việt đọc
# "useState". Mục này phục vụ MỘT MÔ HÌNH KHÁC: máy nhân bản giọng tiếng Anh
# (Chatterbox — `chatterbox_en.py` — hoặc F5 bản tiếng Anh). Máy đó chép
# CHẤT GIỌNG từ đoạn mẫu, còn PHÁT ÂM là của chính mô hình. Nên đoạn mẫu
# không cần giọng bản xứ — nó cần SẠCH: đủ chữ, không vấp, không ồn, nhịp
# đều. Đọc chậm theo mẫu 🔊 là đủ.
#
# ⚠️ KHÔNG ĐI VÀO BỘ DỮ LIỆU F5 TIẾNG VIỆT. `xuong.py` xuất mục `tiengAnh`
# ra thư mục RIÊNG (`xuat-anh/`) — trộn câu thuần Anh vào finetune tiếng
# Việt là dạy model nói tiếng Việt bằng âm tiếng Anh.
#
# ── LUẬT VIẾT CÂU ──
#
# · Chỉ ASCII cơ bản + dấu câu thường (. , ? ! : ') — KHÔNG nháy cong, KHÔNG
#   gạch dài, KHÔNG chữ số (Whisper viết "3" hay "three" tuỳ hứng, chấm khớp
#   chữ sẽ lệch). Kiểm bằng `kiem_ascii()` bên dưới.
# · Tránh "thanks for watching": đúng câu bịa kinh điển của Whisper, bộ lọc
#   `hallucination.ts` sẽ chặn luôn bản đọc thật.
# · Tránh "okay/OK", "oops": Whisper viết mỗi lần một kiểu.
# · Câu 6–26 từ ≈ 3–12 giây ở tốc độ đọc chậm (~2,3 từ/giây). Có câu kể,
#   câu hỏi, câu nhấn mạnh, liệt kê, mở đầu và kết bài — model chép ngữ điệu
#   từ mẫu, thiếu câu hỏi thì giọng Anh hỏi cũng như kể.
#
# ⚠️ ID ỔN ĐỊNH: `anh-NNN` theo vị trí — thêm câu thì thêm vào CUỐI.

_DAN_ANH = (
    "Câu THUẦN tiếng Anh. Trước khi thu: bấm 🔊 Nghe mẫu cả câu (bấm lại trong "
    "4 giây nghe chậm hơn), chưa chắc thì 🐢 nghe từng cụm. Đọc CHẬM, RÕ, đủ "
    "từng chữ, ngắt ở dấu phẩy. KHÔNG cần giọng bản xứ — máy chỉ chép CHẤT "
    "GIỌNG của anh, phát âm do mô hình lo. Vấp hay đọc sót chữ thì bấm R thu lại."
)

KICH_BAN_ANH: List[Muc] = [
    {
        "khoa": "anh",
        "ten": "Đọc tiếng Anh — giọng mẫu",
        "dan": _DAN_ANH,
        "lamMau": True,
        "tiengAnh": True,
        "cau": [
            # ── Mở đầu ──
            "Hello everyone, and welcome back to the channel.",
            "In this lesson, we will build a small counter with React.",
            "Today we are going to learn how the browser turns code into a web page.",
            "Before we start, make sure you have Node and a code editor installed on your computer.",
            "Alright, let's get started with the first example.",
            "Here is the plan for this video.",
            # ── Giải thích (câu kể) ──
            "React is a library for building user interfaces.",
            "A component is just a function that returns some markup.",
            "Props are the values that a parent passes down to its children.",
            "State is data that can change over time inside a component.",
            "When the state changes, React renders the component again.",
            "We use the useState hook to keep track of the current count.",
            "The browser reads the HTML first, and then it applies the CSS.",
            "JavaScript is the language that makes a web page interactive.",
            "An array is simply an ordered list of values.",
            "Each item in the list needs a unique key.",
            "A function takes some input and gives back a result.",
            "The fetch function sends a request to the server and waits for the response.",
            "If the request fails, we show a friendly error message to the user.",
            "This line creates a new variable called total.",
            "We store the name in a constant, because it never changes.",
            # ── Thao tác ──
            "Now let's open the terminal and run the project.",
            "Type npm install in the terminal and press Enter.",
            "Wait a few seconds while the packages are downloaded.",
            "Open your browser and go to localhost.",
            "You should see a button in the middle of the page.",
            "Click the button, and the number goes up by one.",
            # ── Câu hỏi ──
            "So what exactly is a component in React?",
            "Why do we need state at all?",
            "What happens if we forget the key?",
            "Can you guess what this code will print?",
            "Have you ever wondered how a website remembers who you are?",
            "Does that make sense to you so far?",
            "Which one do you think is faster?",
            "Where should we put this logic, in the parent or in the child?",
            "Did you notice the small warning in the console?",
            "Is there a simpler way to write this?",
            # ── Nhấn mạnh ──
            "This is the most important rule in the whole lesson.",
            "Never change the state directly. Always use the setter function.",
            "Please don't skip this part, it will save you hours of debugging later.",
            "Remember, the code runs from top to bottom.",
            "That is a really common mistake, so watch out for it.",
            "It works! And it only took a few lines of code.",
            "Be careful here, the order of these two lines really matters.",
            "Now, this is where it gets interesting.",
            # ── Liệt kê ──
            "We need three things: a button, a counter, and a function to update it.",
            "HTML gives the structure, CSS gives the style, and JavaScript gives the behavior.",
            "First we write the code, then we test it, and finally we fix the bugs.",
            "There are four steps: install, import, configure, and run.",
            "You can store strings, numbers, booleans, arrays, and objects.",
            "Let's review: components, props, state, and effects.",
            # ── Câu dài (mẫu tham chiếu 8–12 giây) ──
            "If you look closely at this function, you will see that it returns a new array instead of changing the old one.",
            "A good habit is to give every variable a clear name, so that anyone who reads your code later can understand it quickly.",
            "When you build a real project, you will spend more time reading code than writing it, so readability really matters.",
            "The effect runs after the component appears on the screen, which makes it a good place to load data from an API.",
            "Instead of copying the same code into three different places, we move it into one function and call it whenever we need it.",
            "Don't worry if this feels confusing right now, because we will come back to it with a simpler example.",
            "Notice that we never touch the page directly, we only describe what it should look like, and React takes care of the rest.",
            "If the list is empty, we show a short message instead, so the user always knows what is going on.",
            # ── Chuyển ý ──
            "Now that we understand the idea, let's write some code.",
            "Let me show you what I mean.",
            "Let's take a quick look at the result.",
            "Let's pause here for a moment and think about it.",
            "Next, we will add some style to make it look nicer.",
            "Let's move on to the next part.",
            "Let's run it one more time and see what happens.",
            # ── Gỡ lỗi ──
            "Wait, something went wrong. Let's read the error message together.",
            "The error says that the variable is not defined.",
            "We forgot to export the component, so the import fails.",
            "After fixing that line, the page loads without any errors.",
            # ── Kết bài ──
            "That's all for today's lesson, great job.",
            "In the next video, we will learn how to fetch data from a real API.",
            "Try to build this counter on your own before you watch the solution.",
            "If you have any questions, leave a comment below.",
            "Thank you so much, and see you in the next lesson.",
            "Good luck with your project, and happy coding!",
        ],
    },
]

KICH_BAN.extend(KICH_BAN_ANH)

# Ký tự được phép trong mục `tiengAnh`. Hẹp CÓ CHỦ Ý: nháy cong / gạch dài
# lọt vào từ trình soạn thảo là chấm khớp chữ lệch và bộ tách cụm 🐢 vỡ.
_ASCII_ANH = set(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,?!:'"
)


def kiem_ascii() -> Dict[str, List[str]]:
    """Ký tự NGOÀI bộ cho phép trong các mục `tiengAnh`. Rỗng = sạch."""
    sai: Dict[str, List[str]] = {}
    for m in KICH_BAN:
        if not m.get("tiengAnh"):
            continue
        for i, c in enumerate(m["cau"]):
            x = sorted({ch for ch in c if ch not in _ASCII_ANH})
            if x:
                sai[f"{m['khoa']}-{i:03d}"] = x
    return sai


# Thuật ngữ tiếng Anh của các mục `giang-*`. KHOÁ PHẢI KHỚP `TU_ANH` trong
# frontend/src/components/admin/xuongTuDien.ts (bên đó giữ IPA + cách đọc).
TU_ANH: List[str] = [
    # React / FER202
    "React", "JSX", "component", "props", "state", "useState", "useEffect", "useContext", "useRef",
    "useReducer", "useMemo", "useCallback", "useNavigate", "useParams", "hook", "render", "Redux",
    "store", "reducer", "action", "dispatch", "Router", "Route", "Link", "Outlet", "Provider",
    "Context", "children", "Bootstrap", "React-Bootstrap", "Navbar", "Card", "Modal", "Container",
    "Vite", "Virtual DOM", "Suspense", "lazy", "key", "onClick", "onChange", "onSubmit", "Next.js",
    "TypeScript", "export default", "spread", "destructuring", "arrow function", "template literal",
    # JavaScript
    "JavaScript", "const", "let", "var", "function", "return", "async", "await", "Promise", "fetch",
    "then", "catch", "try", "array", "object", "map", "filter", "reduce", "forEach", "event",
    "click", "DOM", "querySelector", "addEventListener", "getElementById", "console.log",
    "setTimeout", "callback", "string", "number", "boolean", "null", "undefined", "true", "false",
    "JSON", "API", "import", "export", "module", "closure", "scope", "hoisting", "event loop",
    "localStorage", "length", "index", "value", "if", "else", "for", "loop", "textContent",
    "innerHTML",
    # HTML
    "HTML", "element", "tag", "attribute", "div", "span", "href", "src", "alt", "image", "class",
    "id", "form", "input", "button", "label", "table", "header", "footer", "nav", "section", "head",
    "body", "meta", "width", "height",
    # CSS
    "CSS", "padding", "margin", "border", "flexbox", "grid", "display", "position", "selector",
    "media query", "responsive", "viewport", "font", "color", "hover", "z-index",
    # Web, công cụ, Git
    "Node.js", "npm", "npx", "axios", "package.json", "node_modules", "terminal", "VS Code", "Git",
    "GitHub", "commit", "push", "pull", "branch", "merge", "clone", "repository", "repo",
    "pull request", "README", "localhost", "port", "server", "client", "request", "response",
    "HTTP", "HTTPS", "URL", "cookie", "token", "endpoint", "REST", "CORS", "database", "frontend",
    "backend", "full-stack", "deploy", "build", "debug", "bug", "test", "DevTools", "Console",
    "Network", "Chrome", "browser", "website", "install", "script", "extension", "Prettier",
    "ESLint", "Ctrl", "Tab", "status", "method", "GET", "POST", "code", "file",
]


_LA_CHU = re.compile(r"[^\W]", re.UNICODE)  # chữ (cả chữ có dấu), số, gạch dưới
_TU_DAI_TRUOC = sorted(TU_ANH, key=len, reverse=True)


def tu_anh_trong(cau: str) -> List[str]:
    """Thuật ngữ tiếng Anh có trong câu, theo thứ tự xuất hiện, không trùng.

    Không phân biệt hoa thường; ưu tiên từ DÀI trước ("React-Bootstrap"
    trước "React", "package.json" trước "JSON", "event loop" trước
    "event"); hai bên từ không được dính chữ/số — "state" trong "useState"
    không tính. CÙNG LUẬT với `tachCau()` ở xuongTuDien.ts, để chữ được tô
    màu trên màn hình đúng là chữ được chấm.
    """
    thuong = cau.lower()
    da_dung = [False] * len(cau)
    trung: List[tuple] = []
    for k in _TU_DAI_TRUOC:
        kt = k.lower()
        i = thuong.find(kt)
        while i >= 0:
            j = i + len(kt)
            truoc = cau[i - 1] if i > 0 else ""
            sau = cau[j] if j < len(cau) else ""
            bien = not (truoc and _LA_CHU.match(truoc)) and not (sau and _LA_CHU.match(sau))
            if bien and not any(da_dung[i:j]):
                for x in range(i, j):
                    da_dung[x] = True
                trung.append((i, k))
            i = thuong.find(kt, i + 1)
    ra: List[str] = []
    for _, k in sorted(trung):
        if k not in ra:
            ra.append(k)
    return ra


def kiem_vocab(duong_vocab: str) -> Dict[str, List[str]]:
    """Ký tự nào của các mục `giang-*` / `anh` KHÔNG có trong vocab của checkpoint.

    Rỗng = an toàn. Chạy trên máy nhà:
        python -c "import kichban; print(kichban.kiem_vocab('/home/Cuong03dx/f5-train/nen/hynt_vocab.txt'))"
    """
    with open(duong_vocab, encoding="utf-8") as f:
        vocab = set(f.read().split("\n"))
    thieu: Dict[str, List[str]] = {}
    for m in KICH_BAN:
        if not (m.get("tuAnh") or m.get("tiengAnh")):
            continue
        for i, c in enumerate(m["cau"]):
            x = sorted({ch for ch in c if ch not in vocab})
            if x:
                thieu[f"{m['khoa']}-{i:03d}"] = x
    return thieu


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
                    # Chỉ mục giảng bài mới có — màn hình thu hiện nút nghe
                    # mẫu cho từng từ, và backend chấm Whisper từng từ.
                    **({"tuAnh": tu_anh_trong(cau)} if muc.get("tuAnh") else {}),
                    # Câu thuần tiếng Anh — nút nghe mẫu cả câu + chấm Whisper `en`.
                    **({"tiengAnh": True} if muc.get("tiengAnh") else {}),
                }
            )
    return ra


def uoc_giay(cau: str, anh: bool = False) -> float:
    """Ước thời lượng đọc một câu, tính bằng giây.

    ⚠️ 3,2 âm tiết/giây, KHÔNG PHẢI 4,5.

    Bản đầu của hàm này lấy 4,5 — tốc độ nói chuyện nhanh — và không cộng
    khoảng lặng hai đầu. Nó báo cả kịch bản chỉ 8,7 phút, trong khi thật
    ra là 13. Sai gần một nửa, và sai theo hướng nguy hiểm nhất: nó khiến
    kịch bản trông như đã đủ dữ liệu trong khi còn thiếu.

    Đọc diễn cảm chậm hơn nói chuyện, có ngắt ở dấu phẩy, và mỗi đoạn thu
    còn 0,3 giây đệm hai đầu sau khi cắt lặng.

    Trong tiếng Việt mỗi âm tiết viết rời một từ, nên đếm từ = đếm âm tiết.

    Câu tiếng Anh (`anh=True`) thì KHÔNG: một từ Anh ~1,4 âm tiết, và người
    không quen đọc chậm hơn nữa — lấy ~2,3 từ/giây (~140 từ/phút, nhịp đọc
    bài giảng chậm).
    """
    if anh:
        return len(cau.split()) / 2.3 + 0.3
    return len(cau.split()) / 3.2 + 0.3


def tom_tat() -> Dict[str, object]:
    tong = sum(len(m["cau"]) for m in KICH_BAN)
    giay = sum(uoc_giay(c, bool(m.get("tiengAnh"))) for m in KICH_BAN for c in m["cau"])
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
                "tuAnh": bool(m.get("tuAnh")),
                "tiengAnh": bool(m.get("tiengAnh")),
                "uocPhut": round(sum(uoc_giay(c, bool(m.get("tiengAnh"))) for c in m["cau"]) / 60, 1),
                # Đoạn ≥ 30 âm tiết (~9 giây) mới dùng được làm mẫu tham
                # chiếu: F5-TTS chép ngữ điệu tốt nhất ở mẫu 5-15 giây, và
                # một câu 3 giây không đủ chỗ cho một đường ngữ điệu.
                # Câu Anh: ≥ 20 từ ≈ 9 giây ở nhịp đọc chậm.
                "soDai": sum(
                    1 for c in m["cau"] if len(c.split()) >= (20 if m.get("tiengAnh") else 30)
                ),
            }
            for m in KICH_BAN
        ],
    }
