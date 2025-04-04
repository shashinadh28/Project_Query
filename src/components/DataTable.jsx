import React, { useState, useMemo } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Box, Typography, 
  TextField, InputAdornment, 
  Select, MenuItem, FormControl, InputLabel,
  useTheme
} from '@mui/material';

// This would be much better with actual icons from an icon library
// but we'll use simple text as placeholders
const SearchIcon = () => <span>🔍</span>;
const SortIcon = () => <span>↕️</span>;

const DataTable = ({ data }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
  
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
  
  const paginatedData = useMemo(() => {
    if (!sortedData || sortedData.length === 0) {
      return [];
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);
  
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const totalPages = Math.ceil((sortedData?.length || 0) / rowsPerPage);

  const exportToCSV = () => {
    if (data.length === 0) return;
    
    const csvHeader = columns.join(',');
    const csvContent = sortedData.map(row => {
      return columns.map(column => {
        const cellValue = row[column] === null ? '' : String(row[column]);
        return cellValue.includes(',') ? `"${cellValue}"` : cellValue;
      }).join(',');
    }).join('\n');
    
    const csv = [csvHeader, ...csvContent.split('\n')].join('\n');
    
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
                    <Typography fontWeight="bold">
                      {column.replace(/_/g, ' ').toUpperCase()}
                    </Typography>
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
      <Box className="pagination-controls">
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          First
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography 
          variant="body1" 
          className="page-indicator"
          sx={{ 
            backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
            color: isDarkMode ? '#e0e0e0' : 'inherit'
          }}
        >
          Page {currentPage} of {totalPages || 1}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setCurrentPage((prev) => prev < totalPages ? prev + 1 : prev)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage >= totalPages}
        >
          Last
        </Button>
      </Box>
    </div>
  );
};

export default DataTable;