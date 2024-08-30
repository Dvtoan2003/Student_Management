# this is my CapStone 

## Mô Tả Dự Án
Dự án này là một hệ thống quản lý sinh viên với các chức năng chính bao gồm thêm, sửa, xóa và hiển thị danh sách sinh viên; quản lý class, quản lý môn học. Hệ thống sử dụng Flask làm backend và MySQL làm cơ sở dữ liệu, cùng với HTML, CSS, và JavaScript cho frontend.

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
### 5. Thêm class

- **Form Thêm class**: người quản lý có thể mở form thêm class
- **Xử lý thêm class**:khi form được gửi, thông tin sẽ được gửi đến API để thêm class vào database. sau khi thêm thành công, danh sách các lớp sẽ được cập nhật ngay lập tức

### 6. Hiển thị danh sách sinh viên ứng với từng class

- **Form chọn class**: người quản lý ấn vào chọn 1 lớp để hiển thị danh sách sinh viên
- **xử lý hiển thị**: khi form được gửi thì, thông tin sẽ được gửi đến API. sau khi gửi sẽ trả về danh sách các sinh viên thuộc lớp đó

### 7. Thêm mới subject

- **form thêm mới subject**: người quản lý mở form thêm mới subject
- **Xử lý thêm subject**: khi form được gửi, thông tin sẽ được gửi đến API. sau khi thêm thành công, danh sách môn học sẽ được cập nhật 

### 8. Thêm mới topic

- **form thêm mới topic**: người quản lý mở form thêm mới topic 
- **Xử lý thêm mới topic**: khi form được gửi, thông tin sẽ được gửi đến API, sau khi thêm thành công, danh sách topic sẽ được cập nhật 

### 9. gán topic cho subject

- **form gán**: người quản lý mở form gán topic cho subject, điền topic muốn gán cho subject
- **xử lý gán topic**: khi form được gửi, thông tin sẽ được gửi đến API, sau khi gán thành công, hệ thống sẽ báo gán thành công

### 10. hiển thị topic ứng với mỗi subject được chọn

- **form hiển thị**: khi người quản lý chọn vào 1 môn học cụ thể, thông tin về topic đã được gán sẽ hiển thị
- **xử lý**: dữ liệu về môn học sẽ lấy từ API về và hiển thị ra html

## Tài Liệu Kỹ Thuật

### Backend (Flask)

- **`app.py`**: Tập tin chính của ứng dụng Flask, bao gồm các route và xử lý các yêu cầu API.
  - `GET /api/students`: Lấy danh sách tất cả sinh viên.
  - `POST /api/students`: Thêm một sinh viên mới.
  - `GET /api/students/<int:student_id>`: Lấy thông tin một sinh viên cụ thể.
  - `PUT /api/students/<int:student_id>`: Cập nhật thông tin một sinh viên cụ thể.
  - `DELETE /api/students/<int:student_id>`: Xóa một sinh viên cụ thể.
  - `GET /api/classes`: Lấy danh sách tất cả lớp học.
  - `POST /api/classes`: thêm mội lớp học mới 
  - `GET /api/topics`: lấy thông tin tất cả topic
  - `POST /api/topics`: thêm mới topic
  - `GET /api/subjects`: lấy thông tin tất cả subject
  - `POST /api/subjects`: thêm mới subject
  - `GET /api/subjects/<int:subject_id>/topics`: lấy thông tin của 1 subject cụ thể xem có những topic nào
  - `POST /api/subjects/<int:subject_id>/topics`: thêm topic vào subject

### Frontend (HTML, CSS, JavaScript)
- **`list_students.html`**: Trang hiển thị danh sách sinh viên.
- **`list.css`**: Tệp CSS để tạo kiểu cho trang.
- **`List_student.js`**: Tệp JavaScript xử lý các sự kiện trên trang list student và giao tiếp với API.
- **`manage_class.html`**: trang để hiển thị trang quản lý class
- **`manage_subject.html`**: trang để hiển thị trang quản lý subject
- **`manage_class.css`**: CSS tạo kiểu cho trang quản lý class
- **`manage_subject.css`**: CSS tạo kiểu cho trang quản lý subject
- **`add_student.js`**: tệp Javascript xử lý sự kiện khi thêm mới sinh viên
- **`manage_class.js`**: Tệp Javascript xử lý sự kiện đối với trang manage_class
- **`manage_subject.js`**: Tệp Javascript xử lý sự kiện đối với trang manage_subject

## Hướng Dẫn Cài Đặt

1. **Cài Đặt Môi Trường**:
   ```bash
   pip install flask flask_sqlalchemy pymysql