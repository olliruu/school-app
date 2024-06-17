import {dbQuery } from '../initDB.js';

async function getNames(req, res){
	let uid = req.query.user_id;
	let sql = `select name, id from user where not type = 'student' and not id = ?`
	let resp = await dbQuery(sql, uid);
	res.json(resp);
}

async function getStudents(req, res){
	let courseId = req.query.course_id;
	let sql =`select u.id, u.name from user u inner join course_student cs on cs.student_id = u.id where cs.course_id = ?`;
	let resp = await dbQuery(sql, courseId);
	res.json(resp);
}

async function getAllStudents(req, res){
	let sql =`select name, id from user where type = 'student'`;
	let resp = await dbQuery(sql, null);
	
	res.json(resp);
}

export {getNames, getStudents, getAllStudents}