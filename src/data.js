/**
 * SQL Query Runner - Data Generator Module
 * 
 * Provides data and query generators for the SQL Query Runner application
 * Creates sample datasets for users, products, orders, and employees
 * Implements memory-efficient lazy loading for large datasets
 */

// Base datasets
const usersBase = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', signup_date: '2022-01-15', is_active: true, account_type: 'premium', last_login: '2023-04-10' },
  { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', signup_date: '2022-02-20', is_active: true, account_type: 'free', last_login: '2023-04-05' },
  { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', signup_date: '2022-03-10', is_active: false, account_type: 'premium', last_login: '2023-03-28' },
  { id: 4, name: 'Emily Wilson', email: 'emily.wilson@example.com', signup_date: '2022-04-05', is_active: true, account_type: 'enterprise', last_login: '2023-04-09' },
  { id: 5, name: 'Michael Brown', email: 'michael.brown@example.com', signup_date: '2022-05-12', is_active: true, account_type: 'free', last_login: '2023-04-01' },
  { id: 6, name: 'Sarah Miller', email: 'sarah.miller@example.com', signup_date: '2022-06-18', is_active: true, account_type: 'premium', last_login: '2023-04-08' },
  { id: 7, name: 'David Garcia', email: 'david.garcia@example.com', signup_date: '2022-07-22', is_active: false, account_type: 'free', last_login: '2023-02-15' },
  { id: 8, name: 'Linda Martinez', email: 'linda.martinez@example.com', signup_date: '2022-08-30', is_active: true, account_type: 'enterprise', last_login: '2023-04-07' },
];

const productsBase = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock_quantity: 45, rating: 4.7, release_date: '2022-08-15' },
  { id: 2, name: 'Smartphone X', category: 'Electronics', price: 899.99, stock_quantity: 120, rating: 4.5, release_date: '2022-09-20' },
  { id: 3, name: 'Wireless Headphones', category: 'Electronics', price: 199.99, stock_quantity: 78, rating: 4.3, release_date: '2022-06-10' },
  { id: 4, name: 'Organic Coffee', category: 'Food', price: 12.99, stock_quantity: 200, rating: 4.8, release_date: '2022-04-05' },
  { id: 5, name: 'Cotton T-Shirt', category: 'Clothing', price: 19.99, stock_quantity: 150, rating: 4.2, release_date: '2022-03-15' },
  { id: 6, name: 'Yoga Mat', category: 'Fitness', price: 29.99, stock_quantity: 65, rating: 4.6, release_date: '2022-07-12' },
  { id: 7, name: 'Water Bottle', category: 'Fitness', price: 14.99, stock_quantity: 180, rating: 4.4, release_date: '2022-05-22' },
  { id: 8, name: 'Desk Lamp', category: 'Home', price: 39.99, stock_quantity: 55, rating: 4.1, release_date: '2022-02-28' },
];

const ordersBase = [
  { id: 1, user_id: 1, order_date: '2023-01-15', total_amount: 1499.98, status: 'completed', payment_method: 'credit_card', items_count: 2 },
  { id: 2, user_id: 2, order_date: '2023-01-18', total_amount: 899.99, status: 'completed', payment_method: 'paypal', items_count: 1 },
  { id: 3, user_id: 3, order_date: '2023-01-20', total_amount: 214.98, status: 'processing', payment_method: 'credit_card', items_count: 2 },
  { id: 4, user_id: 4, order_date: '2023-01-25', total_amount: 2099.97, status: 'completed', payment_method: 'credit_card', items_count: 3 },
  { id: 5, user_id: 1, order_date: '2023-02-05', total_amount: 39.99, status: 'completed', payment_method: 'paypal', items_count: 1 },
  { id: 6, user_id: 5, order_date: '2023-02-10', total_amount: 129.98, status: 'shipped', payment_method: 'credit_card', items_count: 4 },
  { id: 7, user_id: 6, order_date: '2023-02-15', total_amount: 899.99, status: 'completed', payment_method: 'credit_card', items_count: 1 },
  { id: 8, user_id: 7, order_date: '2023-02-28', total_amount: 44.98, status: 'cancelled', payment_method: 'paypal', items_count: 2 },
];

const employeesBase = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', position: 'Senior Developer', salary: 120000, hire_date: '2020-03-15', is_manager: true },
  { id: 2, name: 'Bob Smith', department: 'Engineering', position: 'Software Developer', salary: 95000, hire_date: '2021-05-10', is_manager: false },
  { id: 3, name: 'Carol Williams', department: 'Marketing', position: 'Marketing Director', salary: 115000, hire_date: '2019-11-08', is_manager: true },
  { id: 4, name: 'Dave Brown', department: 'Marketing', position: 'Marketing Specialist', salary: 78000, hire_date: '2022-01-20', is_manager: false },
  { id: 5, name: 'Eve Davis', department: 'Finance', position: 'Financial Analyst', salary: 90000, hire_date: '2021-08-15', is_manager: false },
  { id: 6, name: 'Frank Miller', department: 'Finance', position: 'Finance Director', salary: 135000, hire_date: '2018-07-22', is_manager: true },
  { id: 7, name: 'Grace Wilson', department: 'HR', position: 'HR Manager', salary: 105000, hire_date: '2020-09-01', is_manager: true },
  { id: 8, name: 'Henry Garcia', department: 'HR', position: 'HR Specialist', salary: 75000, hire_date: '2022-03-10', is_manager: false },
];

/**
 * Creates a large virtual dataset using lazy evaluation
 * This approach is memory-efficient as it only generates data when needed
 * @param {Array} baseData - Base dataset to expand
 * @param {number} targetSize - Target number of records
 * @returns {Object} - Virtual dataset with get method
 */
const createLazyDataset = (baseData, targetSize = 10000) => {
  const baseLength = baseData.length;
  
  return {
    length: targetSize,
    get: (index) => {
      if (index < baseLength) {
        return baseData[index];
      }
      
      // For items beyond the base dataset, create variations
      const baseItem = {...baseData[index % baseLength]};
      const multiplier = Math.floor(index / baseLength);
      
      // Modify the ID and other numeric values to make each item unique
      baseItem.id = baseItem.id + (baseLength * multiplier);
      
      // Modify string values where appropriate
      if (baseItem.name) {
        baseItem.name = `${baseItem.name} ${String.fromCharCode(65 + (multiplier % 26))}`;
      }
      
      if (baseItem.email) {
        const emailParts = baseItem.email.split('@');
        baseItem.email = `${emailParts[0]}${multiplier}@${emailParts[1]}`;
      }
      
      // Modify dates if present
      if (baseItem.signup_date) {
        const date = new Date(baseItem.signup_date);
        date.setDate(date.getDate() + multiplier);
        baseItem.signup_date = date.toISOString().split('T')[0];
      }
      
      if (baseItem.last_login) {
        const date = new Date(baseItem.last_login);
        date.setDate(date.getDate() - (multiplier % 30));
        baseItem.last_login = date.toISOString().split('T')[0];
      }
      
      if (baseItem.order_date) {
        const date = new Date(baseItem.order_date);
        date.setDate(date.getDate() + multiplier);
        baseItem.order_date = date.toISOString().split('T')[0];
      }
      
      if (baseItem.hire_date) {
        const date = new Date(baseItem.hire_date);
        date.setDate(date.getDate() + multiplier);
        baseItem.hire_date = date.toISOString().split('T')[0];
      }
      
      if (baseItem.release_date) {
        const date = new Date(baseItem.release_date);
        date.setDate(date.getDate() + multiplier);
        baseItem.release_date = date.toISOString().split('T')[0];
      }
      
      // Add variation to numeric values
      if (baseItem.price) {
        baseItem.price = parseFloat((baseItem.price * (1 + (multiplier % 5) / 100)).toFixed(2));
      }
      
      if (baseItem.stock_quantity) {
        baseItem.stock_quantity = Math.max(0, baseItem.stock_quantity + ((multiplier % 10) - 5) * 10);
      }
      
      if (baseItem.rating) {
        baseItem.rating = parseFloat((baseItem.rating + ((multiplier % 10) - 5) / 10).toFixed(1));
        baseItem.rating = Math.min(5, Math.max(1, baseItem.rating)); // Clamp between 1 and 5
      }
      
      if (baseItem.salary) {
        baseItem.salary = Math.round(baseItem.salary * (1 + (multiplier % 10) / 100) / 100) * 100;
      }
      
      if (baseItem.total_amount) {
        baseItem.total_amount = parseFloat((baseItem.total_amount * (1 + (multiplier % 5) / 100)).toFixed(2));
      }
      
      if (baseItem.items_count) {
        baseItem.items_count = Math.max(1, baseItem.items_count + ((multiplier % 5) - 2));
      }
      
      return baseItem;
    }
  };
};

// Create large virtual datasets for better performance testing
export const users = createLazyDataset(usersBase, 5000);
export const products = createLazyDataset(productsBase, 5000);
export const orders = createLazyDataset(ordersBase, 5000);
export const employees = createLazyDataset(employeesBase, 5000);

/**
 * Executes virtual queries without actually running SQL
 * Simulates database behavior for the SQL Query Runner
 * @param {string} query - SQL query to execute
 * @returns {Array} - Query results
 */
export const executeQuery = (query) => {
  // Parse query to determine data source and filtering
  const queryLower = query.toLowerCase();
  
  // Determine which dataset to use based on the FROM clause
  let dataset;
  let results = [];
  
  if (queryLower.includes('from users')) {
    dataset = users;
  } else if (queryLower.includes('from products')) {
    dataset = products;
  } else if (queryLower.includes('from orders')) {
    dataset = orders;
  } else if (queryLower.includes('from employees')) {
    dataset = employees;
  } else {
    // Default to users if no match
    dataset = users;
  }
  
  // Extract result size - default to all data
  let resultSize = dataset.length;
  
  // Handle LIMIT clause
  const limitMatch = queryLower.match(/limit\s+(\d+)/i);
  if (limitMatch && limitMatch[1]) {
    resultSize = Math.min(parseInt(limitMatch[1], 10), dataset.length);
  }
  
  // Generate the requested amount of data
  for (let i = 0; i < resultSize; i++) {
    results.push(dataset.get(i));
  }
  
  // Handle WHERE clause (basic implementation)
  if (queryLower.includes('where')) {
    // Filter by active status
    if (queryLower.includes('is_active = true') || queryLower.includes('is_active=true')) {
      results = results.filter(item => item.is_active === true);
    }
    
    if (queryLower.includes('is_active = false') || queryLower.includes('is_active=false')) {
      results = results.filter(item => item.is_active === false);
    }
    
    // Filter by account type
    if (queryLower.includes("account_type = 'premium'")) {
      results = results.filter(item => item.account_type === 'premium');
    }
    
    // Filter by department
    if (queryLower.includes("department = 'engineering'")) {
      results = results.filter(item => item.department?.toLowerCase() === 'engineering');
    }
    
    // Filter by category
    if (queryLower.includes("category = 'electronics'")) {
      results = results.filter(item => item.category?.toLowerCase() === 'electronics');
    }
    
    // Filter by price range
    const priceMatch = queryLower.match(/price\s*>\s*(\d+)/);
    if (priceMatch && priceMatch[1]) {
      const minPrice = parseInt(priceMatch[1], 10);
      results = results.filter(item => item.price > minPrice);
    }
    
    // Filter by rating
    const ratingMatch = queryLower.match(/rating\s*>\s*(\d+\.?\d*)/);
    if (ratingMatch && ratingMatch[1]) {
      const minRating = parseFloat(ratingMatch[1]);
      results = results.filter(item => item.rating > minRating);
    }
    
    // Filter by status
    if (queryLower.includes("status = 'completed'")) {
      results = results.filter(item => item.status?.toLowerCase() === 'completed');
    }
  }
  
  // Handle ORDER BY clause (basic implementation)
  if (queryLower.includes('order by')) {
    const orderByMatch = queryLower.match(/order by\s+(\w+)\s*(asc|desc)?/i);
    if (orderByMatch && orderByMatch[1]) {
      const orderByField = orderByMatch[1];
      const orderDirection = (orderByMatch[2] || 'asc').toLowerCase();
      
      results.sort((a, b) => {
        if (a[orderByField] === b[orderByField]) return 0;
        
        if (orderDirection === 'asc') {
          return a[orderByField] < b[orderByField] ? -1 : 1;
        } else {
          return a[orderByField] > b[orderByField] ? -1 : 1;
        }
      });
    }
  }
  
  return results;
};

// Predefined queries organized by data category
export const queryCategories = [
  {
    id: 'users',
    name: 'Users Data',
    queries: [
      { id: 1, name: 'All Users', query: 'SELECT * FROM users LIMIT 100' },
      { id: 2, name: 'Active Premium Users', query: "SELECT id, name, email, signup_date FROM users WHERE is_active = true AND account_type = 'premium' LIMIT 100" },
      { id: 3, name: 'Recent Signups', query: "SELECT id, name, email, signup_date FROM users ORDER BY signup_date DESC LIMIT 50" },
      { id: 4, name: 'User Login Activity', query: "SELECT id, name, last_login, account_type FROM users ORDER BY last_login DESC LIMIT 100" },
    ]
  },
  {
    id: 'products',
    name: 'Products Data',
    queries: [
      { id: 5, name: 'All Products', query: 'SELECT * FROM products LIMIT 100' },
      { id: 6, name: 'Electronics Products', query: "SELECT id, name, price, stock_quantity, rating FROM products WHERE category = 'Electronics' LIMIT 100" },
      { id: 7, name: 'Top Rated Products', query: 'SELECT id, name, category, price, rating FROM products WHERE rating > 4.5 ORDER BY rating DESC LIMIT 50' },
      { id: 8, name: 'Low Stock Items', query: 'SELECT id, name, category, stock_quantity FROM products WHERE stock_quantity < 50 ORDER BY stock_quantity ASC LIMIT 30' },
    ]
  },
  {
    id: 'orders',
    name: 'Orders Data',
    queries: [
      { id: 9, name: 'All Orders', query: 'SELECT * FROM orders LIMIT 100' },
      { id: 10, name: 'Completed Orders', query: "SELECT id, user_id, order_date, total_amount FROM orders WHERE status = 'completed' ORDER BY order_date DESC LIMIT 100" },
      { id: 11, name: 'High Value Orders', query: 'SELECT id, user_id, order_date, total_amount, payment_method FROM orders WHERE total_amount > 1000 ORDER BY total_amount DESC LIMIT 50' },
      { id: 12, name: 'Recent Orders', query: 'SELECT id, user_id, order_date, status, total_amount FROM orders ORDER BY order_date DESC LIMIT 50' },
    ]
  },
  {
    id: 'employees',
    name: 'Employees Data',
    queries: [
      { id: 13, name: 'All Employees', query: 'SELECT * FROM employees LIMIT 100' },
      { id: 14, name: 'Engineering Team', query: "SELECT id, name, position, salary, hire_date FROM employees WHERE department = 'Engineering' ORDER BY salary DESC LIMIT 50" },
      { id: 15, name: 'Department Managers', query: 'SELECT id, name, department, position, salary FROM employees WHERE is_manager = true ORDER BY salary DESC LIMIT 20' },
      { id: 16, name: 'Recent Hires', query: 'SELECT id, name, department, position, hire_date FROM employees ORDER BY hire_date DESC LIMIT 30' },
    ]
  }
];

// Get all queries
export const queries = queryCategories.flatMap(category => category.queries); 