from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Toando2003.@localhost/student_management'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Student(db.Model): 
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    student_code = db.Column(db.String(20), unique=True, nullable=False)  
    name = db.Column(db.String(100), nullable=False)
    birth_year = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String(255), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    gpa = db.Column(db.Float, nullable=False) 
    class_ = db.relationship('Class', backref=db.backref('students', lazy=True))

class Topic(db.Model):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    topics = db.relationship('Topic', secondary='subject_topic', backref='subjects')

class SubjectTopic(db.Model):
    __tablename__ = 'subject_topic'
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), primary_key=True)
class Class(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

def fetch_students():
    students = Student.query.all()
    return students

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/list_student')
def list_student():
    return render_template('list_student.html')
@app.route('/manage_class')
def manage_class():
    return render_template('manage_class.html')
@app.route("/manage_subject")
def manage_subject():
    return render_template('manage_subject.html')

# API to get all students
@app.route('/api/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    students_list = [
        {
            "id": student.id,
            "student_code": student.student_code,
            "name": student.name,
            "birth_year": student.birth_year,
            "address": student.address,
            "class_name": student.class_.name if student.class_ else None,
            "gpa": student.gpa
        }
        for student in students
    ]
    return jsonify({"students": students_list})
# API to get a single student by ID
@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.get(student_id)
    if student:
        return jsonify({"success": True, "student": {
            "id": student.id,
            "student_code": student.student_code,
            "name": student.name,
            "birth_year": student.birth_year,
            "address": student.address, 
            "class": student.class_id,
            "gpa": student.gpa}})
    else:
        return jsonify({"success": False})

# API to add a new student
@app.route('/api/students', methods=['POST'])
def add_student():
    try:
        student_code = request.form.get('student_code')
        name = request.form.get('name')
        birth_year = request.form.get('birth_year')
        address = request.form.get('address')
        class_id = request.form.get('class_id')
        gpa = request.form.get('gpa')

        print("Received Data:", student_code, name, birth_year, address, class_id, gpa)

        new_student = Student( student_code=student_code, name=name, birth_year=birth_year,
                              address=address, class_id=class_id, gpa=gpa)
        db.session.add(new_student)
        db.session.commit()

        return jsonify({"success": True})
    except Exception as e:
        print("Error:", e)
        return jsonify({"success": False, "error": str(e)})

# API to update an existing student
@app.route('/api/students/<int:id>', methods=['PUT'])
def update_student(id):
    student = Student.query.get(id)
    if not student:
        return jsonify({"success": False, "message": "Student not found"}), 404

    data = request.get_json()
    student.id = data.get('student_id', student.id)
    student.name = data.get('name', student.name)
    student.birth_year = data.get('birth_year', student.birth_year)
    student.address = data.get('address', student.address)
    student.class_id = data.get('class_id', student.class_id)
    student.gpa = data.get('gpa', student.gpa)

    db.session.commit()

    return jsonify({"success": True, "message": "Student updated successfully"})

#API to delete student
@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get(student_id)
    if student:
        db.session.delete(student)
        db.session.commit()
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})


#API for classes
@app.route('/api/classes', methods=['GET'])
def get_classes():
    classes = Class.query.all()
    classes_list = [{"id": class_.id, "name": class_.name} for class_ in classes]
    return jsonify({"classes": classes_list})
@app.route('/api/classes', methods=['POST'])
def add_class():
    class_name = request.form.get('class_name')
    if class_name:
        new_class = Class(name=class_name)
        db.session.add(new_class)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Class name is required'}), 400
@app.route('/api/classes/<int:class_id>', methods=['DELETE'])
def delete_class(class_id):
    class_to_delete = Class.query.get(class_id)
    if class_to_delete:
        db.session.delete(class_to_delete)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Class not found'}), 404
@app.route('/api/classes/<int:class_id>/students', methods=['GET'])
def get_students_by_class(class_id):
    students = Student.query.filter_by(class_id=class_id).all()
    students_list = [
        {"student_code": student.student_code, "name": student.name}
        for student in students
    ]
    return jsonify({"students": students_list})

#API for topic
@app.route('/api/topics', methods=['GET'])
def get_topics():
    topics = Topic.query.all()
    topics_list = [{"id": topic.id, "name": topic.name} for topic in topics]
    return jsonify({"topics": topics_list})
@app.route('/api/topics', methods=['POST'])
def add_topic_api():
    data = request.json
    new_topic = Topic(name=data['name'])
    db.session.add(new_topic)
    db.session.commit()
    return jsonify({"success": True})

#API for subject
@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    subjects = Subject.query.all()
    subjects_list = [{"id": subject.id, "name": subject.name} for subject in subjects]
    return jsonify({"subjects": subjects_list})

@app.route('/api/subjects', methods=['POST'])
def add_subject_api():
    data = request.json
    new_subject = Subject(name=data['name'])
    db.session.add(new_subject)
    db.session.commit()
    return jsonify({"success": True})


@app.route('/api/subjects/<int:subject_id>/topics', methods=['POST'])
def add_topics_to_subject(subject_id):
    data = request.json
    subject = Subject.query.get(subject_id)
    if not subject:
        return jsonify({"success": False, "message": "Subject not found"})

    for topic_id in data['topic_ids']:
        topic = Topic.query.get(topic_id)
        if topic:
            subject.topics.append(topic)
    db.session.commit()
    return jsonify({"success": True})

@app.route('/api/subjects/<int:subject_id>/topics', methods=['GET'])
def get_topics_by_subject(subject_id):
    subject = Subject.query.get(subject_id)
    if not subject:
        return jsonify({"success": False, "message": "Subject not found"})

    topics = subject.topics
    topics_list = [{"id": topic.id, "name": topic.name} for topic in topics]
    return jsonify({"success": True, "topics": topics_list})

if __name__ == '__main__':
    app.run(debug=True)
