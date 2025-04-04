import { useState, useMemo, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Select, 
  MenuItem, 
  Button, 
  Box, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  IconButton,
  FormControl,
  InputLabel
} from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import "./App.scss";
import { queries } from "./data";
import QueryEditor from "./components/QueryEditor";
import DataTable from "./components/DataTable";

// Group queries by category
const studentQueries = queries.filter(q => q.name.includes("Student"));
const teacherQueries = queries.filter(q => q.name.includes("Teacher"));
const employeeQueries = queries.filter(q => q.name.includes("Employee"));

// Main category options
const mainCategoryQueries = [
  queries.find(q => q.name === "Student Data"),  // id: 1
  queries.find(q => q.name === "Teacher Data"),  // id: 6
  queries.find(q => q.name === "Employee Data"), // id: 11
];

// Define data categories for dropdown selection
const DATA_CATEGORIES = {
  "Student Data": studentQueries,
  "Teacher Data": teacherQueries,
  "Employee Data": employeeQueries
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Student Data");
  const [selectedQuery, setSelectedQuery] = useState(mainCategoryQueries[0]);
  const [queryText, setQueryText] = useState(selectedQuery.query);
  const [result, setResult] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [lockPosition, setLockPosition] = useState(false);

  // Create theme based on dark mode state
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f7fa',
            paper: darkMode ? '#1e1e1e' : '#fff',
          },
        },
      }),
    [darkMode],
  );

  // Get relevant predefined queries based on selected category
  const getQueriesByCategory = (category) => {
    return DATA_CATEGORIES[category] || studentQueries;
  };

  // Handle category change
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    
    // Reset selected query to the main query of this category
    const mainQuery = mainCategoryQueries.find(q => q.name === newCategory);
    if (mainQuery) {
      setSelectedQuery(mainQuery);
      setQueryText(mainQuery.query);
      setResult([]);
    }
  };

  // Update selected query when query text changes from the QueryEditor
  // This ensures the App knows which query is currently selected
  const handleQueryTextChange = (newText) => {
    setQueryText(newText);
    
    // Try to find a query that matches this text
    const matchingQuery = queries.find(q => q.query === newText);
    if (matchingQuery) {
      setSelectedQuery(matchingQuery);
    }
  };

  const executeQuery = () => {
    // Set lockPosition immediately to prevent layout shift
    setLockPosition(true);
    
    if (!queryText.trim()) {
      alert("Query cannot be empty!");
      return;
    }

    console.log("Executing Query:", queryText);

    // Normalize query: convert to lowercase and remove extra whitespace
    const query = queryText.trim().toLowerCase();

    // Find exact matching query first
    let dataset = queries.find(q => q.query.toLowerCase() === query);
    
    if (!dataset) {
      // Try to find match based on table name
      const tableMatch = query.match(/from\s+(['"`]?)(\w+)\1/i);
      if (!tableMatch) {
        alert("Invalid query! Cannot determine table name.");
        return;
      }
      
      const tableName = tableMatch[2];
      const mainQueries = {
        "students": queries.find(q => q.name === "Student Data"),
        "teachers": queries.find(q => q.name === "Teacher Data"),
        "employees": queries.find(q => q.name === "Employee Data")
      };
      
      dataset = mainQueries[tableName];
      
      if (!dataset) {
        alert("Table not found! Available tables: students, teachers, employees");
        return;
      }
    }

    let data = [...dataset.data];
    let filteredData = [...data];
    
    // Process WHERE clause if present
    const whereClauseMatch = query.match(/where\s+(.*?)(?:order by|group by|limit|$)/i);
    
    if (whereClauseMatch) {
      const whereClause = whereClauseMatch[1].trim();
      
      const conditions = whereClause.split(/\s+and\s+/i);
      
      conditions.forEach(condition => {
        const conditionMatch = condition.match(/(\w+)\s*([=<>!]+|like|in)\s*(['"]?)([^'"]+)\3/i);
        
        if (conditionMatch) {
          const [_, column, operator, _quote, valueStr] = conditionMatch;
          let value = valueStr.trim();
          
          if (!isNaN(value) && operator !== "like") {
            value = Number(value);
          }
          
          console.log("Condition:", { column, operator, value, type: typeof value });
          
          // Apply the filter based on operator
          switch(operator.toLowerCase()) {
            case "=":
              filteredData = filteredData.filter(row => {
                if (typeof value === 'number') {
                  return Number(row[column]) === value;
                }
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) === new Date(value);
                }
                return String(row[column]).toLowerCase() === String(value).toLowerCase();
              });
              break;
            case ">":
              filteredData = filteredData.filter(row => {
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) > new Date(value);
                }
                return Number(row[column]) > value;
              });
              break;
            case "<":
              filteredData = filteredData.filter(row => {
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) < new Date(value);
                }
                return Number(row[column]) < value;
              });
              break;
            case ">=":
              filteredData = filteredData.filter(row => {
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) >= new Date(value);
                }
                return Number(row[column]) >= value;
              });
              break;
            case "<=":
              filteredData = filteredData.filter(row => {
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) <= new Date(value);
                }
                return Number(row[column]) <= value;
              });
              break;
            case "<>":
            case "!=":
              filteredData = filteredData.filter(row => {
                if (typeof value === 'number') {
                  return Number(row[column]) !== value;
                }
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) !== new Date(value);
                }
                return String(row[column]).toLowerCase() !== String(value).toLowerCase();
              });
              break;
            case "like":
              const pattern = value.replace(/%/g, '.*');
              const regex = new RegExp(pattern, 'i');
              filteredData = filteredData.filter(row => regex.test(String(row[column])));
              break;
            case "in":
              const values = value.split(',').map(v => v.trim());
              filteredData = filteredData.filter(row => values.includes(String(row[column])));
              break;
          }
        }
      });
    }

    // Apply ORDER BY if present
    const orderByMatch = query.match(/order by\s+(\w+)\s+(asc|desc)?/i);
    if (orderByMatch) {
      const [_, column, direction = 'asc'] = orderByMatch;
      filteredData.sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        
        if (typeof aVal === 'number') {
          return direction.toLowerCase() === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        return direction.toLowerCase() === 'asc' 
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    // Apply LIMIT if present
    const limitMatch = query.match(/limit\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1]);
      filteredData = filteredData.slice(0, limit);
    }

    // Extract columns for SELECT clause
    let columns = [];
    
    if (query.match(/select\s+\*\s+from/i)) {
      columns = Object.keys(data[0]);
    } else {
      const columnMatch = query.match(/select\s+(.*?)\s+from/i);
      if (columnMatch) {
        columns = columnMatch[1].split(",").map(col => col.trim());
      } else {
        columns = Object.keys(data[0]);
      }
    }

    // Select only requested columns if specific columns were requested
    if (!query.match(/select\s+\*\s+from/i)) {
      filteredData = filteredData.map(row => {
        const selectedRow = {};
        columns.forEach(col => {
          if (row.hasOwnProperty(col)) {
            selectedRow[col] = row[col];
          }
        });
        return selectedRow;
      });
    }

    setResult(filteredData);
  };

  // Handle query change from the QueryEditor component
  const handleSelectedQueryChange = (queryId) => {
    const selectedQuery = queries.find(q => q.id === queryId);
    if (selectedQuery) {
      setSelectedQuery(selectedQuery);
      setQueryText(selectedQuery.query);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="app-wrapper" sx={{ bgcolor: 'background.default' }}>
        <Container 
          maxWidth="sm" 
          className={`app-container ${result.length > 0 ? 'results-showing' : ''} ${lockPosition ? 'position-locked' : ''}`} 
          sx={{ bgcolor: 'background.paper' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Typography variant="h3" align="center" className="title">
              SQL Query Runner
            </Typography>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          <Box className="input-section">
            <Typography variant="h6">Select Data Category:</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant="outlined"
              >
                {Object.keys(DATA_CATEGORIES).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="query-section">
            <Typography variant="h6">Query:</Typography>
            <QueryEditor 
              queryText={queryText} 
              setQueryText={handleQueryTextChange}
              setTableData={setResult}
              selectedQueryId={selectedQuery.id}
              relevantQueries={getQueriesByCategory(selectedCategory)}
              onQuerySelect={handleSelectedQueryChange}
            />
          </Box>

          <Box className="button-container">
            <Button variant="contained" color="primary" onClick={executeQuery}>
              RUN QUERY
            </Button>
          </Box>

          {/* Result section wrapper with fixed minimum height to prevent layout shifts */}
          <Box sx={{ width: '100%', minHeight: '400px' }}>
            {result.length > 0 && (
              <Box className="result-section">
                <Typography variant="h6">Result:</Typography>
                <DataTable tableData={result} />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;