// Function to generate realistic data for different tables
const generateLargeDataset = (length, type) => {
  const subjects = ["Mathematics", "Science", "History", "English", "Computer Science", "Physics", "Chemistry", "Biology"];
  const departments = ["Mathematics", "Science", "Literature", "History", "Computer Science", "Administration"];
  const grades = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];
  const statusOptions = ["Active", "Inactive", "On Leave", "Graduated", "Suspended"];
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"];
  const countries = ["USA", "Canada", "UK", "India", "Australia"];
  
  return Array.from({ length }, (_, i) => {
    const id = i + 1;
    
    switch (type) {
      case "students":
        return {
          id,
          roll_number: `STU${1000 + id}`,
          name: `Student ${id}`,
          email: `student${id}@school.edu`,
          grade: Math.floor(Math.random() * 12) + 1, // Grade 1-12
          major: subjects[i % subjects.length],
          gpa: (Math.random() * 4 + 6).toFixed(1), // 6.0-10.0 on a 10-point scale
          admission_date: new Date(2020, i % 12, (i % 28) + 1).toISOString().split('T')[0],
          status: statusOptions[i % statusOptions.length],
          attendance: Math.floor(Math.random() * 30) + 70 // 70-100%
        };
        
      case "teachers":
        return {
          id,
          employee_id: `TCH${2000 + id}`,
          name: `Teacher ${id}`,
          email: `teacher${id}@school.edu`,
          department: departments[i % departments.length],
          subject: subjects[i % subjects.length],
          experience: Math.floor(Math.random() * 20) + 1, // 1-20 years
          salary: Math.floor(Math.random() * 40000) + 40000, // $40,000-$80,000
          joining_date: new Date(2015, i % 12, (i % 28) + 1).toISOString().split('T')[0],
          status: statusOptions.slice(0, 3)[i % 3] // Only first 3 status options
        };
        
      case "employees":
        return {
          id,
          employee_id: `EMP${3000 + id}`,
          name: `Employee ${id}`,
          email: `employee${id}@school.edu`,
          department: ["Administration", "Finance", "HR", "IT", "Facilities", "Security"][i % 6],
          role: ["Manager", "Assistant", "Coordinator", "Specialist", "Supervisor", "Officer"][i % 6],
          salary: Math.floor(Math.random() * 50000) + 30000, // $30,000-$80,000
          hire_date: new Date(2018, i % 12, (i % 28) + 1).toISOString().split('T')[0],
          reports_to: i > 10 ? Math.floor(i / 10) : null,
          status: statusOptions.slice(0, 3)[i % 3] // Only first 3 status options
        };
        
      default:
        return { id };
    }
  });
};

// Predefined queries with sample data
export const queries = [
  // Student queries
  {
    id: 1,
    name: "Student Data",
    query: "SELECT * FROM students;",
    data: generateLargeDataset(500, "students"),
  },
  {
    id: 2,
    name: "High GPA Students",
    query: "SELECT roll_number, name, grade, major, gpa FROM students WHERE gpa > 8.5;",
    data: [
      { roll_number: "STU1001", name: "Student 1", grade: 10, major: "Computer Science", gpa: "9.5" },
      { roll_number: "STU1002", name: "Student 2", grade: 11, major: "Mathematics", gpa: "8.7" },
      { roll_number: "STU1003", name: "Student 3", grade: 12, major: "Physics", gpa: "10.0" },
      { roll_number: "STU1004", name: "Student 4", grade: 9, major: "Chemistry", gpa: "8.6" },
      { roll_number: "STU1005", name: "Student 5", grade: 10, major: "Biology", gpa: "9.1" },
      { roll_number: "STU1006", name: "Student 6", grade: 11, major: "Computer Science", gpa: "8.9" },
      { roll_number: "STU1007", name: "Student 7", grade: 12, major: "Mathematics", gpa: "9.2" },
      { roll_number: "STU1008", name: "Student 8", grade: 9, major: "Physics", gpa: "8.7" },
      { roll_number: "STU1009", name: "Student 9", grade: 10, major: "Chemistry", gpa: "9.8" },
      { roll_number: "STU1010", name: "Student 10", grade: 11, major: "Biology", gpa: "9.4" }
    ]
  },
  {
    id: 4,
    name: "Students by Major",
    query: "SELECT roll_number, name, grade, major, gpa FROM students WHERE major = 'Computer Science';",
    data: [
      { roll_number: "STU1001", name: "Student 1", grade: 10, major: "Computer Science", gpa: "9.5" },
      { roll_number: "STU1006", name: "Student 6", grade: 11, major: "Computer Science", gpa: "8.9" },
      { roll_number: "STU1011", name: "Student 11", grade: 9, major: "Computer Science", gpa: "8.2" },
      { roll_number: "STU1016", name: "Student 16", grade: 12, major: "Computer Science", gpa: "7.8" },
      { roll_number: "STU1021", name: "Student 21", grade: 10, major: "Computer Science", gpa: "9.3" },
      { roll_number: "STU1026", name: "Student 26", grade: 11, major: "Computer Science", gpa: "8.1" },
      { roll_number: "STU1031", name: "Student 31", grade: 9, major: "Computer Science", gpa: "7.5" },
      { roll_number: "STU1036", name: "Student 36", grade: 12, major: "Computer Science", gpa: "9.0" }
    ]
  },
  
  // Teacher queries
  {
    id: 6,
    name: "Teacher Data",
    query: "SELECT * FROM teachers;",
    data: generateLargeDataset(200, "teachers"),
  },
  {
    id: 7,
    name: "Experienced Teachers",
    query: "SELECT employee_id, name, department, subject, experience FROM teachers WHERE experience > 10;",
    data: generateLargeDataset(200, "teachers").filter(teacher => teacher.experience > 10),
  },
  {
    id: 8,
    name: "Science Department Teachers",
    query: "SELECT employee_id, name, subject, experience FROM teachers WHERE department = 'Science';",
    data: generateLargeDataset(200, "teachers").filter(teacher => teacher.department === 'Science'),
  },
  {
    id: 10,
    name: "High Salary Teachers",
    query: "SELECT employee_id, name, department, salary FROM teachers WHERE salary > 60000;",
    data: generateLargeDataset(200, "teachers").filter(teacher => teacher.salary > 60000),
  },
  
  // Employee queries
  {
    id: 11,
    name: "Employee Data",
    query: "SELECT * FROM employees;",
    data: generateLargeDataset(300, "employees"),
  },
  {
    id: 12,
    name: "IT Department Employees",
    query: "SELECT employee_id, name, role, salary FROM employees WHERE department = 'IT';",
    data: generateLargeDataset(300, "employees").filter(employee => employee.department === 'IT'),
  },
  {
    id: 13,
    name: "Management Staff",
    query: "SELECT employee_id, name, department, role FROM employees WHERE role = 'Manager';",
    data: generateLargeDataset(300, "employees").filter(employee => employee.role === 'Manager'),
  },
  {
    id: 15,
    name: "High Salary Employees",
    query: "SELECT employee_id, name, department, role, salary FROM employees WHERE salary > 50000;",
    data: generateLargeDataset(300, "employees").filter(employee => employee.salary > 50000),
  }
];