const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require('console.table');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3001,
  user: 'Camparooni',
  password: 'Glamdring0205!',
  database: 'employees_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');
  startApp();
});

function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;

        case 'View all roles':
          viewRoles();
          break;

        case 'View all employees':
          viewEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          connection.end();
          break;

        default:
          console.log('Invalid action');
          break;
      }
    });
}

function viewDepartments() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewRoles() {
  const query =
    'SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewEmployees() {
  const query =
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      name: 'departmentName',
      type: 'input',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      const query = 'INSERT INTO department (name) VALUES (?)';
      connection.query(query, [answer.departmentName], (err, res) => {
        if (err) throw err;
        console.log('Department added!');
        startApp();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for this role:',
      },
      {
        name: 'departmentId',
        type: 'input',
        message: 'Enter the department ID for this role:',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      connection.query(query, [answer.title, answer.salary, answer.departmentId], (err, res) => {
        if (err) throw err;
        console.log('Role added!');
        startApp();
      });
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Enter the first name of the employee:',
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'Enter the last name of the employee:',
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'Enter the role ID for this employee:',
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'Enter the manager ID for this employee (optional):',
      },
    ])
    .then((answer) => {
      const query =
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      connection.query(
        query,
        [answer.firstName, answer.lastName, answer.roleId, answer.managerId || null],
        (err, res) => {
          if (err) throw err;
          console.log('Employee added!');
          startApp();
        }
      );
    });
}

function updateEmployeeRole() {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;

    const employeeChoices = employees.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    inquirer
      .prompt([
        {
          name: 'employeeId',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employeeChoices,
        },
        {
          name: 'roleId',
          type: 'input',
          message: 'Enter the new role ID for this employee:',
        },
      ])
      .then((answer) => {
        const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        connection.query(query, [answer.roleId, answer.employeeId], (err, res) => {
          if (err) throw err;
          console.log('Employee role updated!');
          startApp();
        });
      });
  });
}