document.addEventListener('DOMContentLoaded', function () {
    const addStudentForm = document.getElementById('add-student-form');
    const addStudentModal = document.getElementById('addStudentModal');
    const openAddStudentFormButton = document.getElementById('openAddStudentForm');
    const closeModalButton = document.querySelector('.close');
    const classSelect = document.getElementById('class_id');

    openAddStudentFormButton.addEventListener('click', function () {
        addStudentModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', function () {
        addStudentModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == addStudentModal) {
            addStudentModal.style.display = 'none';
        }
    });

    if (addStudentForm) {
        addStudentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(this);

            fetch('/api/students', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Student added successfully!');
                        window.location.reload();
                    } else {
                        alert('Failed to add student.');
                    }
                });
        });
    }
    // Fetch classes and populate the class select dropdown
    fetch('/api/classes')
        .then(response => response.json())
        .then(data => {
            data.classes.forEach(classItem => {
                const option = document.createElement('option');
                option.value = classItem.id;
                option.textContent = classItem.name;
                classSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching classes:', error);
            alert('Failed to load classes.');
        });
    
});
