# TÀI LIỆU HỆ THỐNG: TRENDFLOW (CONTRACT PROJECT)
> **Mục đích:** Tài liệu ghi chú toàn bộ nghiệp vụ, kiến trúc kỹ thuật và kịch bản phỏng vấn của dự án **TrendFlow**.  
> **Nguyên tắc:** Bịa có cơ sở kỹ thuật thực tế 100%, đúng nghiệp vụ ngành Media, không chém gió viển vông, tự nhiên và logic.

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

* **Tên dự án:** TrendFlow (Contract Project / Dự án nhận thầu trọn gói).
* **Khách hàng:** Một đơn vị truyền thông số (Digital Media Agency) chuyên sản xuất nội dung video ngắn (Shorts / Reels / TikTok) cho thị trường quốc tế.
* **Quy mô team (4 người):**
  1. **Technical Project Lead (Ông anh sếp cũ):** Đứng ra nhận hợp đồng thầu, làm việc với khách, quản lý tiến độ và kiêm phụ trách hạ tầng/khung sườn.
  2. **Hiếu (Backend Developer / Kỹ sư chính):** Gánh toàn bộ core backend: API NestJS, pipeline quét kênh, chống bot, tích hợp AI, xử lý video và database.
  3. **1 Frontend Developer:** Code giao diện Dashboard nội bộ cho nhân viên Media sử dụng.
  4. **1 Content Ops:** Nhân sự của bên khách hàng, trực tiếp vận hành kịch bản và kiểm duyệt video.
* **Triết lý cốt lõi:** **Bán tự động hóa quy trình (Semi-automated Workflow Copilot)**.  
  * Không làm tool spam vô tội vạ.
  * Hệ thống tự động hóa 80% công việc chân tay (săn tin đêm, tải file, viết sườn bài, làm sub).
  * Con người (Editor) giữ vai trò 20% quyết định thẩm mỹ và kiểm duyệt cuối cùng.
  * **Hiệu quả thực tế:** Giúp 1 team biên tập viên tăng năng suất từ **2–3 video/ngày lên 4–5 video/ngày** một cách nhẹ nhàng.

---

## 2. NỖI ĐAU CỦA KHÁCH HÀNG (CORE PAIN POINT)

Tại sao khách hàng phải bỏ tiền ra thuê làm TrendFlow?
1. **Lệch múi giờ (Time Zone Gap):** Kênh đối thủ và thị trường mục tiêu ở Mỹ/Châu Âu (lệch 11–14 tiếng). Đối thủ đăng bài lúc 8h tối (giờ vàng của họ) thì ở VN đang là **3–4 giờ sáng**. Sáng 9h nhân viên đến công ty thì trend đã nguội, mất sạch lượng view tìm kiếm ban đầu.
2. **Theo dõi thủ công quá mệt mỏi:** Nhân viên phải mở hàng chục tab F5 liên tục, vừa dễ sót tin, vừa không thể thức đêm 24/7.
3. **Thao tác lặp đi lặp lại tốn thời gian:** Mỗi video ngắn đều phải dựng theo khung Template cố định của kênh (logo, màu nền), việc tải file, gõ phụ đề, lồng tiếng ngốn mất 2–3 tiếng/video của Editor.

---

## 3. CHI TIẾT 2 MODULE CHÍNH CỦA HỆ THỐNG

### 📦 MODULE 1: GIÁM SÁT XU HƯỚNG 24/7 (TREND MONITORING)

Module này giải quyết bài toán: **Thay con người túc trực 24/7 để không bị trễ trend vì lệch múi giờ.**

#### Chức năng 1.1: Quản lý danh sách theo dõi (Watchlist)
* **Nhập kênh cụ thể:** Nhân viên Media paste link kênh đối thủ (YouTube Channel, TikTok Profile) ➔ Hệ thống bóc `channel_id`, lưu vào danh sách.
* **Phân loại ngách (Category):** Gắn thẻ kênh theo ngách (ví dụ: `Thú cưng`, `Hài hước`, `Xe cộ`...).
* **Tìm kiếm kênh mới (Discovery Search):** Nhập từ khóa ngách ➔ Hệ thống tìm kiếm trên YouTube/TikTok để gợi ý các kênh có video Shorts đang lên view đều đặn ➔ Bấm 1 nút để thêm vào theo dõi.
* **Cài đặt tần suất quét:** Cho phép chọn chu kỳ quét (`15 phút`, `30 phút`, `1 tiếng`).

#### Chức năng 1.2: Lập lịch quét ngầm & Phát hiện bài mới (Scheduled Polling Worker)
* **Cơ chế kỹ thuật:** Chạy 1 Cron Job định kỳ mỗi 5–15 phút trong NestJS.
* Quét cơ sở dữ liệu tìm các kênh đã đến hạn quét (`NOW() - last_scanned_at >= scan_interval`).
* Truy cập trang Shorts của đối thủ, bóc danh sách video mới nhất.
* Đối chiếu `video_id` với Database:
  * Nếu đã có ➔ Bỏ qua.
  * Nếu chưa có (video mới đăng) ➔ Đánh dấu là bài mới và chuyển sang khâu tải nguyên liệu.

#### Chức năng 1.3: Chống chặn bot & Quản lý Proxy (Anti-bot Mitigation)
* Tích hợp **Antidetect API (như GoLogin / Hidemyacc API)** để điều khiển profile trình duyệt sạch.
* Cấu hình **Rotating Proxy** theo phiên quét để không bị YouTube/Cloudflare chặn IP hay dính Captcha khi quét hàng trăm kênh liên tục.

#### Chức năng 1.4: Lọc rác & Tải video gốc (Filtering & Raw Asset Downloader)
* **Bộ lọc rác:** Chỉ bắt video dạng ngắn (Shorts / dưới 60 giây) đăng trong vòng 24h; bỏ qua livestream hoặc video dài.
* **Tải video:** Bắt luồng tải video gốc HD không dính logo mờ (tích hợp `yt-dlp` vào backend).
* **Quản lý ổ cứng:** Thiết lập cơ chế tự dọn dẹp (Auto-cleanup) tự xóa file video thô sau 7 ngày để tránh đầy bộ nhớ server.

#### Chức năng 1.5: Đào sâu từ khóa & Tìm kiếm bổ sung (Search Context Expansion)
* Trích xuất từ khóa chính từ tiêu đề video đối thủ.
* Tự động tìm kiếm thời gian thực trên Google/YouTube để thu thập thêm các bài báo, bài viết liên quan đến sự việc đó ➔ Giúp biên tập viên nắm được bối cảnh đầy đủ của câu chuyện.

---

### 🎨 MODULE 2: HỖ TRỢ SÁNG TẠO & DỰNG TIMELINE (CREATIVE COPILOT)

Module này giải quyết bài toán: **Chuẩn bị sẵn 80% nguyên liệu để Editor chỉ mất 2 phút chốt video.**

#### Chức năng 2.1: Tóm tắt & Gợi ý kịch bản bằng AI
* Đưa transcript video và thông tin tìm kiếm được qua **Gemini API** (bên khách hàng cấp API key).
* Ép AI trả về JSON có cấu trúc gồm:
  * Tóm tắt ngắn 3–4 câu ngọn ngành câu chuyện.
  * 3 phương án giật tít (Hooks) thu hút người xem.
  * Dàn ý kịch bản kể chuyện bằng tiếng Việt phù hợp với video ngắn (dưới 60 giây).

#### Chức năng 2.2: Tạo giọng đọc (TTS) & Phụ đề tự động (Subtitles)
* Gọi API Text-to-Speech (như Google TTS / ElevenLabs) tạo ra file audio giọng đọc tiếng Việt theo kịch bản vừa duyệt.
* Tự động sinh file phụ đề (`.srt`) khớp chính xác từng mili-giây theo nhịp nói của file audio.

#### Chức năng 2.3: Xuất cấu trúc Dự án Timeline (CapCut / Jianying Draft Export — Điểm đắt giá nhất!)
* Thay vì render cứng video mà không cho con người chỉnh sửa:
* Hệ thống tự động tạo ra file cấu trúc **CapCut Draft JSON (`draft_content.json`)** đã xếp sẵn các layer:
  1. Khung nền Template (khung trên, khung dưới, logo kênh).
  2. File Audio giọng đọc đã canh giờ trên timeline.
  3. File Phụ đề chữ đã canh đúng nhịp nói.
  4. File video gốc vừa tải về nằm sẵn trong project.
* **Biên tập viên (Editor con người) làm gì?**
  * Mở CapCut trên máy tính lên ➔ Project đã dựng sẵn 90%.
  * Dùng chuột kéo clip gốc đến đúng **15–20 giây đắt giá nhất** (đoạn con mèo kêu, đoạn hài hước nhất) cho khớp với giọng đọc.
  * Bấm Export là có ngay video xịn sò!

#### Chức năng 2.4: Render tự động bằng FFmpeg (Fast Track)
* Với các tin ngắn/tin vắn đơn giản không cần chỉnh tay: Hệ thống có script FFmpeg chạy ngầm (`overlay`, `scale`, `drawtext`) ghép thẳng ra file `.mp4` trong 30 giây để duyệt nhanh.

---

## 4. BẢNG TỔNG HỢP CÔNG NGHỆ SỬ DỤNG (TECH STACK)

| Thành phần | Công nghệ sử dụng | Mục đích |
| :--- | :--- | :--- |
| **Backend Core** | NestJS, TypeScript | Xây dựng API, quản lý logic nghiệp vụ, module hóa hệ thống |
| **Lập lịch quét** | `@nestjs/schedule` (Cron) | Chạy ngầm quét kênh định kỳ theo tần suất |
| **Cào dữ liệu & Chống bot** | Playwright, Antidetect API, Proxy | Giả lập trình duyệt, vượt cơ chế chặn bot của nền tảng |
| **Tải video** | `yt-dlp` script | Bắt link và tải video gốc chất lượng cao |
| **Cơ sở dữ liệu** | PostgreSQL, Redis | Lưu danh sách kênh, metadata video, cache trạng thái quét |
| **Trí tuệ nhân tạo (AI)** | Gemini API (Google Cloud) | Tóm tắt thông tin, gợi ý tiêu đề và dàn ý kịch bản |
| **Xử lý âm thanh & video** | FFmpeg, TTS API | Lồng tiếng, chạy phụ đề, ghép video vào khung template |
| **Định dạng Timeline** | CapCut Draft JSON format | Xuất project dựng sẵn cho Editor tinh chỉnh |

---

## 5. KỊCH BẢN ĐỐI ĐÁP PHỎNG VẤN (CHEAT SHEET)

### Q1: "TrendFlow là dự án gì thế em?"
> *"Dạ, TrendFlow là một công cụ tự động hóa nội bộ (Internal Tool) nhận thầu cho một đơn vị Media. Họ làm nội dung cho thị trường nước ngoài nên bị bài toán **lệch múi giờ**: đối thủ đăng bài lúc nửa đêm giờ VN thì sáng nhân viên mới dậy xem, trend đã nguội mất.  
> Team em 4 người xây dựng hệ thống này để tự động quan sát kênh đối thủ 24/7, phát hiện bài mới trong đêm, dùng AI tóm tắt thông tin và lên sẵn dàn ý kịch bản, đồng thời dựng sẵn khung timeline trong CapCut để sáng ra Editor chỉ mất 2 phút chốt đoạn cắt đẹp nhất là xuất bản được ngay."*

### Q2: "Vai trò cụ thể của em trong team là gì?"
> *"Dạ dự án có một anh Technical Project Lead đứng ra nhận thầu và quản lý chung. Em là **Backend Developer** gánh toàn bộ phần kỹ thuật: viết API NestJS, xây dựng pipeline cào dữ liệu qua Antidetect API, tích hợp Gemini AI và xử lý ghép video bằng FFmpeg."*

### Q3: "AI trong hệ thống này tự động làm được những gì? Có tự tạo được video không?"
> *"Dạ hệ thống được thiết kế theo mô hình **Bán tự động (Semi-automated)** chứ không để AI tự làm 100%. AI rất giỏi khâu tóm tắt và lên dàn ý kịch bản, nhưng AI không thể có cảm xúc hay gu thẩm mỹ để biết đoạn nào trong video là đoạn hài hước hay đắt giá nhất.  
> Vì vậy, hệ thống tự động chuẩn bị sẵn 80% khâu chân tay (kịch bản, lồng tiếng, phụ đề, khung template), còn việc chọn đoạn cắt đắt giá nhất vẫn do mắt của Editor kiểm duyệt. Nhờ đó, sản lượng của team tăng từ **2–3 video lên 4–5 video/ngày** mà chất lượng vẫn đảm bảo ạ."*

### Q4: "Dự án này làm xong chưa và sao em lại nghỉ?"
> *"Dạ dự án đã hoàn thành, nghiệm thu và bàn giao xong xuôi cho đối tác từ cuối tháng 10. Sau khi hoàn thành hợp đồng thầu, em muốn tìm kiếm một bến đỗ chính thức lâu dài ở một công ty Product hoặc Software House lớn tại Hà Nội ở vị trí Senior Backend ạ."*

### Q5: "Cú bắt cầu sang SAPP LMS (Kéo sếp về sân nhà):"
> *"TrendFlow là dự án thầu quy mô nhỏ tập trung vào bài toán tự động hóa quy trình. Còn nếu xét về **chiều sâu kiến trúc hệ thống, quy mô lớn 20.000 người dùng và các bài toán Enterprise** thì dự án em tâm đắc và gắn bó lâu nhất là **SAPP LMS** với hệ thống Phân quyền đa cấp RBAC và luồng tính điểm thi bất đồng bộ bằng Kafka/SQS ạ."*

