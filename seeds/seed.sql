create database employee_trackerDB;

create table role (
id INT AUTO_INCREMENT NOT NULL,
title varchar(30),
salary decimal(10,2),
department_id int,
PRIMARY KEY(id));

create table employee (
id INT AUTO_INCREMENT NOT NULL,
first_name varchar(30),
last_name varchar(30),
role_id int,
manager_id int,
PRIMARY KEY(id));

create table department (
id INT AUTO_INCREMENT NOT NULL,
name varchar(30),
PRIMARY KEY(id));


insert into employee_trackerDB.role (title, salary,department_id)
values
("CEO",1000000.00,1),
("Manager",80000.00,2),
("Analyst",70000.00,3),
("Intern",30000.00,4)


insert into employee_trackerDB.employee (first_name, last_name,role_id,manager_id)
values
("Morgan","Bailey",1,2),
("Colin","Roth",2,3),
("Sarah","John",3,1),
("John","Smith",4,2),
("Caroline","Roberts",4,1),
("Sarah","John",2,3),
("Haley","Johnson",4,2),
("Sam","Code",2,3),
("Kara","Baker",2,4)

insert into employee_trackerDB.role (title, salary,department_id)
values
("CEO",1000000.00,1),
("Manager",80000.00,2),
("Analyst",70000.00,3),
("Intern",30000.00,4)

insert into employee_trackerDB.department (name)
values
("Executive"),
("Engineering"),
("Marketing"),
("Product")
