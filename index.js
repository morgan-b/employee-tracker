const mysql = require('mysql');
const inquirer = require('inquirer');
const env = require('dotenv');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '!Snuffles23',
    database: 'employee_trackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    runSearch()
});



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



// addEmployee();
// removeEmployee();
// updateRole();
// updateManager();
// allRoles();
// addRole();
// removeRole();
// addDept();
// removeDept();

const allEmployees = () => {
    const query = 'select e.id,e.first_name,e.last_name, d.name as Department,r.title, r.salary from employee e inner join role r on e.role_id = r.id join department d on d.id = r.department_id';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });


    //  runSearch();
};

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
                });



            });

        // runSearch()

    });
};

const empManager = () => {
    const query = 'select concat(e.first_name," ",e.last_name) as name from employee e  where e.id in (select e.manager_id from employee e)';
    connection.query(query, (err, res) => {

        var dept = res.map(item => item.name);
        if (err) throw err;

        inquirer
            .prompt({
                name: 'action',
                type: 'list',
                message: 'Which managers employees would you like to view',
                choices: dept

            })
            .then((answer) => {
                let answerManagers = Object.values(answer)
                let managerString = answerManagers.toString(answerManagers)
                let managerName = managerString.split(' ')
                // let answerz = answerMan.split("")
                // console.log(answerz)

                console.log(answerManagers)
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
                            });
                    });


            });

    });

};


const addEmployee = () => {
    const query = 'select concat(e.first_name," ",e.last_name) as name from employee e  where e.id in (select e.manager_id from employee e)';
    connection.query(query, (err, res) => {

        var dept = res.map(item => item.name);
        if (err) throw err;

        inquirer
            .prompt({
                name: 'action',
                type: 'list',
                message: 'Which managers employees would you like to view',
                choices: dept

            })
            .then((answer) => {
                let answerManagers = Object.values(answer)
                let managerString = answerManagers.toString(answerManagers)
                let managerName = managerString.split(' ')
                // let answerz = answerMan.split("")
                // console.log(answerz)

                console.log(answerManagers)
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
                            })
                    })


            });

    })
        ;


}



    // runSearch()


    //



