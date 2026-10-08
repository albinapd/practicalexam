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
      .get("http://localhost:5000/students")
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
  const express = require("express");
  const cors = require("cors");
  const mongoose = require("mongoose");
  const Student = require("./models/Student");
  require("dotenv").config();
  const app = express();
  app.use(cors());
  app.use(express.json());
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("MongoDB connection error:", error);
    });
  app.get("/", (req, res) => {
    res.send("Server is running!");
  });

  app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
  });

  app.post("/students", async (req, res) => {
    try {
      const { name, course, age } = req.body;
      const newStudent = new Student({
        name: name,
        course: course,
        age: age,
      });
      const savedStudent = await newStudent.save();
      res.status(201).json(savedStudent);
    } catch (error) {
      console.log("Error adding student:", error);
      res.status(500).json({ message: "Failed to add student" });
    }
  });

   //DELETE
   app.delete("/students/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deletedStudent = await Student.findByIdAndDelete(id);
      if (!deletedStudent) {
        return res.status(404).json({ message: "Failed to delete student." });
      }
      res.json({ message: "Student deleted successfully" });
    } catch (error) {
      console.log("Error deleting student:", error);
      res.status(500).json({ message: "Failed to delete student." });
    }
  });

  const addStudent = () => {
    axios
      .post("http://localhost:5000/students", {
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
      .delete(`http://localhost:5000/students/${id}`)
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

  return (
    <div>
      <h1>Student Management System</h1>
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

      <button onClick={addStudent}>Add Student</button>
      <button onClick={deleteStudent}>Delete Student</button>

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>

          <button>Edit</button>
          <button>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
