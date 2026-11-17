const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

let students = [
    {
        id: 201,
        rollNumber: "CSE2401",
        name: "Aarav Sharma",
        branch: "CSE",
        semester: 3,
        email: "aarav@example.com"
    },
    {
        id: 202,
        rollNumber: "ECE2402",
        name: "Diya Verma",
        branch: "ECE",
        semester: 3,
        email: "diya@example.com"
    },
    {
        id: 203,
        rollNumber: "CSE2403",
        name: "Kabir Singh",
        branch: "CSE",
        semester: 3,
        email: "kabir@example.com"
    }
];

function isValidStudent(data) {
    return (
        typeof data.rollNumber === "string" &&
        data.rollNumber.trim() !== "" &&
        typeof data.name === "string" &&
        data.name.trim() !== "" &&
        typeof data.branch === "string" &&
        data.branch.trim() !== "" &&
        typeof data.semester === "number" &&
        Number.isInteger(data.semester) &&
        data.semester > 0 &&
        typeof data.email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    );
}

app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

app.post('/api/students', (req, res) => {

    const data = req.body;

    if (!isValidStudent(data)) {
        return res.status(400).json({
            message: "Invalid student data"
        });
    }

    const exists = students.some(s =>
        s.rollNumber.toLowerCase() === data.rollNumber.trim().toLowerCase()
    );

    if (exists) {
        return res.status(400).json({
            message: "Roll number already exists"
        });
    }

    const newStudent = {
        id: Math.max(200, ...students.map(s => s.id)) + 1,
        rollNumber: data.rollNumber.trim(),
        name: data.name.trim(),
        branch: data.branch.trim(),
        semester: data.semester,
        email: data.email.trim()
    };

    students.push(newStudent);

    res.status(201).json(newStudent);
});

app.get('/api/students/filter', (req, res) => {

    const branch = req.query.branch;

    if (typeof branch !== "string" || branch.trim() === "") {
        return res.status(400).json({
            message: "Please provide branch"
        });
    }

    const result = students.filter(s =>
        s.branch.toLowerCase() === branch.trim().toLowerCase()
    );

    res.status(200).json(result);
});

app.get('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

app.put('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const data = req.body;

    if (!isValidStudent(data)) {
        return res.status(400).json({
            message: "Invalid student data"
        });
    }

    const exists = students.some(s =>
        s.id !== id &&
        s.rollNumber.toLowerCase() === data.rollNumber.trim().toLowerCase()
    );

    if (exists) {
        return res.status(400).json({
            message: "Roll number already exists"
        });
    }

    students[index] = {
        id: id,
        rollNumber: data.rollNumber.trim(),
        name: data.name.trim(),
        branch: data.branch.trim(),
        semester: data.semester,
        email: data.email.trim()
    };

    res.status(200).json(students[index]);
});

app.delete('/api/students/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid student ID"
        });
    }

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});