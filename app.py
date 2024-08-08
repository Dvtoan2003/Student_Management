from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Toando2003.@localhost/student_management'
db = SQLAlchemy(app)

class Student(db.Model):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    birth_year = db.Column(db.Integer, nullable=False)
    class_ = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    grade = db.Column(db.Integer, nullable=False)

def fetch_students():
    students = Student.query.all()
    return students

@app.route('/')
def index():
    return render_template('list_students.html')

@app.route('/api/students', methods=['GET'])
def get_students():
    students = fetch_students()
    students_list = [{"id": student.id, "name": student.name, "birth_year": student.birth_year, "class": student.class_, "address": student.address, "grade": student.grade} for student in students]
    return jsonify({"students": students_list})

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

@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = Student.query.get(student_id)
    if student:
        return jsonify({"success": True, "student": {"id": student.id, "name": student.name, "birth_year": student.birth_year, "class": student.class_, "address": student.address, "grade": student.grade}})
    else:
        return jsonify({"success": False})

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

if __name__ == '__main__':
    app.run(debug=True)
