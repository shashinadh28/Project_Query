import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, FormControl, MenuItem, Select, IconButton, useMediaQuery } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import QueryEditor from './components/QueryEditor';
import DataTable from './components/DataTable';
import { executeQuery, queryCategories } from './data';
import './App.scss';

const App = () => {
  // State management
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [selectedCategory, setSelectedCategory] = useState('users');
  const [availableQueries, setAvailableQueries] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [queryText, setQueryText] = useState('');
  const [queryResults, setQueryResults] = useState([]);
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  
  // Responsive design hooks
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');

  // Theme configuration
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      h1: {
        fontSize: isMobile ? '1.6rem' : '2.2rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: isMobile ? '1.4rem' : '1.8rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: isMobile ? '0.875rem' : '1rem',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease',
          },
        },
      },
    },
  });

  // Update queries when category changes
  useEffect(() => {
    const category = queryCategories.find(cat => cat.id === selectedCategory);
    if (category) {
      setAvailableQueries(category.queries);
      // Auto-select first query in category if none selected
      if (!selectedQueryId || !category.queries.find(q => q.id === selectedQueryId)) {
        setSelectedQueryId(category.queries[0]?.id || null);
        setQueryText(category.queries[0]?.query || '');
      }
    } else {
      setAvailableQueries([]);
    }
  }, [selectedCategory, selectedQueryId]);

  // Store dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Handle category selection change
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
  };

  // Handle query selection change
  const handleQueryChange = (event) => {
    const queryId = parseInt(event.target.value);
    setSelectedQueryId(queryId);
    
    const selectedQuery = availableQueries.find(q => q.id === queryId);
    if (selectedQuery) {
      setQueryText(selectedQuery.query);
    }
  };

  // Handle query text changes from editor
  const handleQueryTextChange = (newValue) => {
    setQueryText(newValue);
  };

  // Execute the current query
  const runQuery = () => {
    if (!queryText.trim()) return;
    
    setIsRunningQuery(true);
    
    // Simulate network delay for realistic experience
    setTimeout(() => {
      try {
        const results = executeQuery(queryText);
        setQueryResults(results);
      } catch (error) {
        console.error('Query execution error:', error);
        // In a real app, you would handle this better
        setQueryResults([]);
      } finally {
        setIsRunningQuery(false);
      }
    }, 600);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        className="app-container" 
        sx={{ 
          bgcolor: 'background.default',
          minHeight: '100vh',
          p: isMobile ? 2 : 3,
          transition: 'all 0.3s ease'
        }}
      >
        <Box className="app-header" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ flex: 1 }}></Box>
            <Typography 
              variant="h1" 
              color="primary" 
              sx={{ 
                fontWeight: 600,
                fontSize: isMobile ? '1.5rem' : isTablet ? '1.8rem' : '2rem',
                textAlign: 'center',
                flex: 1,
                whiteSpace: 'nowrap',
                paddingRight: '20px'
              }}
            >
              SQL Query Runner
            </Typography>
            
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton 
                onClick={() => setDarkMode(!darkMode)} 
                color="inherit" 
                aria-label="toggle theme"
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Box>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3, 
              maxWidth: '800px',
              fontSize: isMobile ? '0.875rem' : '1rem',
            }}
          >
            Tip: Select a data category, choose a predefined query or write your own SQL, then click "Run Query" to see results.
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 2, 
              mb: 2,
              alignItems: 'center'
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 450, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                Select Data Category:
              </Typography>
              <FormControl fullWidth size="medium">
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  sx={{ 
                    borderRadius: '4px',
                    bgcolor: 'background.paper',
                    height: '50px',
                    fontSize: '1.1rem'
                  }}
                >
                  {queryCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ width: '100%', maxWidth: 450, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
                Select Query:
              </Typography>
              <FormControl fullWidth size="medium">
                <Select
                  value={selectedQueryId || ''}
                  onChange={handleQueryChange}
                  sx={{ 
                    borderRadius: '4px',
                    bgcolor: 'background.paper',
                    height: '50px',
                    fontSize: '1.1rem'
                  }}
                >
                  {availableQueries.map((query) => (
                    <MenuItem key={query.id} value={query.id}>
                      {query.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
        
        <Box className="app-content">
          <QueryEditor 
            queryText={queryText} 
            onQueryTextChange={handleQueryTextChange} 
            onRunQuery={runQuery}
            isRunning={isRunningQuery}
            darkMode={darkMode}
          />
          
          <DataTable tableData={queryResults} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;