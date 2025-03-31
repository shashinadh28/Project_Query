import React, { useState, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import QueryEditor from './components/QueryEditor';
import DataTable from './components/DataTable';
import { queries, students, employees, teachers } from './data';
import './App.scss';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleQueryChange = (event) => {
    setCurrentQuery(event.target.value);
    setError(null);
  };

  const handleSelectedQueryChange = (event) => {
    const selectedId = event.target.value;
    setSelectedQuery(selectedId);
    setError(null);

    if (selectedId) {
      const query = queries.find(q => q.id === selectedId);
      if (query) {
        setCurrentQuery(query.sql);
        executeQuery(query.sql);
      }
    }
  };

  const parseQuery = (query) => {
    const normalizedQuery = query.toLowerCase().trim();
    const selectMatch = normalizedQuery.match(/select\s+(.*?)\s+from\s+(\w+)/i);
    const whereMatch = normalizedQuery.match(/where\s+(.*?)(?:\s+order\s+by|\s+limit|$)/i);
    const orderByMatch = normalizedQuery.match(/order\s+by\s+(.*?)(?:\s+limit|$)/i);
    const limitMatch = normalizedQuery.match(/limit\s+(\d+)/i);

    return {
      select: selectMatch ? selectMatch[1] : '*',
      from: selectMatch ? selectMatch[2] : '',
      where: whereMatch ? whereMatch[1] : null,
      orderBy: orderByMatch ? orderByMatch[1] : null,
      limit: limitMatch ? parseInt(limitMatch[1]) : null
    };
  };

  const executeQuery = (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const parsedQuery = parseQuery(query);
      let dataset;

      if (query.toLowerCase().includes('students')) {
        dataset = students;
      } else if (query.toLowerCase().includes('employees')) {
        dataset = employees;
      } else if (query.toLowerCase().includes('teachers')) {
        dataset = teachers;
      }

      if (!dataset) {
        throw new Error('No matching dataset found');
      }

      let results = [...dataset];

      if (parsedQuery.where) {
        const conditions = parsedQuery.where.split(/\s+and\s+/i);
        results = results.filter(row => {
          return conditions.every(condition => {
            const [column, operator, value] = condition.split(/\s+/);
            const rowValue = row[column.toLowerCase()];

            if (operator === '>') {
              return parseFloat(rowValue) > parseFloat(value);
            } else if (operator === '<') {
              return parseFloat(rowValue) < parseFloat(value);
            } else if (operator === '=') {
              return rowValue == value;
            } else if (operator === '!=') {
              return rowValue != value;
            }
            return true;
          });
        });
      }

      if (parsedQuery.orderBy) {
        const [column, direction] = parsedQuery.orderBy.split(/\s+/);
        results.sort((a, b) => {
          const aValue = a[column.toLowerCase()];
          const bValue = b[column.toLowerCase()];
          return direction === 'desc' ? bValue - aValue : aValue - bValue;
        });
      }

      if (parsedQuery.limit) {
        results = results.slice(0, parsedQuery.limit);
      }

      setQueryResults(results);
    } catch (err) {
      setError(err.message);
      setQueryResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQuery = () => {
    if (!currentQuery.trim()) {
      setError('Please enter a query');
      return;
    }
    executeQuery(currentQuery);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <Container maxWidth="lg" className="position-locked">
        <Box className="query-section">
          <Box className="title-container">
            <Typography variant="h4" component="h1" className="title">
              SQL Query Runner
            </Typography>
            <IconButton 
              onClick={toggleDarkMode} 
              color="inherit"
              className="dark-mode-toggle"
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          <QueryEditor
            currentQuery={currentQuery}
            onQueryChange={handleQueryChange}
            selectedQuery={selectedQuery}
            onSelectedQueryChange={handleSelectedQueryChange}
            queries={queries}
            darkMode={darkMode}
          />

          <Box className="button-container">
            <Button
              variant="contained"
              color="primary"
              onClick={handleRunQuery}
              disabled={isLoading}
              className="run-button"
            >
              {isLoading ? 'Running...' : 'Run Query'}
            </Button>
          </Box>

          {error && (
            <Paper className="error-paper">
              <Typography color="error">{error}</Typography>
            </Paper>
          )}

          {queryResults.length > 0 && (
            <Box className="result-section">
              <DataTable data={queryResults} darkMode={darkMode} />
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default App;