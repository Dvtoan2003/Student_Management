document.addEventListener('alpine:init', () => {
    Alpine.data('manageClasses', () => ({
        classes: [],
        students: [],
        selectedClassName: '',
        loadClasses() {
            fetch('/api/classes')
                .then(response => response.json())
                .then(data => {
                    this.classes = data.classes;
                });
        },
        loadStudentsByClass(classId) {
            const selectedClass = this.classes.find(classItem => classItem.id === classId);
            this.selectedClassName = selectedClass ? selectedClass.name : '';

            fetch(`/api/classes/${classId}/students`)
                .then(response => response.json())
                .then(data => {
                    this.students = data.students;
                });
        },
        addClass(event) {
            event.preventDefault();
            const formData = new FormData(event.target);

            fetch('/api/classes', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Class added successfully!');
                    event.target.reset();
                    this.loadClasses(); // Reload the classes list
                } else {
                    alert('Failed to add class.');
                }
            });
        },
        deleteClass(classId) {
            if (confirm('Are you sure you want to delete this class?')) {
                fetch(`/api/classes/${classId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())  
                .then(data => {
                    if (data.success) {
                        alert('Class deleted successfully!');
                        this.loadClasses(); // Reload the classes list after deletion
                    } else {
                        alert('Failed to delete class.');
                    }
                });
            }
        },
        init() {
            this.loadClasses();
        }
    }));
});
