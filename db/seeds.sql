INSERT INTO department (name)
VALUES ('HR'),
        ('Engineering'),
        ('Marketing');


INSERT INTO role (title, salary, department_id)
VALUES ('HR Manager', 70000, 1),
        ('Software Engineer', 100000, 2),
        ('Marketing Specialist', 60000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Oslo', 'Mercer', 1, NULL),
        ('Linnea', 'Quinn', 2, 1),
        ('Leander', 'Wilde', 3, 1),
        ('Lucius', 'Wren', 3, 1);


