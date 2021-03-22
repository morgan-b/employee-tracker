const mysql = require('mysql');
const inquirer = require('inquirer');


const connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'YOUR_USERNAME',

    // Your password
    password: 'YOUR_PASSWORD',

    //Your Database
    database: 'employee_trackerDB',
});

//Start connection and prompt user

connection.connect((err) => {
    if (err) throw err;
    runSearch()
});


//Ask user what they would like to view or do
const runSearch = () => {

    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees by Department',
                'View All Employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'Add Department',
                'Remove Department',
                'exit',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View All Employees':
                    allEmployees();
                    break;

                case 'View All Employees by Department':
                    return empDepartment();


                case 'View All Employees by Manager':
                    empManager();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Remove Employee':
                    removeEmployee();
                    break;

                case 'Update Employee Role':
                    updateRole();
                    break;

                case 'Update Employee Manager':
                    updateManager();
                    break;

                case 'View All Roles':
                    allRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Remove Role':
                    removeRole();
                    break;

                case 'Add Department':
                    addDept();
                    break;

                case 'Remove Department':
                    removeDept();
                    break;

                case 'exit':
                    connection.end();
                    break;


                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });

};


//View all employees

const allEmployees = () => {
    const query = 'select e.id,e.first_name,e.last_name, d.name as Department,r.title, r.salary from employee e inner join role r on e.role_id = r.id join department d on d.id = r.department_id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });


    runSearch();
};

//View all employees by Department
const empDepartment = () => {
    const query = 'select DISTINCT name as Department from department';
    connection.query(query, (err, res) => {

        var dept = res.map(item => item.Department);
        if (err) throw err;

        inquirer
            .prompt({
                name: 'action',
                type: 'list',
                message: 'Which Deparment would you like to view?',
                choices: dept

            })
            .then((answer) => {
                let answers = Object.values(answer)
                console.log(answers)
                const query = 'select e.id,e.first_name,e.last_name, d.name as Department,r.title, r.salary from employee e inner join role r on e.role_id = r.id join department d on d.id = r.department_id WHERE ?';
                connection.query(query, { "d.name": answers }, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    runSearch();
                });



            });

    });
};

//View all employees by Manager
const empManager = () => {
    const query = 'select concat(e.first_name," ",e.last_name) as name from employee e  where e.id in (select e.manager_id from employee e)';
    connection.query(query, (err, res) => {

        var dept = res.map(item => item.name);
        if (err) throw err;

        inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'Which managers employees would you like to view',
            choices: dept

        })
            .then((answer) => {
                let answerManagers = Object.values(answer)
                let managerString = answerManagers.toString(answerManagers)
                let managerName = managerString.split(' ')
                const query1 = 'select e.id from employee e WHERE ? AND ?';
                connection.query(query1, [{ "e.first_name": managerName[0] }, { "e.last_name": managerName[1] }],
                    (err, res) => {
                        var managerids = res.map(item => item.id);
                        console.log(managerids)
                        if (err) throw err;
                        const query = 'select e.id,concat(e.first_name," ",e.last_name) as name, d.name as Department,r.title, r.salary from employee e inner join role r on e.role_id = r.id join department d on d.id = r.department_id WHERE ?';
                        connection.query(query, { "e.manager_id": managerids },
                            (err, res) => {
                                if (err) throw err;
                                console.table(res);
                                runSearch();
                            });
                    }
                );

            });
    });
};

const allRoles = () => {
    const query = 'select DISTINCT r.title from role r';
    connection.query(query, (err, res) => {

        var role = res.map(item => item.title);
        if (err) throw err;

        inquirer
            .prompt({
                name: 'action',
                type: 'list',
                message: 'Which role would you like to view?',
                choices: role

            })
            .then((answer) => {
                let answers = Object.values(answer)
                console.log(answers)
                const query1 = 'select DISTINCT r.title, e.first_name, e.last_name from role r join employee e on r.id = e.role_id WHERE ?';
                connection.query(query1, { "r.title": answers }, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    runSearch();
                });



            });

    });
};


//Add a new employee
const addEmployee = () => {

    const query1 = "SELECT id, title FROM role ORDER BY title ASC;SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee";


    connection.query(query1, (err, res) => {
        if (err) throw err;


        var roleNames = res[0].map(item => item.title);


        var employeeNames = res[1].map(item => item.Employee);



        inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is the first name of the employee?',
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is the last name of the employee?',
            },
            {

                name: 'role',
                type: 'list',
                message: 'What is the role of the employee?',
                choices: roleNames,

            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is the manager of the employee?',
                choices: employeeNames,

            },
        ])


            .then((answer) => {
                connection.query(
                    `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
                        (SELECT id FROM role WHERE title = ? ), 
                        (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ? ) AS tmptable))`,
                    [answer.first_name, answer.last_name, answer.role, answer.manager]


                );
                console.log("Employee added!")
                runSearch();

            });

    })
}


//remove an Employee
const removeEmployee = () => {

    const query1 = "SELECT concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee";


    connection.query(query1, (err, res) => {
        if (err) throw err;


        var empNames = res.map(item => item.Employee);
        console.log(empNames)




        inquirer.prompt([

            {

                name: 'employee',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: empNames,

            },


        ])


            .then((answer) => {
                let answerEmp = Object.values(answer)
                let empString = answerEmp.toString(answerEmp)
                let empName = empString.split(' ')
                console.log(empName)
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    `DELETE FROM employee e WHERE ?`, [{ "e.first_name": empName[0] }, { "e.last_name": empName[1] }],


                );
                console.log("Employee deleted!")
                runSearch();
            });

    })
}

//Add a new role
const addRole = () => {

    const query1 = "SELECT id, name FROM department";


    connection.query(query1, (err, res) => {
        if (err) throw err;


        var deptName = res.map(item => item.name);




        inquirer.prompt([
            {
                name: 'role',
                type: 'input',
                message: 'What is the name of the role?',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary?',
            },
            {
                name: 'dept',
                type: 'list',
                message: 'What department?',
                choices: deptName
            },

        ])


            .then((answer) => {
                // when finished prompting, insert a new item into the db with that info


                connection.query(
                    `INSERT INTO role(title, salary, department_id) 
                            VALUES
                            ("${answer.role}", "${answer.salary}", 
                            (SELECT id FROM department WHERE name = "${answer.dept}"));`
                )



            });
        console.log("Role added!")
        runSearch();

    })
}


//Add a new Department
const addDept = () => {

    inquirer.prompt([
        {
            name: 'newDept',
            type: 'input',
            message: 'Enter the name of the Department'
        }
    ]).then((answer) => {
        connection.query(`INSERT INTO department(name) VALUES( ? )`, answer.newDept)

    })
    console.log("Department added!")
    runSearch();

}


//Update an employee's role
const updateRole = () => {
    const query = `SELECT CONCAT (first_name," ",last_name) AS Employee FROM employee; SELECT title FROM role`
    connection.query(query, (err, results) => {
        if (err) throw err;
        let Employee = results[0].map(choice => choice.Employee)
        let Title = results[1].map(choice => choice.title)

        inquirer.prompt([
            {
                name: 'employee',
                type: 'list',
                message: 'Select the employee to update',
                choices: Employee,
            },
            {
                name: 'role',
                type: 'list',
                message: 'Select their new role',
                choices: Title
            }

        ]).then((answer) => {
            connection.query(`UPDATE employee
            SET role_id = (SELECT id FROM role WHERE title = ? ) 
            WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`, [answer.Title, answer.Employee]


            )
            console.log("Updated!");
            runSearch();
        })



    })

}
