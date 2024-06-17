import {dbQuery } from '../initDB.js';

async function getAttendancesStudent(req, res){
	let uid = req.params.student_id;
	
	let courses = await dbQuery(`select c.id, c.name 
	from course c inner join course_student cs on c.id = cs.course_id 
	where cs.student_id = ?`, uid);
	let resp = [];

	let sql =`select l.*, a.status 
	from lesson l left join attendance a on a.lesson_id = l.id 
	inner join course_student cs on cs.course_id = l.course_id and a.student_id  = cs.student_id
	where cs.student_id = ? and cs.course_id = ?`;

	for await (const course of courses){
		let lessons = await dbQuery(sql, [uid, course.id]);
		resp.push({id:course.id, name:course.name, 'lessons':lessons});
	}
	res.json(resp);
}

async function getAttendancesTeacher(req, res){
	let lid = req.params.lesson_id;
	let sql =`select l.id, a.status, u.name, u.id as student_id, l.week as 'date', (select name from course where id = l.course_id) as course_name
	from lesson l inner join course_student cs on l.course_id = cs.course_id left join attendance a on cs.student_id = a.student_id and l.id = a.lesson_id inner join user u on cs.student_id = u.id
	where l.id = ? order by u.name asc`;
	let resp = await dbQuery(sql, lid);
	res.json(resp);
}

async function postAttendance(req, res){
	let lid = req.body.lesson_id;
	let status = req.body.status;
	let uid = req.body.student_id;

	await dbQuery("delete from attendance where student_id = ? and lesson_id = ?", [uid, lid]);

	let sql =`insert into attendance (lesson_id, student_id, status) values (?,?,?);`;
	let resp = await dbQuery(sql, [lid, uid, status]);

	res.json(resp);
}

export {postAttendance, getAttendancesStudent, getAttendancesTeacher}