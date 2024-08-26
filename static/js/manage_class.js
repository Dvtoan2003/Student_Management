document.addEventListener('DOMContentLoaded', function() {
    const classList = document.getElementById('class-list');
    const studentList = document.getElementById('student-list');
    const addClassForm = document.getElementById('add-class-form');

    // Function to load all classes
    function loadClasses() {
        fetch('/api/classes')
            .then(response => response.json())
            .then(data => {
                classList.innerHTML = '';
                data.classes.forEach(class_ => {
                    const li = document.createElement('li');
                    li.textContent = class_.name;
                    li.dataset.classId = class_.id;
                    li.addEventListener('click', () => loadStudentsByClass(class_.id));
                    classList.appendChild(li);
                });
            });
    }

    // Function to load students by class ID
    function loadStudentsByClass(classId) {
        fetch(`/api/classes/${classId}/students`)
            .then(response => response.json())
            .then(data => {
                studentList.innerHTML = '';
                data.students.forEach(student => {
                    const li = document.createElement('li');
                    li.textContent = `${student.name} (${student.student_code})`;
                    studentList.appendChild(li);
                });
            });
    }

    // Event listener for adding a new class
    addClassForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(addClassForm);
        
        fetch('/api/classes', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Class added successfully!');
                addClassForm.reset();
                loadClasses(); // Reload the classes list
            } else {
                alert('Failed to add class.');
            }
        });
    });
    loadClasses();
});
