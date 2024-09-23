document.addEventListener('alpine:init', () => {
    Alpine.store('addStudentForm', {
        classList: [],
        init() {
            this.fetchClasses();
        },
        fetchClasses() {
            fetch('/api/classes') // API trả về danh sách lớp
                .then(response => response.json())
                .then(data => {
                    this.classList = data.classes;
                });
        },
        submitForm() {
            const formData = new FormData(document.getElementById('add-student-form'));
            fetch('/api/students', {  // API POST tới /api/students
                method: 'POST',
                body: formData
            })  
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Student added successfully!');
                    document.getElementById('add-student-form').reset();
                    // Reload hoặc cập nhật danh sách học sinh
                } else {
                    alert('Failed to add student.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the student.');
            });
        }
    });
});