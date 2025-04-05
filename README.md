# SQL Query Runner

A lightweight, high-performance SQL query execution interface built with React and Material UI.

---

## 🔗 Submission Summary

- 🔥 **Live App**: https://project-query-phi.vercel.app/
- 💻 **GitHub Repository**: [github.com/shashinadh28/Project_Query](https://github.com/shashinadh28/Project_Query)
 
---


## Overview

- SQL Query Runner is a React-based application that allows users to:

- Write and execute SQL queries in a syntax-highlighted editor

- Choose from predefined queries categorized by data type (Students, Teachers, Employees)

- View query results in a paginated, sortable table

- Export query results to CSV format

- Toggle between light and dark modes

- Handle large datasets efficiently with optimized performance features

- The interface is designed for usability and scalability with a clean architecture and responsive layout.


  ## Problem Statement
The task required building a SQL query execution interface that:
- Accepts SQL queries through a text area or code editor
- Works without a backend or query engine
- Displays results in a table format
- Supports multiple predefined queries with toggling mechanism
- Handles large datasets efficiently

  ## Solution Approach
I implemented a client-side solution that:
- Uses mock data from predefined categories (Students, Teachers, Employees)
- Simulates SQL query execution through client-side parsing
- Provides an interactive table with sorting, filtering, and pagination
- Implements a dropdown system for query selection
- Optimizes performance for large datasets
  

## System Architecture

The SQL Query Runner follows a component-based architecture with clean separation of concerns:


The architecture consists of three main layers:
- **UI Component Layer**: Handles rendering and user interactions
- **State Management Layer**: Manages application state using React Hooks
- **Data Services Layer**: Handles data processing, query execution, and formatting

- ![System Architecture](public/system-architecture.svg)


## Data Model

The application works with a relational data model consisting of several interconnected entities:

![ER Diagram](public/er-diagram.svg)

This entity relationship diagram shows the structure of the sample datasets available in the application, including:
- Users and their relationship to orders
- Products, categories, and order items
- Employees and departments

## Features

- **Interactive Query Editor**: Write custom SQL queries or choose from predefined templates
- **Multiple Data Categories**: Explore Users, Products, Orders, and Employee datasets
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes for different lighting conditions
- **Advanced Data Table**:
  - Client-side pagination
  - Column sorting
  - Data type formatting
  - Row hover effects
- **Performance Optimized**:
  - Handles datasets with 10,000+ rows
  - Virtualized rendering for large data
  - Memoized component updates
  - Lazy loading of data

## Technical Stack

- **Framework**: React 18 with Vite
- **UI Library**: Material UI (MUI) 5.x
- **Styling**: SCSS with CSS modules
- **State Management**: React Hooks and Context API

## 🚀 Performance Metrics

| Metric                    | Value     |
|---------------------------|-----------|
| Initial Load Time         | ~1.2s     |
| Time to Interactive       | ~1.5s     |
| First Contentful Paint    | ~800ms    |
| Memory Usage (10k rows)   | ~50MB     |




#### Component Structure
1. **App.jsx**
   - Main application container
   - Manages global state and theme
   - Handles query execution logic

2. **QueryEditor.jsx**
   - Syntax-highlighted SQL editor
   - Predefined query selection
   - Query validation

3. **DataTable.jsx**
   - Custom table component
   - Handles sorting, filtering, and pagination
   - CSV export functionality
     
## Performance Optimizations

1. **Data Virtualization**:
   - Implemented JavaScript Proxy for on-demand data generation
   - Only materializes visible data when needed

2. **Rendering Optimizations**:
   - Memoized expensive computations with `useMemo` and `useCallback`
   - Conditional rendering to reduce DOM operations
   - Dynamic content sizing based on viewport

3. **Resource Management**:
   - Optimized sorting algorithms for large datasets
   - Efficient memory usage with proxy data structures
   - Progressive loading with visual feedback

## Setup and Installation

1. **Clone the repository**
   ```
   git clone https://github.com/shashinadh28/Project_Query.git
   cd sql-query-runner
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Start development server**
   ```
   npm run dev
   ```

4. **Build for production**
   ```
   npm run build
   ```

5. **Preview production build**
   ```
   npm run preview
   ```

## Project Structure

```
sql-query-runner/
├── src/
│   ├── components/
│   │   ├── DataTable.jsx    (Results visualization)
│   │   └── QueryEditor.jsx  (SQL editor interface)
│   │
│   ├── App.jsx             (Main application)
│   ├── App.scss            (Styling)
│   ├── data.js             (Mock data and queries)
│   └── main.jsx            (Entry point)
├── public/                 (Static assets)
├── index.html              (HTML template)
├── vite.config.js          (Vite configuration)
└── vercel.json             (Deployment configuration)
```


### Large Dataset Handling

The application can handle datasets with thousands of rows through:
- Efficient pagination controls
- Progressive loading with visual feedback
- Optimized sorting for visible data only
- Memory-efficient data structures

### Responsive Design

- Adapts to different screen sizes from mobile to desktop
- Adjusts layout for optimal viewing on each device
- Maintains functionality across viewport sizes

### Development Decisions

- Chose Material UI for its accessibility features and design system
- Used function components with hooks for better performance
- Implemented data proxies for handling large datasets without memory issues
- Added theme toggle for better user experience in different lighting conditions

## Future Enhancements

- Query history tracking
- Export results to CSV/Excel
- Real-time collaboration
- Custom column resizing
- Additional visualization options (charts)

## Deployment

This project is configured for deployment on Vercel with the included `vercel.json` configuration.


## Challenges and Solutions
1. **Large Dataset Handling**
   - Challenge: Managing large datasets efficiently
   - Solution: Implemented client-side pagination and optimized rendering

2. **Query Parsing**
   - Challenge: Simulating SQL execution without a backend
   - Solution: Created client-side parser for table names and conditions

3. **Dark Mode Implementation**
   - Challenge: Ensuring consistent dark mode across all components
   - Solution: Used CSS variables and Material-UI theme system

## Future Enhancements
- Query history tracking
- Advanced query syntax support
- Multiple table join support
- Advanced visualization options
- Query validation
- Query execution time tracking

## Live Demo
Visit the deployed application at: https://project-query-phi.vercel.app/


## OUTPUT
![Screenshot 2025-04-05 124209](https://github.com/user-attachments/assets/3d09a362-eed0-410e-963a-06c075d197ba)

 ![Screenshot 2025-04-05 124226](https://github.com/user-attachments/assets/d184668f-e08a-4df5-83db-c53b250a7b14)

![Screenshot 2025-04-05 124237](https://github.com/user-attachments/assets/a43acdcc-50a2-4365-88c5-2f9fbe4637d4)


![Screenshot 2025-04-05 124247](https://github.com/user-attachments/assets/575a1551-32b7-40c5-9b33-4d4899c9f197)


## License

MIT

---

Created for the Atlan Frontend Internship Task 2025 by Durgashashinadh .
