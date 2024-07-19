from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Toando2003.@localhost/student_management' #connect SQLaichemy - MySQL
db = SQLAlchemy(app)

class Student(db.Model): #Represents the students table in the database
    __tablename__ = 'students'  
    id = db.Column(db.Integer, primary_key=True) #column
    name = db.Column(db.String(100), nullable=False) #column
    birth_year = db.Column(db.Integer, nullable=False) #column
    class_ = db.Column(db.String(50), nullable=False)  #column
    address = db.Column(db.String(255), nullable=False) #column
    grade = db.Column(db.Integer, nullable=False) #column

def fetch_students(): #Queries the database to retrieve all student records.
    students = Student.query.all()
    return students

@app.route('/') #HTML Page Routes
def index():
    return render_template('index.html')

@app.route('/add_student') #HTML Page Routes
def add_student():
    return render_template('add_student.html')

@app.route('/edit_student') #HTML Page Routes
def edit_student():
    return render_template('edit_student.html')

@app.route('/list_students') #HTML Page Routes
def list_students():
    return render_template('list_students.html')

@app.route('/api/students', methods=['GET']) #tạo restful API bằng Flask và in ra dưới dang Json
def get_students():
    students = fetch_students() #gọi hàm fetch_students để lấy tất cả thông tin sinh viên 
    students_list = [{"id": student.id, "name": student.name, "birth_year": student.birth_year, "class": student.class_, "address": student.address, "grade": student.grade} for student in students]
    return jsonify({"students": students_list}) 

@app.route('/api/students', methods=['POST']) 
def add_student_api(): # hàm khi mình thêm sinh viên mới sẽ đẩy thông tin sinh viên vào API
    data = request.form
    new_student = Student(
        name=data['name'],
        birth_year=data['birth_year'],
        class_=data['class'],  
        address=data['address'],
        grade=data['grade']
    )
    db.session.add(new_student) #add a new student to database session
    db.session.commit() #commit to save the changes
    return jsonify({"success": True})

@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id): #in thông tin sinh viên nào đó dưới dạng JSON
    student = Student.query.get(student_id) #truy vấn cơ sở dũ liệu sinh viên được chỉ định
    if student:
        return jsonify({"success": True, "student": {"id": student.id, "name": student.name, "birth_year": student.birth_year, "class": student.class_, "address": student.address, "grade": student.grade}})
    else:
        return jsonify({"success": False})

@app.route('/api/students/<int:id>', methods=['PUT']) #cập nhật sinh viên nào đó sẽ thay đổi thông tin trong API và hiển thị JSON
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
    except IntegrityError:
        db.session.rollback()
    return jsonify(success=False)

def student_to_dict(student):
    return {
        'id': student.id,
        'name': student.name,
        'birth_year': student.birth_year,
        'class_': student.class_,
        'address': student.address,
        'grade': student.grade
    }
@app.route('/api/students/<int:student_id>', methods=['DELETE']) # xoá sinh viên nào đó sẽ xoá thông tin sinh viên ấy trên JSON
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
