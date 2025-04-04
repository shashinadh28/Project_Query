import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';

/**
 * SQL Query Editor component
 * Provides a text area for SQL input and execution controls
 */
const QueryEditor = ({ 
  queryText, 
  onQueryTextChange, 
  onRunQuery, 
  isRunning,
  darkMode 
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
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
        }}
      >
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