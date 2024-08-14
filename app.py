from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Toando2003.@localhost/student_management'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    birth_year = db.Column(db.Integer, nullable=False)
    class_ = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    grade = db.Column(db.Integer, nullable=False)
    topic = db.Column(db.String(100))  # Field for Topic

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'birth_year': self.birth_year,
            'class_': self.class_,
            'address': self.address,
            'grade': self.grade,
            'topic': self.topic,  # Include topic in dict
        }


def fetch_students():
    students = Student.query.all()
    return students


@app.route('/')
def index():
    return render_template('list_students.html')


# API to get all students
@app.route('/api/students', methods=['GET'])
def get_students():
    students = fetch_students()
    students_list = [{"id": student.id, "name": student.name, "birth_year": student.birth_year,
                      "class": student.class_, "address": student.address, "grade": student.grade, "topic":student.topic} for student in students]
    return jsonify({"students": students_list})


# API to add a new student
@app.route('/api/students', methods=['POST'])
def add_student_api():
    data = request.form
    new_student = Student(
        name=data['name'],
        birth_year=data['birth_year'],
        class_=data['class'],
        address=data['address'],
        grade=data['grade']
    )
    db.session.add(new_student)
    db.session.commit()
    return jsonify({"success": True})

# API to get a single student by ID
@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.get(student_id)
    if student:
        return jsonify({"success": True, "student": {"id": student.id, "name": student.name, "birth_year": student.birth_year, "class": student.class_, "address": student.address, "grade": student.grade}})
    else:
        return jsonify({"success": False})


# API to update an existing student
@app.route('/api/students/<int:id>', methods=['PUT'])
def update_student_api(id):
    try:
        student = Student.query.get(id)
        if student:
            student.name = request.json['name']
            student.birth_year = request.json['birth_year']
            student.class_ = request.json['class_']
            student.address = request.json['address']
            student.grade = request.json['grade']
            
            db.session.commit()
            return jsonify(success=True)
    except Exception as e:
        print(e)
        db.session.rollback()
    return jsonify(success=False)


@app.route('/api/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    student = Student.query.get(student_id)
    if student:
        db.session.delete(student)
        db.session.commit()
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})
    

# API to assign a topic to a student
@app.route('/api/students/<int:student_id>/assign_topic', methods=['PUT'])
def assign_topic(student_id):
    student = Student.query.get(student_id)
    if student:
        topic = request.json.get('topic')
        student.topic = topic
        db.session.commit()
        return jsonify({'success': True, 'student': student.to_dict()})
    return jsonify({'success': False}), 404

if __name__ == '__main__':
    app.run(debug=True)
