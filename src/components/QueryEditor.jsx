import { useState, useEffect } from 'react';
import { TextField, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem, useTheme } from '@mui/material';
import { queries } from '../data'; // Import the queries from data.js

const QueryEditor = ({ 
  queryText = '', // Add default value
  setQueryText, 
  setTableData, 
  selectedQueryId, 
  relevantQueries = [], 
  onQuerySelect 
}) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedPredefQueryId, setSelectedPredefQueryId] = useState(null);
  const theme = useTheme();
  
  // Reset predefined query selection when relevant queries change
  useEffect(() => {
    setSelectedPredefQueryId(null);
  }, [relevantQueries]);

  // Sync with parent's selected query ID
  useEffect(() => {
    if (selectedQueryId) {
      setSelectedPredefQueryId(selectedQueryId);
    }
  }, [selectedQueryId]);

  // Handle query change in text editor
  const handleChange = (e) => {
    setQueryText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Handle predefined query selection
  const handleQuerySelection = (e) => {
    const queryId = parseInt(e.target.value);
    if (!queryId) {
      setSelectedPredefQueryId(null);
      return;
    }
    
    const selectedQuery = queries.find(q => q.id === queryId);
    if (selectedQuery) {
      setSelectedPredefQueryId(queryId);
      setQueryText(selectedQuery.query); // Update text editor with the query
      
      // Notify parent component about the selection
      if (onQuerySelect) {
        onQuerySelect(queryId);
      }
      
      if (setTableData) {
        setTableData([]); // Clear previous results
      }
    }
  };

  // Generate line numbers dynamically
  const lineNumbers = (queryText || '').split('\n').map((_, i) => i + 1).join('\n');

  // Get table name from the current query
  const getTableName = () => {
    if (!queryText) return 'table';
    const match = queryText.match(/from\s+(['"`]?)(\w+)\1/i);
    return match ? match[2] : 'table';
  };

  // Determine colors based on theme
  const editorBgColor = theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5';
  const lineNumberColor = theme.palette.mode === 'dark' ? '#888' : '#666';
  const textColor = theme.palette.mode === 'dark' ? '#fff' : 'inherit';
  const borderColor = theme.palette.mode === 'dark' ? '#555' : '#ccc';

  return (
    <Box className="query-editor-container" sx={{ width: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>
        Write your SQL query below:
      </Typography>

      {/* Dropdown to select predefined queries - without label */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select 
          value={selectedPredefQueryId || ''}
          onChange={handleQuerySelection}
          displayEmpty
          placeholder="Select a query"
        >
          <MenuItem value="">-- Select a Query --</MenuItem>
          {relevantQueries.map(q => (
            <MenuItem key={q.id} value={q.id}>
              {q.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Query Editor */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 1, 
          display: 'flex', 
          position: 'relative', 
          backgroundColor: editorBgColor,
          transition: 'background-color 0.3s ease'
        }}
      >
        {/* Line Numbers */}
        <Box 
          sx={{ 
            pr: 1, 
            borderRight: `1px solid ${borderColor}`, 
            color: lineNumberColor,
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            textAlign: 'right',
            userSelect: 'none',
            paddingRight: '8px',
            marginRight: '8px',
            transition: 'color 0.3s ease, border-color 0.3s ease'
          }}
        >
          {lineNumbers}
        </Box>
        
        {/* Text Field for Query Input */}
        <TextField
          value={queryText || ''}
          onChange={handleChange}
          onSelect={(e) => setCursorPosition(e.target.selectionStart)}
          multiline
          fullWidth
          variant="standard"
          InputProps={{
            disableUnderline: true,
            style: {
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              color: textColor
            }
          }}
          placeholder="SELECT * FROM table WHERE condition;"
          sx={{ 
            backgroundColor: 'transparent',
            '& .MuiInputBase-root': { p: 0 },
            '& .MuiInputBase-input': { 
              color: textColor,
              transition: 'color 0.3s ease' 
            }
          }}
        />
      </Paper>

      {/* Display Cursor Position & Line Count */}
      <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right', color: '#666' }}>
        Position: {cursorPosition} | Lines: {(queryText || '').split('\n').length}
      </Typography>

      {/* Example Queries and Tips */}
      <Box sx={{ mt: 2, textAlign: 'left' }}>
        <Typography variant="caption" sx={{ display: 'block', color: '#666', fontStyle: 'italic' }}>
          Examples: 
          <br />• SELECT * FROM {getTableName()}
          <br />• SELECT name, email FROM {getTableName()} WHERE status = 'Active'
        </Typography>
      </Box>
    </Box>
  );
};

export default QueryEditor;