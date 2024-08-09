# this is my CapStone 

## Mô Tả Dự Án
Dự án này là một hệ thống quản lý sinh viên với các chức năng chính bao gồm thêm, sửa, xóa và hiển thị danh sách sinh viên. Hệ thống sử dụng Flask làm backend và MySQL làm cơ sở dữ liệu, cùng với HTML, CSS, và JavaScript cho frontend.

## Cấu Trúc Dự Án

### Backend

- **Flask**: Framework Python để xây dựng API và xử lý logic backend.
- **SQLAlchemy**: ORM để tương tác với cơ sở dữ liệu MySQL.
- **MySQL**: Cơ sở dữ liệu lưu trữ thông tin sinh viên.

### Frontend

- **HTML**: Tạo cấu trúc cho các trang web.
- **CSS**: Tạo kiểu dáng cho các trang web.
- **JavaScript**: Xử lý logic phía client và giao tiếp với API.

## Các Chức Năng Chính

### 1. Thêm Sinh Viên

- **Form Thêm Sinh Viên**: Người dùng có thể mở form thêm sinh viên bằng cách nhấn nút "Add Student". Form sẽ hiện lên trên màn hình với một dấu 'X' để đóng.
- **Xử Lý Thêm Sinh Viên**: Khi form được gửi, thông tin sẽ được gửi đến API để thêm sinh viên vào cơ sở dữ liệu. Sau khi thêm thành công, danh sách sinh viên sẽ được cập nhật ngay lập tức mà không cần tải lại trang.

### 2. Hiển Thị Danh Sách Sinh Viên

- **Danh Sách Sinh Viên**: Danh sách sinh viên được hiển thị trên một bảng với các thông tin như tên, năm sinh, lớp, địa chỉ, và điểm số.
- **Tải Danh Sách Sinh Viên**: Dữ liệu sinh viên được lấy từ API và cập nhật bảng sinh viên khi trang được tải hoặc khi sinh viên mới được thêm vào.

### 3. Sửa Thông Tin Sinh Viên

- **Form Sửa Sinh Viên**: Khi nhấn nút "Edit" trên một sinh viên, người dùng sẽ được chuyển đến trang sửa thông tin của sinh viên đó.
- **Xử Lý Sửa Sinh Viên**: Thông tin sửa đổi được gửi đến API để cập nhật thông tin sinh viên trong cơ sở dữ liệu.

### 4. Xóa Sinh Viên

- **Xóa Sinh Viên**: Khi nhấn nút "Delete" trên một sinh viên, người dùng sẽ được yêu cầu xác nhận việc xóa. Nếu đồng ý, yêu cầu xóa sẽ được gửi đến API.

## Tài Liệu Kỹ Thuật

### Backend (Flask)

- **`app.py`**: Tập tin chính của ứng dụng Flask, bao gồm các route và xử lý các yêu cầu API.
  - `GET /api/students`: Lấy danh sách tất cả sinh viên.
  - `POST /api/students`: Thêm một sinh viên mới.
  - `GET /api/students/<int:student_id>`: Lấy thông tin một sinh viên cụ thể.
  - `PUT /api/students/<int:student_id>`: Cập nhật thông tin một sinh viên cụ thể.
  - `DELETE /api/students/<int:student_id>`: Xóa một sinh viên cụ thể.

### Frontend (HTML, CSS, JavaScript)
- **`list_students.html`**: Trang hiển thị danh sách sinh viên.
- **`list.css`**: Tệp CSS để tạo kiểu cho trang.
- **`script.js`**: Tệp JavaScript xử lý các sự kiện trên trang và giao tiếp với API.

## Hướng Dẫn Cài Đặt

1. **Cài Đặt Môi Trường**:
   ```bash
   pip install flask flask_sqlalchemy pymysql