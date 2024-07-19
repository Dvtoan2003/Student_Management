document.addEventListener('DOMContentLoaded', function () {
    // chọn phần tử có ID để lưu trữ trong biến addStudentForm và editStudentForm
    const addStudentForm = document.getElementById('add-student-form');
    const editStudentForm = document.getElementById('edit-student-form');

    if (addStudentForm) {
        addStudentForm.addEventListener('submit', function (event) { //thêm trình xử lý sự kiện vào biểu mẫu 
            event.preventDefault();
            const formData = new FormData(addStudentForm); // tạo đối tượng FormData từ biểu mẫu 
            fetch('/api/students', { //gửi yêu cầu tới API theo phương thức POST
                method: 'POST',
                body: formData
            })
            .then(response => response.json()) // chuyển đổi  phản hồi thành JSON và kiểm tra thao tác có thành côn hay không
            .then(data => {
                if (data.success) { // nếu thành công thì hiển thị đến trang list_student
                    alert('Student added successfully!'); 
                    window.location.href = '/list_students';
                } else { // ngược lại sẽ báo lỗi
                    alert('Failed to add student.');
                }
            });
        });
    }

    if (editStudentForm) {
        editStudentForm.addEventListener('submit', function (event) { // thêm trình xử lý sự kiện vào biểu mẫu 
            event.preventDefault();
            const studentId = document.getElementById('student_id').value; // lấy Id sinh viên từ trường ẩn 
            const formData = new FormData(editStudentForm); //Tạo đối tượng FormData từ biểu mẫu.
            const jsonData = {};
            formData.forEach((value, key) => { jsonData[key] = value }); //Chuyển đổi FormData thành đối tượng JSON đơn giản.

            fetch(`/api/students/${studentId}`, { // gửi yêu cầu tới API theo phương thức PUT 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => response.json()) //kiểm tra 
            .then(data => {
                if (data.success) { // nếu thành công thì đẩy ra trang list_student
                    alert('Student updated successfully!');
                    window.location.href = '/list_students'; 
                } else { // ngược lại thì fail
                    alert('Failed to update student.');
                }
            });
        });
    }

    const studentsTable = document.getElementById('students-table'); // chọn phần tử có ID students-table để lưu trữ trong biến studentsTable
    if (studentsTable) {
        fetch('/api/students') // gửi yêu cầu tới API để lấy thông tin sinh viên theo phương thức GET 
        .then(response => response.json()) // chuyển đổi phản hồi thành JSON 
        .then(data => {
            const tbody = studentsTable.querySelector('tbody'); //cập nhật nội dung của biến tbody 
            tbody.innerHTML = '';
            data.students.forEach(student => {
                const row = document.createElement('tr'); // tạo hàng cho từng thông tin của sinh viên 
                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.birth_year}</td>
                    <td>${student.class_}</td>
                    <td>${student.address}</td>
                    <td>${student.grade}</td>
                    <td>
                        <button onclick="editStudent(${student.id})">Edit</button>
                        <button onclick="deleteStudent(${student.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
    }
});

function editStudent(studentId) {
    fetch(`/api/students/${studentId}`) // gửi yêu cầu lấy thông tin tới API bằng phương thức GET
        .then(response => response.json()) // chuyển đổi phản hồi thành JSON 
        .then(data => {
            if (data.success) {
                const student = data.student;

                //Lưu trữ thông tin chi tiết về sinh viên trong sessionStorage trước khi chuyển hướng
                sessionStorage.setItem('student', JSON.stringify(student)); 

                //chuyển đến trang chỉnh sửa
                window.location.href = `/edit_student`;
            } else {
                alert('Failed to fetch student details.');
            }
        });
}
// thực hti khi tải trang 
window.onload = function() {
    if (window.location.pathname === '/edit_student') {  //nếu đang ở trang edit 
        const student = JSON.parse(sessionStorage.getItem('student')); //xuất dữ liệu từ sessionStorage 
        if (student) { //và điền thông tin chi tiết về sinh viên vào biểu mẫu 
            document.getElementById('student_id').value = student.id;
            document.getElementById('name').value = student.name;
            document.getElementById('birth_year').value = student.birth_year;
            document.getElementById('class_').value = student.class_;
            document.getElementById('address').value = student.address;
            document.getElementById('grade').value = student.grade;
        }
    }
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) { // hỏi có chắc chắn muốn xoá không
        fetch(`/api/students/${studentId}`, { //gửi yêu cầu xoá tới API 
            method: 'DELETE'
        })
        .then(response => response.json()) //chuyển đổi phản hồi thành dạng JSON 
        .then(data => {
            if (data.success) { // nếu thành công sẽ xoá và cập nhật lại danh sách
                alert('Student deleted successfully!');
                window.location.reload();
            } else { // ngược lại 
                alert('Failed to delete student.');
            }
        });
    }
}
