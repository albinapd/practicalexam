import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    axios
      .get("https://practicalexam-ten.vercel.app/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.log("Error fetching students:", error);
      });
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = (event) => {
    event.preventDefault;
    axios
      .post("https://practicalexam-ten.vercel.app/students", {
        name: name,
        course: course,
        age: age,
      })
      .then((response) => {
        setStudents([...students, response.data]);

        setName("");
        setCourse("");
        setAge("");
      })
      .catch((error) => {
        console.log("Error adding student:", error);
      });
  };

  const deleteStudent = (id) => {
    axios
      .delete(`https://practicalexam-ten.vercel.app/students/${id}`)
      .then(() => {
        fetchStudents();
      })
      .catch((error) => {
        console.log("Error deleting student:", error);
      });
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
  };

  const updateStudent = () => {
    axios
      .put(`https://practicalexam-ten.vercel.app/students/${editingId}`, {
        name: name,
        course: course,
        age: age,
      })
      .then(() => {
        setEditingId(null);
        setName("");
        setCourse("");
        setAge("");
        fetchStudents();
      })
      .catch((error) => {
        console.log("Error updating student:", error);
      });
  };

  return (
    <div>
      <h1>Student Management System</h1>
      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        type="text"
        placeholder="Course"
        value={course}
        onChange={(event) => setCourse(event.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(event) => setAge(event.target.value)}
      />

      {editingId ? (
        <>
          <button type="button" onClick={updateStudent}>
            UpdateStudent
          </button>
        </>
      ) : (
        <button type="button" onClick={addStudent}>
          Add Student
        </button>
      )}
      <h2>Students</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>
          <button onClick={() => startEdit(student)}>Edit</button>
          <button onClick={() => deleteStudent(student._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
