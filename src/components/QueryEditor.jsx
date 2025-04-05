import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * SQL Query Editor component
 * Provides a text area for SQL input and execution controls
 */
const QueryEditor = ({ 
  queryText, 
  onQueryTextChange, 
  onRunQuery, 
  isRunning,
  darkMode,
  queryResults = [] 
}) => {
  const [editorHeight, setEditorHeight] = useState(200);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Adjust editor height based on window size
  useEffect(() => {
    const updateHeight = () => {
      if (window.innerHeight < 600) {
        setEditorHeight(150);
      } else if (window.innerHeight < 900) {
        setEditorHeight(200);
      } else {
        setEditorHeight(250);
      }
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Handle keyboard shortcuts (Ctrl+Enter to run query)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRunQuery();
    }
  };

  // Export query results to CSV
  const exportToCSV = () => {
    if (!queryResults || queryResults.length === 0) return;
    
    try {
      // Get headers from the first result
      const headers = Object.keys(queryResults[0]);
      
      // Convert data to CSV format
      const csvRows = [];
      
      // Add headers row
      csvRows.push(headers.join(','));
      
      // Add data rows
      queryResults.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      });
      
      // Combine into CSV string
      const csvString = csvRows.join('\n');
      
      // Create download link
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `sql-query-results-${timestamp}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      // Append link, trigger download, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      // In a real app, you would show an error message to the user
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        width: '100%', 
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          p: 1, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main,
          color: '#fff'
        }}
      >
        <Typography 
          variant={isMobile ? "caption" : "body2"} 
          fontWeight={500}
        >
          SQL QUERY EDITOR
        </Typography>
        
        <Typography 
          variant="caption" 
          component="div"
          sx={{ 
            fontFamily: 'monospace',
            opacity: 0.8 
          }}
        >
          Ctrl+Enter to Run
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        <textarea
          value={queryText}
          onChange={(e) => onQueryTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter SQL query here..."
          style={{
            width: '100%',
            height: `${editorHeight}px`,
            padding: '12px',
            fontFamily: 'monospace',
            fontSize: isMobile ? '13px' : '14px',
            lineHeight: '1.5',
            resize: 'none',
            border: 'none',
            outline: 'none',
            backgroundColor: darkMode ? '#1e1e1e' : '#f8f9fa',
            color: darkMode ? '#e6e6e6' : '#333',
            caretColor: theme.palette.primary.main,
          }}
        />
        
        {isRunning && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              zIndex: 1 
            }}
          >
            <CircularProgress size={32} thickness={4} />
          </Box>
        )}
      </Box>
      
      <Box 
        sx={{ 
          p: 1.5,
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
        }}
      >
        <Tooltip title="Export results to CSV file">
          <span>
            <Button
              variant="outlined"
              color="primary"
              onClick={exportToCSV}
              disabled={!queryResults || queryResults.length === 0}
              startIcon={<DownloadIcon />}
              size={isMobile ? "small" : "medium"}
              sx={{
                fontWeight: 500,
                minWidth: isMobile ? '80px' : '120px',
                transition: 'all 0.2s ease',
              }}
            >
              Export CSV
            </Button>
          </span>
        </Tooltip>
        
        <Button
          variant="contained"
          color="primary"
          onClick={onRunQuery}
          disabled={isRunning || !queryText.trim()}
          startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : null}
          size={isMobile ? "small" : "medium"}
          sx={{
            fontWeight: 500,
            minWidth: isMobile ? '80px' : '120px',
            transition: 'all 0.2s ease',
          }}
        >
          {isRunning ? 'Running...' : 'Run Query'}
        </Button>
      </Box>
    </Paper>
  );
};

export default QueryEditor;