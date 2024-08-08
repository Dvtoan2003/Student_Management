document.addEventListener('DOMContentLoaded', function () {
    const addStudentForm = document.getElementById('add-student-form');
    const addStudentModal = document.getElementById('addStudentModal');
    const openAddStudentFormButton = document.getElementById('openAddStudentForm');
    const closeModalButton = document.querySelector('.close');
    
    const editStudentForm = document.getElementById('edit-student-form');
    const editStudentModal = document.getElementById('editStudentModal');
    const closeEditModalButton = document.querySelector('.close-edit');

    openAddStudentFormButton.addEventListener('click', function () {
        addStudentModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', function () {
        addStudentModal.style.display = 'none';
    });

    closeEditModalButton.addEventListener('click', function () {
        editStudentModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == addStudentModal) {
            addStudentModal.style.display = 'none';
        } else if (event.target == editStudentModal) {
            editStudentModal.style.display = 'none';
        }
    });

    if (addStudentForm) {
        addStudentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(addStudentForm);
            fetch('/api/students', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Student added successfully!');
                    fetchStudents();
                    addStudentModal.style.display = 'none';
                    addStudentForm.reset();
                } else {
                    alert('Failed to add student.');
                }
            });
        });
    }

    if (editStudentForm) {
        editStudentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(editStudentForm);
            const studentId = document.getElementById('edit-student-id').value;

            fetch(`/api/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Student updated successfully!');
                    fetchStudents();
                    editStudentModal.style.display = 'none';
                    editStudentForm.reset();
                } else {
                    alert('Failed to update student.');
                }
            });
        });
    }

    function fetchStudents() {
        const studentsTable = document.getElementById('students-table');
        if (studentsTable) {
            fetch('/api/students')
            .then(response => response.json())
            .then(data => {
                const tbody = studentsTable.querySelector('tbody');
                tbody.innerHTML = '';
                data.students.forEach(student => {
                    const row = document.createElement('tr');
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
    }

    fetchStudents();
});

function editStudent(studentId) {
    fetch(`/api/students/${studentId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const student = data.student;
                document.getElementById('edit-student-id').value = student.id;
                document.getElementById('edit-name').value = student.name;
                document.getElementById('edit-birth_year').value = student.birth_year;
                document.getElementById('edit-class_').value = student.class_;
                document.getElementById('edit-address').value = student.address;
                document.getElementById('edit-grade').value = student.grade;
                document.getElementById('editStudentModal').style.display = 'block';
            } else {
                alert('Failed to fetch student details.');
            }
        });
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        fetch(`/api/students/${studentId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Student deleted successfully!');
                window.location.reload();
            } else {
                alert('Failed to delete student.');
            }
        });
    }
}
