document.addEventListener('alpine:init', () => {
    Alpine.data('manageSubjects', () => ({
        subjects: [],
        topics: [],
        assignedTopics: [],
        selectedSubject: '',
        selectedTopics: [],
        subjectForTopics: '',
        
        init() {
            this.loadSubjects();
            this.loadTopics();
        },
        
        loadSubjects() {
            fetch('/api/subjects')
                .then(response => response.json())
                .then(data => {
                    this.subjects = data.subjects;
                });
        },
        
        loadTopics() {
            fetch('/api/topics')
                .then(response => response.json())
                .then(data => {
                    this.topics = data.topics;
                });
        },
        
        addSubject(event) {
            const formData = new FormData(event.target);
            fetch('/api/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'  
                },
                body: JSON.stringify({ name: formData.get('name') }) 
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Subject added successfully!');
                    event.target.reset();
                    this.loadSubjects(); 
                } else {
                    alert('Failed to add subject.');
                }
            });
        },
        
        addTopic(event) {
            const formData = new FormData(event.target);
            fetch('/api/topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: formData.get('name') })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Topic added successfully!');
                    event.target.reset();
                    this.loadTopics(); 
                } else {
                    alert('Failed to add topic.');
                }
            });
        },
        
        assignTopicsToSubject() {
            fetch(`/api/subjects/${this.selectedSubject}/topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic_ids: this.selectedTopics })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Topics assigned to subject successfully!');
                } else {
                    alert('Failed to assign topics to subject.');
                }
            });
        },

        fetchTopicsForSubject() {
            fetch(`/api/subjects/${this.subjectForTopics}/topics`)
                .then(response => response.json())
                .then(data => {
                    this.assignedTopics = data.topics;
                });
        }
    }));
});