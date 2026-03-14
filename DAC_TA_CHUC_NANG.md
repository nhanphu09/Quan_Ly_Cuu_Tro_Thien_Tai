# ĐẶC TẢ CHI TIẾT CHỨC NĂNG HỆ THỐNG (DỰA TRÊN SƠ ĐỒ MỚI)
**Tên dự án:** Hệ thống Quản Lý Cứu Trợ Thiên Tai

---

## 1. Phân hệ Quản lý người dùng
Phân hệ này đảm bảo việc quản lý quyền truy cập và thông tin của người dùng trong hệ thống.
*   **Đăng nhập:** Người dùng truy cập vào hệ thống cấp quyền.
*   **Đăng xuất:** Kết thúc phiên làm việc của người dùng.
*   **Chỉnh sửa thông tin cá nhân:** Cập nhật các thông tin cơ bản của tài khoản đang đăng nhập (tên, số điện thoại, địa chỉ...).
*   **Đổi mật khẩu:** Cập nhật mật khẩu mới để bảo mật tài khoản.
*   **Thêm người dùng:** Admin có thể tạo tài khoản cho người dùng mới.
*   **Sửa người dùng:** Admin cập nhật thông tin và quyền hạn của người dùng khác.
*   **Xóa người dùng:** Admin xóa hoặc vô hiệu hóa tài khoản rời khỏi hệ thống.

## 2. Phân hệ Quản lý chiến dịch cứu trợ
Quản lý các đợt phát động cứu trợ đang và sẽ diễn ra.
*   **Tạo chiến dịch cứu trợ:** Khởi tạo chiến dịch mới với thông tin chi tiết (tên, mục tiêu, thời gian).
*   **Cập nhật chiến dịch:** Chỉnh sửa thông tin hoặc trạng thái của chiến dịch đang diễn ra.
*   **Xóa chiến dịch:** Hủy bỏ chiến dịch khi có sai sót hoặc không còn cần thiết.
*   **Xem danh sách chiến dịch:** Hiển thị tất cả các chiến dịch cứu trợ có trong hệ thống.
*   **Theo dõi tiến độ chiến dịch:** Xem báo cáo cập nhật tình hình thực tế, tỷ lệ đạt mục tiêu của chiến dịch.

## 3. Phân hệ Quản lý vật tư cứu trợ
Quản lý luồng hàng hóa, nhu yếu phẩm được ủng hộ.
*   **Thêm vật tư:** Ghi nhận vật tư mới (mì tôm, nước sạch, thuốc men...) vào hệ thống.
*   **Cập nhật vật tư:** Chỉnh sửa số lượng, tình trạng của vật tư.
*   **Xóa vật tư:** Loại bỏ danh mục vật tư hỏng, quá hạn hoặc xuất nhầm.
*   **Kiểm tra tồn kho:** Thống kê tổng lượng vật tư hiện tại trong kho để phân phối hợp lý.

## 4. Phân hệ Quản lý quyên góp
Ghi nhận và minh bạch hóa luồng tiền và hiện vật ủng hộ từ các nhà hảo tâm.
*   **Quyên góp tiền:** Cho phép người dùng ủng hộ bằng tiền thông qua các cổng thanh toán/chuyển khoản.
*   **Quyên góp vật tư:** Ghi nhận sự ủng hộ bằng hiện vật cụ thể gửi đến các điểm tiếp nhận.
*   **Xem danh sách quyên góp:** Hiển thị công khai hoặc nội bộ danh sách những người đã và đang quyên góp.
*   **Xác nhận quyên góp:** Admin hoặc người phụ trách xác nhận đã nhận được tiền/vật tư từ nhà hảo tâm.

## 5. Phân hệ Quản lý báo cáo và thống kê
Cung cấp cái nhìn tổng quan về hiệu quả hoạt động để đưa ra các quyết định điều hành.
*   **Thống kê chiến dịch cứu trợ:** Phân tích số lượng, và trạng thái thành công/thất bại của các chiến dịch.
*   **Thống kê quyên góp:** Tổng hợp tổng số tiền, vật tư nhận được theo thời gian hoặc chiến dịch.
*   **Thống kê chi tiêu:** Tổng hợp dòng tiền đã chi ra để mua sắm vật tư, vận chuyển hoặc trao tặng.
*   **Xem báo cáo chi tiết:** Hiển thị báo cáo dữ liệu dạng bảng/biểu đồ cho từng hạng mục cụ thể.
*   **Xuất báo cáo:** Cho phép tải file dữ liệu (Excel/PDF) báo cáo ra máy tính để lưu trữ hoặc công bố minh bạch.
