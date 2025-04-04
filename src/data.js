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

export const students = [
  {
    roll_number: "STU1001",
    name: "John Smith",
    grade: "A",
    major: "Computer Science",
    gpa: "9.2"
  },
  {
    roll_number: "STU1002",
    name: "Emily Johnson",
    grade: "B+",
    major: "Mathematics",
    gpa: "8.5"
  },
  {
    roll_number: "STU1003",
    name: "Michael Brown",
    grade: "A-",
    major: "Physics",
    gpa: "8.8"
  },
  {
    roll_number: "STU1004",
    name: "Sarah Wilson",
    grade: "A+",
    major: "Biology",
    gpa: "9.5"
  },
  {
    roll_number: "STU1005",
    name: "David Lee",
    grade: "B",
    major: "Chemistry",
    gpa: "7.8"
  },
  {
    roll_number: "STU1006",
    name: "Jennifer Davis",
    grade: "A",
    major: "Computer Science",
    gpa: "9.1"
  },
  {
    roll_number: "STU1007",
    name: "Robert Taylor",
    grade: "B+",
    major: "Mathematics",
    gpa: "8.4"
  },
  {
    roll_number: "STU1008",
    name: "Lisa Anderson",
    grade: "A-",
    major: "Physics",
    gpa: "8.7"
  },
  {
    roll_number: "STU1009",
    name: "William Martinez",
    grade: "A+",
    major: "Biology",
    gpa: "9.4"
  },
  {
    roll_number: "STU1010",
    name: "Patricia White",
    grade: "B",
    major: "Chemistry",
    gpa: "7.9"
  },
  {
    roll_number: "STU1011",
    name: "James Thompson",
    grade: "A",
    major: "Computer Science",
    gpa: "9.3"
  },
  {
    roll_number: "STU1012",
    name: "Mary Garcia",
    grade: "B+",
    major: "Mathematics",
    gpa: "8.6"
  }
];

export const employees = [
  {
    employee_id: "EMP1001",
    name: "John Smith",
    department: "IT",
    position: "Software Engineer",
    salary: "75000"
  },
  {
    employee_id: "EMP1002",
    name: "Emily Johnson",
    department: "HR",
    position: "HR Manager",
    salary: "65000"
  },
  {
    employee_id: "EMP1003",
    name: "Michael Brown",
    department: "Finance",
    position: "Financial Analyst",
    salary: "70000"
  },
  {
    employee_id: "EMP1004",
    name: "Sarah Wilson",
    department: "Marketing",
    position: "Marketing Manager",
    salary: "68000"
  },
  {
    employee_id: "EMP1005",
    name: "David Lee",
    department: "IT",
    position: "System Administrator",
    salary: "72000"
  },
  {
    employee_id: "EMP1006",
    name: "Jennifer Davis",
    department: "Sales",
    position: "Sales Representative",
    salary: "60000"
  },
  {
    employee_id: "EMP1007",
    name: "Robert Taylor",
    department: "Operations",
    position: "Operations Manager",
    salary: "78000"
  },
  {
    employee_id: "EMP1008",
    name: "Lisa Anderson",
    department: "IT",
    position: "Database Administrator",
    salary: "80000"
  },
  {
    employee_id: "EMP1009",
    name: "William Martinez",
    department: "Finance",
    position: "Senior Accountant",
    salary: "75000"
  },
  {
    employee_id: "EMP1010",
    name: "Patricia White",
    department: "HR",
    position: "Recruitment Specialist",
    salary: "62000"
  },
  {
    employee_id: "EMP1011",
    name: "James Thompson",
    department: "IT",
    position: "Frontend Developer",
    salary: "73000"
  },
  {
    employee_id: "EMP1012",
    name: "Mary Garcia",
    department: "Marketing",
    position: "Content Strategist",
    salary: "67000"
  }
];

export const teachers = [
  {
    teacher_id: "TCH1001",
    name: "John Smith",
    subject: "Mathematics",
    experience: "10",
    qualification: "Ph.D."
  },
  {
    teacher_id: "TCH1002",
    name: "Emily Johnson",
    subject: "Physics",
    experience: "8",
    qualification: "M.Sc."
  },
  {
    teacher_id: "TCH1003",
    name: "Michael Brown",
    subject: "Chemistry",
    experience: "12",
    qualification: "Ph.D."
  },
  {
    teacher_id: "TCH1004",
    name: "Sarah Wilson",
    subject: "Biology",
    experience: "9",
    qualification: "M.Sc."
  },
  {
    teacher_id: "TCH1005",
    name: "David Lee",
    subject: "Computer Science",
    experience: "11",
    qualification: "Ph.D."
  },
  {
    teacher_id: "TCH1006",
    name: "Jennifer Davis",
    subject: "English",
    experience: "7",
    qualification: "M.A."
  },
  {
    teacher_id: "TCH1007",
    name: "Robert Taylor",
    subject: "History",
    experience: "13",
    qualification: "Ph.D."
  },
  {
    teacher_id: "TCH1008",
    name: "Lisa Anderson",
    subject: "Geography",
    experience: "6",
    qualification: "M.Sc."
  },
  {
    teacher_id: "TCH1009",
    name: "William Martinez",
    subject: "Economics",
    experience: "10",
    qualification: "Ph.D."
  },
  {
    teacher_id: "TCH1010",
    name: "Patricia White",
    subject: "Political Science",
    experience: "8",
    qualification: "M.A."
  },
  {
    teacher_id: "TCH1011",
    name: "James Thompson",
    subject: "Psychology",
    experience: "11",
    qualification: "Ph.D."
  },
  {
    teacher_id: "TCH1012",
    name: "Mary Garcia",
    subject: "Sociology",
    experience: "9",
    qualification: "M.A."
  }
];

export const queries = [
  {
    id: 1,
    name: "Student Data",
    sql: "SELECT * FROM students;",
    description: "View all student records"
  },
  {
    id: 2,
    name: "High GPA Students",
    sql: "SELECT roll_number, name, grade, major, gpa FROM students WHERE gpa > 8.5;",
    description: "View students with GPA above 8.5"
  },
  {
    id: 3,
    name: "Students by Major",
    sql: "SELECT roll_number, name, grade, gpa FROM students WHERE major = 'Computer Science';",
    description: "View all Computer Science students"
  },
  {
    id: 4,
    name: "Top Performing Students",
    sql: "SELECT roll_number, name, grade, major, gpa FROM students ORDER BY gpa DESC LIMIT 5;",
    description: "View top 5 students by GPA"
  },
  {
    id: 5,
    name: "Teacher Data",
    sql: "SELECT * FROM teachers;",
    description: "View all teacher records"
  },
  {
    id: 6,
    name: "Experienced Teachers",
    sql: "SELECT teacher_id, name, subject, experience FROM teachers WHERE experience > 10;",
    description: "View teachers with more than 10 years of experience"
  },
  {
    id: 7,
    name: "Teachers by Subject",
    sql: "SELECT teacher_id, name, experience, qualification FROM teachers WHERE subject = 'Mathematics';",
    description: "View all Mathematics teachers"
  },
  {
    id: 8,
    name: "Employee Data",
    sql: "SELECT * FROM employees;",
    description: "View all employee records"
  },
  {
    id: 9,
    name: "IT Department Employees",
    sql: "SELECT employee_id, name, position, salary FROM employees WHERE department = 'IT';",
    description: "View all IT department employees"
  },
  {
    id: 10,
    name: "High Salary Employees",
    sql: "SELECT employee_id, name, department, position, salary FROM employees WHERE salary > 70000;",
    description: "View employees with salary above $70,000"
  }
];