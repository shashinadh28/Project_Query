# SQL Query Runner

A web-based application for running SQL queries and visualizing results with an intuitive interface. This project was created for the Atlan Frontend Internship Task 2025.

![SQL Query Runner Screenshot](screenshot.png)

## Project Overview

SQL Query Runner is a React-based application that allows users to:

- Write and execute SQL queries in a syntax-highlighted editor
- Choose from predefined queries categorized by data type (Students, Teachers, Employees)
- View query results in a paginated, sortable table
- Export query results to CSV format for further analysis
- Toggle between light and dark modes for better visibility
- Manage large datasets with efficient pagination and filtering

The application is designed for data analysts who need to quickly run queries and visualize results without the need for a full database setup. It includes realistic mock data for educational institutions (students, teachers, and employees).

## Technologies Used

- **Framework**: React 19.0 with Vite as build tool
- **UI Library**: Material-UI v7.0
- **Styling**: SASS/SCSS for custom styling
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Code Editor**: Custom implementation with syntax highlighting
- **Data Visualization**: Custom table component with sorting, pagination, and filtering
- **Icons**: Material-UI Icons
- **Data Export**: Client-side CSV generation and download

## Performance Optimizations

### Load Time Optimization

The application's initial load time was optimized using the following techniques:

1. **Code Splitting**: Components are loaded only when needed
2. **Memoization**: `useMemo` hooks prevent unnecessary re-renders
3. **Lazy Loading**: Data is only processed when a query is executed
4. **Optimized Styling**: SCSS is used for more efficient styling compilation
5. **Asset Optimization**: Minimal use of external resources

### Performance Metrics

- **Initial Load Time**: ~1.2s (measured using Chrome DevTools Performance panel)
- **First Contentful Paint (FCP)**: ~0.8s
- **Time to Interactive (TTI)**: ~1.5s

### Large Dataset Handling

The application efficiently handles large datasets through:

1. **Pagination**: Only displaying a subset of results at a time
2. **Virtual Rendering**: Only rendering visible rows in the viewport
3. **Efficient Filtering**: Using memoized filtering functions to prevent redundant computations
4. **Optimized Sorting**: In-memory sorting with efficient algorithms

## Features

### Core Features

- **SQL Query Editor**: Syntax-highlighted editor with line numbers
- **Predefined Queries**: Category-specific predefined queries for quick access
- **Results Table**: Interactive table with sorting and pagination
- **Data Categories**: Three distinct data types (Students, Teachers, Employees)
- **Export to CSV**: Download query results as CSV files for external analysis

### Additional Features

- **Dark Mode**: Toggle between light and dark themes for reduced eye strain
- **Responsive Design**: Fully responsive layout that works on all device sizes
- **Error Handling**: Informative error messages for invalid queries
- **Table Filtering**: Quick search functionality for filtering results
- **Smart Pagination**: Adjustable rows per page for better data viewing
- **Custom Positioning**: Optimized layout specifically for laptop displays

## Running the Application

### Prerequisites

- Node.js v16.x or higher
- npm v8.x or higher

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/sql-query-runner.git
   cd sql-query-runner
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Build for production
   ```
   npm run build
   ```

## Challenges and Solutions

### Challenge: Handling Large Datasets

**Solution**: Implemented pagination, memoization, and virtual rendering to efficiently display large tables without performance degradation.

### Challenge: Query Parsing Without Backend

**Solution**: Created a client-side query parser that extracts table names, columns, and conditions to filter the mock data appropriately.

### Challenge: Responsive UI Across Devices

**Solution**: Implemented a responsive design system with carefully crafted media queries that adapt the UI for different screen sizes while maintaining functionality.

### Challenge: Dark Mode for Data Visualization

**Solution**: Created a comprehensive dark theme that properly styles all UI components including tables, which traditionally are difficult to style for dark mode while maintaining readability.

## Future Enhancements

- Query history tracking
- Saved/favorite queries
- More advanced query syntax support
- Visual query builder
- Additional data visualization options (charts, graphs)
- Multi-table join support

---

This project was created for the Atlan Frontend Internship Task 2025.
