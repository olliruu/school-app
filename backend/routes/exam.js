import {dbQuery } from '../initDB.js';

async function getExams(req, res){
	let type = req.query.user_type;
	let uid = req.query.user_id;


	let sql =`select e.id, e.name, e.grade, e.create_time as 'date', c.name as course,
	(select name from user where id = e.student_id) as student,
	(select u.name from user u inner join course c on c.teacher_id = u.id where c.id = e.course_id) as teacher
	from exam e inner join course c on e.course_id = c.id 
	where ${type != 'teacher' ? 'e.student_id' : 'c.teacher_id'} = ? order by e.create_time desc`;
	let resp = await dbQuery(sql, uid);
	res.json(resp);
}

async function deleteExam(req, res){
	let examId = req.query.exam_id;
	let sql =`delete from exam where id = ?`;
	let resp = await dbQuery(sql, examId);
	res.json({'status':'ok'});
}

async function postExam(req, res){
	let body = req.body;

	let sql =`insert into exam (course_id, student_id, name, grade) values (?, ?, ?, ?)`;
	let resp = await dbQuery(sql, [body.course_id, body.student_id, body.name, body.grade]);
	res.json({'status':'ok'});
}

export {getExams, deleteExam, postExam};