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

    console.log("Executing query:", queryText);

    // Normalize query: convert to lowercase and remove extra whitespace
    const query = queryText.trim().toLowerCase();

    // Find the corresponding dataset based on the query text
    let dataset = queries.find(q => q.query.toLowerCase() === query);
    
    console.log("Found exact match for query:", dataset ? "yes" : "no");

    if (!dataset) {
      // If no exact match, try to find by table name
      const tableMatch = query.match(/from\s+(['"`]?)(\w+)\1(?:\s+(?:as\s+)?(\w+))?/i);
      if (!tableMatch) {
        alert("Invalid query! Cannot determine table name. Format: SELECT column1, column2 FROM table;");
        return;
      }
      const tableName = tableMatch[2];
      
      // Find the base dataset for this table
      dataset = queries.find(q => {
        const baseQuery = q.query.toLowerCase();
        return baseQuery.includes(`from ${tableName}`) && baseQuery.startsWith("select * from");
      });
    }
    
    if (!dataset) {
      alert("Query not found in predefined queries!");
      return;
    }

    console.log("Dataset found:", dataset.name);

    // Set the result
    setResult(dataset.data);
  };

  // Handle query change from the QueryEditor component
  const handleSelectedQueryChange = (queryId) => {
    const selectedQuery = queries.find(q => q.id === queryId);
    if (selectedQuery) {
      setSelectedQuery(selectedQuery);
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