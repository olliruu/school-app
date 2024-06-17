import {dbQuery } from '../initDB.js';

async function login(req, res){
	let body = req.body;

	let sql =`select name, id, type, last_login from user where username = ? and password = ?`;
	let resp = await dbQuery(sql, [body.username, body.password]);
	if(resp.length < 1){
		res.json({'id':-1});
	} else {
		resp = resp[0];
		let sql2 = `select u.name, u.id from user u inner join parent_student ps on ps.student_id = u.id where ps.parent_id = ?`;
		resp.students = resp.type != 'parent'? [] : await dbQuery(sql2, resp.id);
		res.json(resp);
	}
}

async function register(req, res){
	let body = req.body;
	
	let resp = await dbQuery(`select * from user where username = ?`, body.username);
	//if username exists, send error
	if(resp.length > 0){
		res.sendStatus(409);
		return;
	}

	for await (let student of body.students){
		let resp = await dbQuery(`select * from user where username = ?`, student.username);
		if(resp.length > 0){
			res.sendStatus(409);
			return;
		}
	}

	let sql =`insert into user (name, password, username, type) values (?, ?, ?, ?)`;
	let newAccount = await dbQuery(sql, [body.name, body.password, body.username, body.type]);

	resp = body;
	resp.id = newAccount.insertId;
	
	if(body.type == 'parent'){
		resp.students = [];
		for await (let student of body.students){
			let newStudent =  await dbQuery(sql, [student.name, student.password, student.username, 'student']);

			let sql2 =`insert into parent_student (parent_id, student_id) values (?, ?)`;
			await dbQuery(sql2, [newAccount.insertId, newStudent.insertId]);
			
			resp.students.push({'name':student.name, 'id':newStudent.insertId});
		}
	}

	res.json(resp);
}

export {login, register}