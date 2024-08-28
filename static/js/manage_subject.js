document.addEventListener('DOMContentLoaded', function () {
    const addSubjectForm = document.getElementById('add-subject-form');
    const addTopicForm = document.getElementById('add-topic-form');
    const assignTopicsForm = document.getElementById('assign-topics-form');
    const subjectSelect = document.getElementById('subject_select');
    const topicSelect = document.getElementById('topic_select');
    const subjectForTopics = document.getElementById('subject_for_topics');
    const topicsList = document.getElementById('topics_list');

    function populateSelect(selectElement, apiEndpoint) {
        fetch(apiEndpoint) 
            .then(response => response.json())
            .then(data => {
                data[Object.keys(data)[0]].forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.name;
                    selectElement.appendChild(option);
                });
            });
    }

    populateSelect(subjectSelect, '/api/subjects');
    populateSelect(topicSelect, '/api/topics');
    populateSelect(subjectForTopics, '/api/subjects');

    addSubjectForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addSubjectForm);
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
                subjectSelect.innerHTML = ''; 
                populateSelect(subjectSelect, '/api/subjects');
                addSubjectForm.reset();
            } else {
                alert('Failed to add subject.');
            }
        });
    });

    addTopicForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(addTopicForm);
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
                topicSelect.innerHTML = ''; 
                populateSelect(topicSelect, '/api/topics');
                addTopicForm.reset();
            } else {
                alert('Failed to add topic.');
            }
        });
    });

    assignTopicsForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedTopics = Array.from(topicSelect.selectedOptions).map(option => option.value);
        const subjectId = subjectSelect.value;

        fetch(`/api/subjects/${subjectId}/topics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic_ids: selectedTopics })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Topics assigned to subject successfully!');
            } else {
                alert('Failed to assign topics to subject.');
            }
        });
    });

    document.getElementById('fetch_topics').addEventListener('click', function () {
        const subjectId = subjectForTopics.value;
        fetch(`/api/subjects/${subjectId}/topics`)
            .then(response => response.json())
            .then(data => {
                topicsList.innerHTML = '';
                if (data.success) {
                    data.topics.forEach(topic => {
                        const li = document.createElement('li');
                        li.textContent = topic.name;
                        topicsList.appendChild(li);
                    });
                } else {
                    alert('Failed to fetch topics for this subject.');
                }
            })
            .catch(error => {
                console.error('Error fetching topics:', error);
                alert('An error occurred while fetching topics.');
            });
    });
});

