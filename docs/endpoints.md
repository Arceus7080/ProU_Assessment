# API Endpoints

## Employees
- `GET /api/employees`
  - List all employees
- `POST /api/employees`
  - Body: `{ "name": "John", "email": "john@example.com" }`
- `PUT /api/employees/:id`
  - Body: `{ "name": "New", "email": "new@example.com" }`
- `DELETE /api/employees/:id`

## Tasks
- `GET /api/tasks`
  - List tasks (includes `employee_name` if assigned)
- `POST /api/tasks`
  - Body: `{ "title":"T", "description":"...", "employee_id":1, "status":"pending" }`
- `PUT /api/tasks/:id`
  - Body: `{ "title":"T", "description":"...", "employee_id":1, "status":"done" }`
- `DELETE /api/tasks/:id`
