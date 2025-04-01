# Architecture Diagrams for SQL Query Runner

## System Architecture Diagram

```
+-------------------------------------------+
|                                           |
|          SQL Query Runner (Frontend)      |
|                                           |
+-------------------------------------------+
                    |
                    | User Interaction
                    v
+-------------------------------------------+
|                                           |
|           React Application               |
|                                           |
+---------------+-------------------------+-+
                |                         |
                v                         v
+---------------+------+      +-----------+------------+
|                      |      |                        |
|  Component Layer     |      |  State Management      |
|                      |      |                        |
|  +----------------+  |      |  +------------------+  |
|  | QueryEditor    |  |      |  | Query State      |  |
|  +----------------+  |      |  +------------------+  |
|                      |      |                        |
|  +----------------+  |      |  +------------------+  |
|  | DataTable      |  |      |  | Results State    |  |
|  +----------------+  |      |  +------------------+  |
|                      |      |                        |
|  +----------------+  |      |  +------------------+  |
|  | UI Components  |  |      |  | Theme State      |  |
|  +----------------+  |      |  +------------------+  |
|                      |      |                        |
+----------------------+      +------------------------+
            |                              |
            +------------------------------+
                           |
                           v
+-------------------------------------------+
|                                           |
|            Data Processing Layer          |
|                                           |
|  +------------------+  +--------------+   |
|  | Mock Data Store  |  | Query Parser |   |
|  +------------------+  +--------------+   |
|                                           |
|  +------------------+  +--------------+   |
|  | Data Filtering   |  | CSV Export   |   |
|  +------------------+  +--------------+   |
|                                           |
+-------------------------------------------+
```

## Entity Relationship (ER) Diagram

```
+----------------+        +----------------+        +----------------+
|                |        |                |        |                |
|   Student      |        |   Teacher      |        |   Employee     |
|                |        |                |        |                |
+----------------+        +----------------+        +----------------+
| id (PK)        |        | id (PK)        |        | id (PK)        |
| roll_number    |        | employee_id    |        | employee_id    |
| name           |        | name           |        | name           |
| email          |        | email          |        | email          |
| grade          |        | department     |        | department     |
| major          |        | subject        |        | role           |
| gpa            |        | experience     |        | salary         |
| admission_date |        | salary         |        | hire_date      |
| status         |        | joining_date   |        | reports_to     |
| attendance     |        | status         |        | status         |
+----------------+        +----------------+        +----------------+
        |                         |                         |
        |                         |                         |
        v                         v                         v
+----------------+        +----------------+        +----------------+
|                |        |                |        |                |
|  Student Data  |        |  Teacher Data  |        | Employee Data  |
|  Queries       |        |  Queries       |        | Queries        |
|                |        |                |        |                |
+----------------+        +----------------+        +----------------+
| query_id (PK)  |        | query_id (PK)  |        | query_id (PK)  |
| name           |        | name           |        | name           |
| sql_statement  |        | sql_statement  |        | sql_statement  |
| description    |        | description    |        | description    |
+----------------+        +----------------+        +----------------+
```

## Detailed Component Architecture

```
+--------------------------------------------------+
|                                                  |
|                 App Component                    |
|                                                  |
+--------------------+---------------------------+-+
                     |
        +------------+-------------+
        |                          |
+-------v-------+        +---------v---------+
|               |        |                   |
| Category      |        | Query Editor      |
| Selection     |        | Component         |
|               |        |                   |
+---------------+        +-------------------+
                                  |
                         +--------v--------+
                         |                 |
                         | Data Processing |
                         |                 |
                         +-----------------+
                                  |
                  +--------------+----------------+
                  |                               |
        +---------v----------+        +-----------v-------+
        |                    |        |                   |
        | Results Table      |        | Export to CSV     |
        | Component          |        | Functionality     |
        |                    |        |                   |
        +--------------------+        +-------------------+
        |                    |
+-------v--------+  +--------v-------+
|                |  |                |
| Sorting &      |  | Pagination     |
| Filtering      |  | Controls       |
|                |  |                |
+----------------+  +----------------+
```

## Data Flow Diagram

```
+------------------+     +-------------------+     +------------------+
|                  |     |                   |     |                  |
| User selects     +---->+ Query is written  +---->+ Query is parsed  |
| data category    |     | or selected       |     | and executed     |
|                  |     |                   |     |                  |
+------------------+     +-------------------+     +--------+---------+
                                                            |
+------------------+     +-------------------+     +--------v---------+
|                  |     |                   |     |                  |
| User views       |<----+ Data is           |<----+ Mock data is     |
| results          |     | presented in UI   |     | filtered         |
|                  |     |                   |     |                  |
+-------+----------+     +-------------------+     +------------------+
        |
        |
+-------v----------+
|                  |
| Optional: User   |
| exports to CSV   |
|                  |
+------------------+
```

These architecture diagrams provide a visual representation of the SQL Query Runner application's structure, data relationships, and workflow. 