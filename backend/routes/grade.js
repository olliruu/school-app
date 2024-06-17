import {dbQuery } from '../initDB.js';

async function getGrades(req, res){
	let type = req.query.user_type;
	let uid = req.query.user_id;
	let sql;
	
	sql =`select cg.id, grade, cg.create_time as 'date', c.name as course, 'true' as seen,
		(select name from user where id = c.teacher_id) as teacher,
		(select name from user where id = cg.student_id) as student
		from course_grade cg inner join course c on c.id = cg.course_id 
		where ${type != 'teacher' ? 'cg.student_id = ?' : 'c.teacher_id = ?'}`;

	let resp = await dbQuery(sql, uid);
	res.json(resp);
}

async function postGrade(req, res){
	let body = req.body;
	
	let sql =`insert into course_grade (course_id, student_id, grade) values (?, ?, ?)`;
	let resp = await dbQuery(sql, [body.course_id, body.student_id, body.grade]);

	res.json({'status':'ok'});
}

async function deleteGrade(req, res){
	let gradeId = req.query.grade_id;
	
	let sql =`delete from course_grade where id = ?`;
	let resp = await dbQuery(sql, gradeId);

	res.json({'status':'ok'});
}

async function updateGrade(req, res){
	let gradeId = req.body.grade_id;
	let newGrade = req.body.grade;
	
	let sql =`update course_grade set grade = ? where id = ?`;
	let resp = await dbQuery(sql, [newGrade, gradeId]);

	res.json({'status':'ok'});
}

export {getGrades, postGrade, updateGrade, deleteGrade}