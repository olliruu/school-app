import {dbQuery } from '../initDB.js';

async function getHomeworksTeacher(req, res){
	let uid = req.query.user_id;
	let sql =`select h.id, h.name, h.description, h.create_time as 'date', h.deadline,
	(select count(*) from homework_answer where homework_id = h.id) as returns, c.name as course
	from homework h inner join course c on h.course_id = c.id where c.teacher_id = ? order by h.create_time desc`;
	let resp = await dbQuery(sql, uid);
	res.json(resp);
}

async function getHomeworksStudent(req, res){
	let uid = req.query.user_id;
	let sql =`select h.id, h.name, h.description, h.create_time as 'date', h.deadline, c.name as course, 
	(select name from user where id = c.teacher_id) as teacher, ha.grade, ha.id as answer_id
	from homework h inner join course c on h.course_id = c.id 
	inner join course_student cs on cs.course_id = c.id
	left join homework_answer ha on ha.homework_id = h.id and ha.student_id = cs.student_id
	where cs.student_id = ? order by h.create_time desc`;
	let resp = await dbQuery(sql, uid);
	res.json(resp);
}

async function createHomework(req,res){
	let body = req.body;
	console.log(req.files);
	let sql =`insert into homework (course_id, name, description, deadline) value (?, ?, ?,?)`;
	let resp = await dbQuery(sql, [body.course_id, body.name, body.description, body.deadline == 'null'?null:body.deadline.split('T')[0]]);

	for await (const file of req.files){
		await dbQuery("insert into homework_file (homework_id, homework_answer_id, name, resource, mimetype) values (?,?,?,?,?)", [resp.insertId, null, file.originalname, file.filename, file.mimetype]);
		console.log(file);
	}

	res.json(resp);
}

async function getHomeworkStudent(req, res){
	let hid = req.query.homework_id;
	let answer_id = req.query.answer_id;
	let resp;
	if(answer_id != 'null'){
		let sql =`select h.name, h.description, u.name as teacher, h.create_time as 'date', h.deadline, ha.grade, ha.comment, ha.content as answer from homework h
		inner join homework_answer ha on ha.homework_id = h.id inner join course c on c.id = h.course_id inner join user u on u.id = c.teacher_id where h.id = ? and ha.id = ?`;
		let results = await dbQuery(sql, [hid, answer_id]);
		resp = results[0];
	} else {
		let sql =`select h.name, h.description, h.create_time as 'date', u.name as teacher, h.deadline, null as grade, null as comment, null as answer from homework h
		inner join course c on c.id = h.course_id inner join user u on u.id = c.teacher_id
		where h.id = ?`;
		let results = await dbQuery(sql, hid);
		resp = results[0];
	}
	let homeworkFiles = await dbQuery("select name, resource, mimetype from homework_file hf where hf.homework_id = ?", hid);
	resp.files = homeworkFiles;
	let answerFiles = answer_id != 'null' ? await dbQuery("select name, resource from homework_file hf where hf.homework_answer_id = ?", answer_id): [];
	resp.answer_files = answerFiles;
	
	res.json(resp);
}

async function postHomeworkStudent(req, res){
	let content = req.body.content;
	let sid = req.body.student_id;
	let hid = req.body.homework_id;

	let sql =`insert into homework_answer (homework_id, student_id, content, done, grade, comment) values (?, ?, ?, 1, null, null)`;
	let resp = await dbQuery(sql, [hid, sid, content]);

	for await (const file of req.files){
		await dbQuery("insert into homework_file (homework_id, homework_answer_id, name, resource, mimetype) values (null, ?, ?, ?, ?) ", [resp.insertId, file.originalname, file.filename, file.mimetype]);
	}

	res.json({'status':'ok'});
}

async function getHomeworkTeacher(req, res){
	let hid = req.query.homework_id;
	let sql =`select h.name, h.description, h.deadline, h.create_time as 'date' from homework h where h.id = ?`;
	let resp = {};
	resp.homework = await dbQuery(sql, hid);
	resp.homework.files = await dbQuery("select name, resource from homework_file where homework_id = ?", hid);

	let sql2 = `select ha.id, ha.grade, ha.comment, ha.content as answer, u.name as student, ha.done from homework h inner join course_student cs on h.course_id = cs.course_id 
	left join homework_answer ha on cs.student_id = ha.student_id and ha.homework_id = h.id inner join user u on u.id = cs.student_id where h.id = ?`;
	resp.homeworks = await dbQuery(sql2, hid);

	for await (let answer of resp.homeworks){
		console.log(answer);
		if(answer.id != null){
			answer.files = await dbQuery("select name, resource, mimetype from homework_file where homework_answer_id = ?",answer.id);
		}
	}

	res.json(resp);
}


async function postHomeworkTeacher(req, res){
	let aid = req.body.answer_id;
	let comment = req.body.comment;
	let grade = req.body.grade;
	let sql =`update homework_answer set comment = ?, grade = ? where id = ?`;
	let resp = await dbQuery(sql, [comment, grade, aid]);

	res.json({'status':'ok'});
}

export {getHomeworksStudent, getHomeworksTeacher, getHomeworkStudent, getHomeworkTeacher,
postHomeworkStudent, postHomeworkTeacher, createHomework}