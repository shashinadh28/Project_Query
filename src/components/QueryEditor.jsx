import React from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box,
  Typography
} from '@mui/material';

const QueryEditor = ({ 
  currentQuery, 
  onQueryChange, 
  selectedQuery, 
  onSelectedQueryChange, 
  queries,
  darkMode 
}) => {
  return (
    <Box className="query-editor">
      <FormControl fullWidth>
        <InputLabel id="query-select-label">Predefined Queries</InputLabel>
        <Select
          labelId="query-select-label"
          value={selectedQuery}
          onChange={onSelectedQueryChange}
          label="Predefined Queries"
          className="query-select"
        >
          {queries.map((query) => (
            <MenuItem key={query.id} value={query.id}>
              {query.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        multiline
        rows={4}
        value={currentQuery}
        onChange={onQueryChange}
        placeholder="Enter your SQL query here..."
        className="query-input"
        InputProps={{
          style: {
            fontFamily: 'monospace',
            fontSize: '14px',
            backgroundColor: darkMode ? '#1e1e1e' : '#fff',
            color: darkMode ? '#fff' : '#000'
          }
        }}
      />
    </Box>
  );
};

export default QueryEditor;