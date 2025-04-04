import React from 'react';
import { useState, useMemo } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Box, Typography, 
  TextField, InputAdornment, IconButton, 
  Select, MenuItem, FormControl, InputLabel,
  useTheme
} from '@mui/material';

// This would be much better with actual icons from an icon library
// but we'll use simple text as placeholders
const SearchIcon = () => <span>🔍</span>;
const SortIcon = () => <span>↕️</span>;

const DataTable = ({ data, darkMode }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Get columns from the first data row
  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
  
  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!data || data.length === 0 || !searchQuery) {
      return data;
    }
    
    return data.filter(row => {
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery]);
  
  // Sort data based on sort config
  const sortedData = useMemo(() => {
    if (!filteredData || filteredData.length === 0 || !sortConfig.key) {
      return filteredData;
    }
    
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] === null) return 1;
      if (b[sortConfig.key] === null) return -1;
      
      const aValue = typeof a[sortConfig.key] === 'string' ? 
          a[sortConfig.key].toLowerCase() : a[sortConfig.key];
      const bValue = typeof b[sortConfig.key] === 'string' ? 
          b[sortConfig.key].toLowerCase() : b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);
  
  // Paginate the sorted data
  const paginatedData = useMemo(() => {
    if (!sortedData || sortedData.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);
  
  // Request sort for a column
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Calculate total pages
  const totalPages = Math.ceil((sortedData?.length || 0) / rowsPerPage);

  // Export data to CSV
  const exportToCSV = () => {
    if (data.length === 0) return;
    
    // Create CSV content
    const csvHeader = columns.join(',');
    const csvContent = sortedData.map(row => {
      return columns.map(column => {
        // Handle values with commas by wrapping in quotes
        const cellValue = row[column] === null ? '' : String(row[column]);
        return cellValue.includes(',') ? `"${cellValue}"` : cellValue;
      }).join(',');
    }).join('\n');
    
    const csv = [csvHeader, ...csvContent.split('\n')].join('\n');
    
    // Create a blob and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'query_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // No data case
  if (!data || data.length === 0) {
    return (
      <Typography variant="body1" style={{ textAlign: 'center', padding: '20px' }}>
        No results found
      </Typography>
    );
  }

  return (
    <div className="result-container">
      {/* Table Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        {/* Search */}
        <TextField
          placeholder="Search results..."
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            '& .MuiInputBase-root': { 
              color: 'inherit',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'inherit' 
            } 
          }}
        />
        
        {/* Rows per page */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="rows-per-page-label">Rows</InputLabel>
          <Select
            labelId="rows-per-page-label"
            value={rowsPerPage}
            label="Rows"
            onChange={(e) => {
              setRowsPerPage(e.target.value);
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}
            sx={{ 
              color: 'inherit',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'inherit' 
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Results Summary and Export Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ textAlign: 'left' }}>
          Showing {paginatedData.length} of {sortedData.length} results
          {searchQuery && ` (filtered from ${data.length} total)`}
        </Typography>
        
        <Button 
          variant="outlined" 
          size="small"
          onClick={exportToCSV}
          sx={{ ml: 2 }}
        >
          Export to CSV
        </Button>
      </Box>
      
      {/* Table */}
      <TableContainer 
        component={Paper} 
        className="table-container"
        sx={{
          backgroundColor: isDarkMode ? '#2c2c2c' : 'inherit'
        }}
      >
        <Table className="result-table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell 
                  key={index} 
                  align="center"
                  onClick={() => requestSort(column)}
                  sx={{ 
                    cursor: 'pointer',
                    backgroundColor: sortConfig.key === column 
                      ? (isDarkMode ? '#3a3a3a' : '#f0f0f0') 
                      : (isDarkMode ? '#0d47a1' : '#1976d2'),
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: isDarkMode ? '#265099' : '#1565c0'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography fontWeight="bold">{column}</Typography>
                    {sortConfig.key === column && (
                      <Typography component="span" sx={{ ml: 1 }}>
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
                sx={{ 
                  '&:nth-of-type(odd)': { 
                    backgroundColor: isDarkMode ? '#333' : '#f9f9f9' 
                  },
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#3a3a3a' : '#f5f5f5'
                  }
                }}
              >
                {columns.map((column, colIndex) => (
                  <TableCell 
                    key={colIndex} 
                    align="center"
                    sx={{ color: 'inherit', borderBottom: isDarkMode ? '1px solid #444' : undefined }}
                  >
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Box>
          <Button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            sx={{ mr: 1 }}
          >
            First
          </Button>
          <Button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
        </Box>
        
        <Typography>
          Page {currentPage} of {Math.max(1, totalPages)}
        </Typography>
        
        <Box>
          <Button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            sx={{ mr: 1 }}
          >
            Next
          </Button>
          <Button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(totalPages)}
          >
            Last
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default DataTable;