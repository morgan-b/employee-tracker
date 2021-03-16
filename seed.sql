

use employee_trackerDB;

select e.id, e.first_name, e.last_name, r.title, r.salary, d.name, 
case
when e.id = e.manager_id then concat(e.first_name,"", e.last_name)
end as manager_name
from employee e
join role r 
on e.id = r.id
join department 
on d.id = r.department_id
