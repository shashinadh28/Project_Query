import { useState } from 'react';
import { TextField, Paper, Typography, Box, useTheme } from '@mui/material';

const QueryEditor = ({ value, onChange, darkMode }) => {
  const [cursorPosition, setCursorPosition] = useState(0);
  const theme = useTheme();
  
  // Handle query change in text editor
  const handleChange = (e) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Generate line numbers dynamically
  const lineNumbers = value.split('\n').map((_, i) => i + 1).join('\n');

  // Get table name from the current query
  const getTableName = () => {
    const match = value.match(/from\s+(['"`]?)(\w+)\1/i);
    return match ? match[2] : 'table';
  };

  // Determine colors based on theme
  const editorBgColor = darkMode ? '#2d2d2d' : '#f5f5f5';
  const lineNumberColor = darkMode ? '#888' : '#666';
  const textColor = darkMode ? '#fff' : 'inherit';
  const borderColor = darkMode ? '#555' : '#ccc';

  return (
    <Box className="query-editor-container" sx={{ width: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>
        Write your SQL query below:
      </Typography>

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
          value={value}
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
        Position: {cursorPosition} | Lines: {value.split('\n').length}
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