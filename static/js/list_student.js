document.addEventListener('DOMContentLoaded', function () {
    const editStudentForm = document.getElementById('edit-student-form');
    const editStudentModal = document.getElementById('editStudentModal');
    const closeEditModalButton = document.querySelector('.close-edit');

    closeEditModalButton.addEventListener('click', function () {
        editStudentModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == editStudentModal) {
            editStudentModal.style.display = 'none';
        }
    });
       
    // Handle Edit Student form submission
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


    // Fetch and display the list of students
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
                            <td>${student.student_code}</td>
                            <td>${student.name}</td>
                            <td>${student.birth_year}</td>
                            <td>${student.address}</td>
                            <td>${student.class_name}</td>
                            <td>${student.gpa}</td>
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
    fetch(`/api/students/${studentId}`) //API get list student
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const student = data.student;
                document.getElementById('edit-student-id').value = student.id;
                document.getElementById('edit-name').value = student.name;
                document.getElementById('edit-birth_year').value = student.birth_year;
                document.getElementById('edit-address').value = student.address;
                document.getElementById('class_').value = student.class_name;
                document.getElementById('edit-gpa').value = student.gpa;
                document.getElementById('editStudentModal').style.display = 'block';
                loadClasses(student.class_id);
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
function loadClasses(selectedClassId = null) {
    fetch('/api/classes')  // API get list class
        .then(response => response.json())
        .then(data => {
            const classSelect = document.getElementById('class_');
            classSelect.innerHTML = '';
            data.classes.forEach(class_ => {
                const option = document.createElement('option');
                option.value = class_.id;
                option.textContent = class_.name;
                if (class_.id === selectedClassId) {
                    option.selected = true;
                }
                classSelect.appendChild(option);
            });
        });
}