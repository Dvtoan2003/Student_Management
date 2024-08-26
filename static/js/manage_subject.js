document.addEventListener('DOMContentLoaded', function () {
    const subjectSelect = document.getElementById('subject_id');
    const viewSubjectSelect = document.getElementById('view_subject_id');
    const topicSelect = document.getElementById('topic_id');
    const topicsList = document.getElementById('topics-list');

    // Fetch and populate subjects in both dropdowns
    function loadSubjects() {
        fetch('/api/subjects')
            .then(response => response.json())
            .then(data => {
                subjectSelect.innerHTML = '';
                viewSubjectSelect.innerHTML = '';
                data.subjects.forEach(subject => {
                    const option = document.createElement('option');
                    option.value = subject.id;
                    option.textContent = subject.name;
                    subjectSelect.appendChild(option);

                    const viewOption = document.createElement('option');
                    viewOption.value = subject.id;
                    viewOption.textContent = subject.name;
                    viewSubjectSelect.appendChild(viewOption);
                });
            });
    }

    // Fetch and populate topics
    function loadTopics() {
        fetch('/api/topics')
            .then(response => response.json())
            .then(data => {
                topicSelect.innerHTML = '';
                data.topics.forEach(topic => {
                    const option = document.createElement('option');
                    option.value = topic.id;
                    option.textContent = topic.name;
                    topicSelect.appendChild(option);
                });
            });
    }

    // Add new subject
    document.getElementById('add-subject-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const subjectName = document.getElementById('subject_name').value;

        fetch('/api/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: subjectName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Subject added successfully!');
                loadSubjects();
            } else {
                alert('Failed to add subject.');
            }
        });
    });

    // Add new topic
    document.getElementById('add-topic-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const topicName = document.getElementById('topic_name').value;

        fetch('/api/topics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: topicName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Topic added successfully!');
                loadTopics();
            } else {
                alert('Failed to add topic.');
            }
        });
    });

    // Add topic to subject
    document.getElementById('add-topic-to-subject-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const subjectId = subjectSelect.value;
        const topicId = topicSelect.value;

        fetch(`/api/subjects/${subjectId}/topics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic_id: topicId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Topic added to subject successfully!');
            } else {
                alert('Failed to add topic to subject.');
            }
        });
    });

    // View topics of a selected subject
    document.getElementById('view-topics-button').addEventListener('click', function () {
        const subjectId = viewSubjectSelect.value;

        fetch(`/api/subjects/${subjectId}/topics`)
            .then(response => response.json())
            .then(data => {
                topicsList.innerHTML = '';
                if (data.topics.length > 0) {
                    data.topics.forEach(topic => {
                        const listItem = document.createElement('li');
                        listItem.textContent = topic.name;
                        topicsList.appendChild(listItem);
                    });
                } else {
                    topicsList.textContent = 'No topics found for this subject.';
                }
            });
    });

    // Load initial data
    loadSubjects();
    loadTopics();
});
