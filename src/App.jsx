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
    switch(category) {
      case "Student Data":
        return studentQueries;
      case "Teacher Data":
        return teacherQueries;
      case "Employee Data":
        return employeeQueries;
      default:
        return studentQueries;
    }
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

    // Check if this is an exact match for a predefined query
    const exactMatchQuery = queries.find(q => q.query.trim() === queryText.trim());
    if (exactMatchQuery) {
      console.log("Using predefined query data directly");
      setResult(exactMatchQuery.data);
      return;
    }

    // Normalize query: convert to lowercase and remove extra whitespace
    const query = queryText.trim().toLowerCase();

    // Find the corresponding dataset based on the query text
    let dataset = queries.find(q => q.query.toLowerCase() === query);
    
    if (!dataset) {
      // If no exact match, try to find by table name
      const tableMatch = query.match(/from\s+(['"`]?)(\w+)\1(?:\s+(?:as\s+)?(\w+))?/i);
      if (!tableMatch) {
        alert("Invalid query! Cannot determine table name. Format: SELECT column1, column2 FROM table;");
        return;
      }
      const tableName = tableMatch[2];
      
      // Find the base dataset for this table
      dataset = queries.find(q => q.query.toLowerCase().includes(`from ${tableName}`));
    }
    
    if (!dataset) {
      alert("Query not found in predefined queries!");
      return;
    }

    // For base data queries (SELECT * FROM table), use the data directly
    if (query.match(/select\s+\*\s+from/i)) {
      setResult(dataset.data);
      return;
    }

    // Clone data to avoid modifying original
    let data = [...dataset.data];

    // Extract columns from the SELECT clause
    let columnMatch;
    let useAllColumns = false;
    
    // Check if query uses SELECT *
    if (query.match(/select\s+\*\s+from/i)) {
      useAllColumns = true;
    } else {
      // Extract columns from the SELECT clause
      columnMatch = query.match(/select\s+(.*?)\s+from/i);
      
      if (!columnMatch) {
        alert("Invalid query! Please specify columns in SELECT statement.");
        return;
      }
    }

    // Process columns
    let columns = [];
    if (useAllColumns) {
      // Use all columns from the first data row
      columns = Object.keys(data[0]);
    } else {
      // Split the column string and clean each column name
      columns = columnMatch[1].split(",").map(col => {
        // Extract just the column name, removing functions and aliases
        const simpleCol = col.trim().replace(/^(count|sum|avg|min|max)\(([^)]+)\).*$/i, "$2");
        
        // If alias is used (col AS alias), extract the original column
        return simpleCol.replace(/^(.*?)\s+(?:as\s+)?(\w+)$/i, "$1").trim();
      });
      
      // Handle the special case where an aggregate function is applied to *
      columns = columns.map(col => col === "*" ? Object.keys(data[0]) : col).flat();
    }

    // Apply WHERE clause if present
    let filteredData = [...data];
    const whereClauseMatch = query.match(/where\s+(.*?)(?:order by|group by|limit|$)/i);
    
    if (whereClauseMatch) {
      const whereClause = whereClauseMatch[1].trim();
      console.log("WHERE Clause:", whereClause);
      
      // Split by AND if multiple conditions exist
      const conditions = whereClause.split(/\s+and\s+/i);
      
      conditions.forEach(condition => {
        // Support =, >, <, >=, <=, <>, LIKE operators
        const conditionMatch = condition.match(/(\w+)\s*([=<>!]+|like|in)\s*(['"]?)([^'"]+)\3/i);
        
        if (conditionMatch) {
          const [_, column, operator, _quote, valueStr] = conditionMatch;
          let value = valueStr.trim();
          
          // Convert to appropriate type if needed
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
                // Special handling for string numbers like GPA
                if (typeof row[column] === 'string' && !isNaN(parseFloat(row[column]))) {
                  const parsedValue = parseFloat(row[column]);
                  console.log(`Comparing GPA: ${row[column]} (${typeof row[column]}) -> ${parsedValue} > ${value}`, parsedValue > value);
                  // Force both to be numbers and use strict comparison
                  return Number(parsedValue) > Number(value);
                }
                return Number(row[column]) > value;
              });
              break;
            case "<":
              filteredData = filteredData.filter(row => {
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) < new Date(value);
                }
                // Special handling for string numbers like GPA
                if (typeof row[column] === 'string' && !isNaN(parseFloat(row[column]))) {
                  return Number(parseFloat(row[column])) < Number(value);
                }
                return Number(row[column]) < value;
              });
              break;
            case ">=":
              filteredData = filteredData.filter(row => {
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) >= new Date(value);
                }
                // Special handling for string numbers like GPA
                if (typeof row[column] === 'string' && !isNaN(parseFloat(row[column]))) {
                  return Number(parseFloat(row[column])) >= Number(value);
                }
                return Number(row[column]) >= value;
              });
              break;
            case "<=":
              filteredData = filteredData.filter(row => {
                if (column.toLowerCase().includes('date')) {
                  return new Date(row[column]) <= new Date(value);
                }
                // Special handling for string numbers like GPA
                if (typeof row[column] === 'string' && !isNaN(parseFloat(row[column]))) {
                  return Number(parseFloat(row[column])) <= Number(value);
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

    // Select only the requested columns
    const result = filteredData.map(row => {
      const selectedRow = {};
      columns.forEach(col => {
        if (row.hasOwnProperty(col)) {
          selectedRow[col] = row[col];
        }
      });
      return selectedRow;
    });

    setResult(result);
  };

  // Handle query change from the QueryEditor component
  const handleSelectedQueryChange = (queryId) => {
    const selectedQuery = queries.find(q => q.id === queryId);
    if (selectedQuery) {
      setSelectedQuery(selectedQuery);
      setQueryText(selectedQuery.query);
      
      // Immediately execute the query and show results
      console.log("Auto-executing selected query:", selectedQuery.query);
      setResult(selectedQuery.data);
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