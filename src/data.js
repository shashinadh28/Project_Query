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
          gpa: (Math.random() * 2 + 2).toFixed(2), // 2.00-4.00
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
    query: "SELECT roll_number, name, grade, major, gpa FROM students WHERE gpa > 3.5;",
    data: generateLargeDataset(500, "students").filter(student => parseFloat(student.gpa) > 3.5),
  },
  {
    id: 3,
    name: "Recently Admitted Students",
    query: "SELECT roll_number, name, grade, admission_date FROM students WHERE admission_date > '2022-01-01';",
    data: generateLargeDataset(500, "students").filter(student => new Date(student.admission_date) > new Date('2022-01-01')),
  },
  {
    id: 4,
    name: "Students by Major",
    query: "SELECT roll_number, name, grade, major, gpa FROM students WHERE major = 'Computer Science';",
    data: generateLargeDataset(500, "students").filter(student => student.major === 'Computer Science'),
  },
  {
    id: 5,
    name: "Students with Perfect Attendance",
    query: "SELECT roll_number, name, grade, attendance FROM students WHERE attendance > 95;",
    data: generateLargeDataset(500, "students").filter(student => student.attendance > 95),
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
    id: 9,
    name: "Recently Joined Teachers",
    query: "SELECT employee_id, name, department, joining_date FROM teachers WHERE joining_date > '2020-01-01';",
    data: generateLargeDataset(200, "teachers").filter(teacher => new Date(teacher.joining_date) > new Date('2020-01-01')),
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
    id: 14,
    name: "Recently Hired Employees",
    query: "SELECT employee_id, name, department, hire_date FROM employees WHERE hire_date > '2022-01-01';",
    data: generateLargeDataset(300, "employees").filter(employee => new Date(employee.hire_date) > new Date('2022-01-01')),
  },
  {
    id: 15,
    name: "High Salary Employees",
    query: "SELECT employee_id, name, department, role, salary FROM employees WHERE salary > 50000;",
    data: generateLargeDataset(300, "employees").filter(employee => employee.salary > 50000),
  }
];