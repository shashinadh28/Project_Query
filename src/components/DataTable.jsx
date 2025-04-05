import { useState, useMemo, useCallback } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Typography,
  Box,
  useTheme,
  Chip,
  Tooltip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  Button,
  useMediaQuery
} from '@mui/material';

/**
 * Custom pagination controls component
 */
function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const buttonStyle = {
    minWidth: isMobile ? '32px' : 'auto',
    padding: isMobile ? '4px 8px' : '6px 16px',
    margin: '0 4px',
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    transition: 'all 0.2s ease',
    borderRadius: '4px',
    fontWeight: 500,
    fontSize: isMobile ? '0.65rem' : '0.75rem',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&:disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    }
  };

  // Render appropriate buttons based on screen size
  const getPaginationButtons = () => {
    if (isMobile) {
      // Mobile view - compact buttons
      return (
        <>
          <Button
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
            variant="contained"
            sx={buttonStyle}
          >
            «
          </Button>
          <Button
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label="previous page"
            variant="contained"
            sx={buttonStyle}
          >
            ‹
          </Button>
          
          <Typography variant="body2" sx={{ mx: 1, fontSize: '0.75rem' }}>
            {page + 1}/{Math.ceil(count / rowsPerPage)}
          </Typography>
          
          <Button
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
            variant="contained"
            sx={buttonStyle}
          >
            ›
          </Button>
          <Button
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
            variant="contained"
            sx={buttonStyle}
          >
            »
          </Button>
        </>
      );
    } else if (isTablet) {
      // Tablet view - abbreviated labels
      return (
        <>
          <Button
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
            variant="contained"
            sx={buttonStyle}
          >
            FIRST
          </Button>
          <Button
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label="previous page"
            variant="contained"
            sx={buttonStyle}
          >
            PREV
          </Button>
          
          <Typography variant="body2" sx={{ mx: 2 }}>
            Page {page + 1} of {Math.ceil(count / rowsPerPage)}
          </Typography>
          
          <Button
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
            variant="contained"
            sx={buttonStyle}
          >
            NEXT
          </Button>
          <Button
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
            variant="contained"
            sx={buttonStyle}
          >
            LAST
          </Button>
        </>
      );
    } else {
      // Desktop view - full labels
      return (
        <>
          <Button
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
            variant="contained"
            sx={buttonStyle}
          >
            FIRST
          </Button>
          <Button
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label="previous page"
            variant="contained"
            sx={buttonStyle}
          >
            PREVIOUS
          </Button>
          
          <Typography variant="body2" sx={{ mx: 2 }}>
            Page {page + 1} of {Math.ceil(count / rowsPerPage)}
          </Typography>
          
          <Button
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
            variant="contained"
            sx={buttonStyle}
          >
            NEXT
          </Button>
          <Button
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
            variant="contained"
            sx={buttonStyle}
          >
            LAST
          </Button>
        </>
      );
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      {getPaginationButtons()}
    </Box>
  );
}

/**
 * DataTable component for displaying query results
 * Features sorting, pagination, and formatting for various data types
 */
const DataTable = ({ tableData = [] }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle page changes with loading indicator
  const handleChangePage = (event, newPage) => {
    setIsLoading(true);
    setTimeout(() => {
      setPage(newPage);
      setIsLoading(false);
    }, 150);
  };

  // Handle rows per page changes
  const handleChangeRowsPerPage = (event) => {
    setIsLoading(true);
    setTimeout(() => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
      setIsLoading(false);
    }, 150);
  };

  // Toggle sort order and column
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Compare function for sorting
  const descendingComparator = (a, b, orderBy) => {
    // Handle null values
    if (a[orderBy] === null && b[orderBy] !== null) return 1;
    if (a[orderBy] !== null && b[orderBy] === null) return -1;
    if (a[orderBy] === null && b[orderBy] === null) return 0;
    
    // String comparison
    if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
      return b[orderBy].localeCompare(a[orderBy]);
    }
    
    // Number comparison
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Optimized stable sort with large dataset handling
  const stableSort = useCallback((array, comparator) => {
    // For large datasets, only sort current page
    if (array.length > 1000) {
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      const pageData = array.slice(start, end);
      const sortedPage = pageData.sort((a, b) => comparator(a, b));
      return sortedPage;
    }
    
    // Standard sort for smaller datasets
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }, [page, rowsPerPage]);

  // Memoize sorted and paginated data
  const sortedData = useMemo(() => {
    if (!tableData.length) return [];
    
    const sortedRows = stableSort(tableData, getComparator(order, orderBy));
    
    // For large datasets, optimization
    if (tableData.length > 1000) {
      return sortedRows;
    }
    
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [tableData, order, orderBy, page, rowsPerPage, stableSort]);

  // Table metadata
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const isLargeDataset = tableData.length > 500;

  // Extract column definitions from data
  const columns = useMemo(() => {
    if (!tableData.length) return [];
    return Object.keys(tableData[0]);
  }, [tableData]);

  // Format cell data based on type and column
  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) return '-';
    
    // Boolean values
    if (typeof value === 'boolean') {
      return (
        <Chip
          label={value ? 'Yes' : 'No'}
          size="small"
          color={value ? 'success' : 'default'}
          variant="outlined"
          sx={{ minWidth: '60px', fontSize: '0.75rem' }}
        />
      );
    }
    
    // Date values
    if (column.includes('date') && typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString();
    }
    
    // Currency values
    if (column.includes('price') || column.includes('amount') || column.includes('salary')) {
      if (typeof value === 'number') {
        return `$${value.toLocaleString()}`;
      }
    }
    
    // Long text with truncation
    if (typeof value === 'string' && value.length > 30) {
      return (
        <Tooltip title={value} placement="top">
          <span>{value.substring(0, 27)}...</span>
        </Tooltip>
      );
    }
    
    return String(value);
  };

  // Empty state display
  if (!tableData || tableData.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 100,
          width: '100%',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No results to display
        </Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '4px'
      }}
    >
      {/* Status bar with record count and page size selector */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          px: 2, 
          py: 1, 
          borderBottom: `1px solid ${theme.palette.divider}`,
          gap: isMobile ? 1 : 0
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {tableData.length.toLocaleString()} total records
          {isLargeDataset && ' (large dataset)'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            Page {page + 1} of {totalPages}
          </Typography>
          
          <FormControl size="small" variant="standard" sx={{ minWidth: 80 }}>
          <Select
            value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              displayEmpty
              sx={{ 
                fontSize: '0.75rem',
                '&:hover': {
                  '.MuiSelect-select': {
                    color: theme.palette.primary.main
                  }
                }
              }}
            >
              {[5, 10, 25, 50, 100].map((option) => (
                <MenuItem key={option} value={option}>
                  {option} rows
                </MenuItem>
              ))}
              {tableData.length > 500 && (
                <MenuItem value={500}>500 rows</MenuItem>
              )}
          </Select>
        </FormControl>
        </Box>
      </Box>
      
      {/* Loading indicator */}
      {isLoading && <LinearProgress sx={{ height: 2 }} />}
      
      {/* Data table */}
      <TableContainer sx={{ maxHeight: 400, overflow: 'auto' }}>
        <Table stickyHeader size="small" aria-label="data table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column}
                  align="left"
                  sortDirection={orderBy === column ? order : false}
                  sx={{ 
                    fontWeight: 'bold',
                    bgcolor: theme.palette.primary.main,
                    color: '#fff',
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    padding: isMobile ? '6px 4px' : '16px',
                    '&:hover': {
                      bgcolor: theme.palette.primary.dark,
                    }
                  }}
                  onClick={() => handleRequestSort(column)}
                >
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : 'asc'}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        color: '#fff !important',
                      },
                      '&.Mui-active': {
                        color: '#fff !important',
                      },
                      '&:hover': {
                        color: '#fff !important',
                      },
                      color: '#fff !important',
                    }}
                  >
                    {column.replace(/_/g, ' ')}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex}
                hover
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:nth-of-type(odd)': {
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.02)' 
                      : 'rgba(0, 0, 0, 0.01)',
                  },
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(25, 118, 210, 0.05)',
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={`${rowIndex}-${column}`} 
                    component="td" 
                    scope="row"
                    sx={{ 
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      py: 1,
                      px: isMobile ? 1 : 2,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatCellValue(row[column], column)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        p: isMobile ? 1 : 2, 
        borderTop: `1px solid ${theme.palette.divider}`,
        overflowX: 'auto',
        width: '100%'
      }}>
        <TablePaginationActions
          count={tableData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
        />
      </Box>
    </Paper>
  );
};

export default DataTable;