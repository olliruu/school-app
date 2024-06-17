import {dbQuery } from '../initDB.js';

async function getBulletins(req, res){
	let uid = req.query.user_id;
	let sql = `select b.*, u.name as sender 
	from bulletin b inner join user u on b.sender_id = u.id inner join bulletin_receiver br on b.id = br.bulletin_id
	where br.course_id is null or b.sender_id = ?
	or br.course_id in 
	(select c.id from course c inner join course_student cs on c.id = cs.course_id 
	where cs.student_id = ?)
	order by create_time desc`;
	let resp = await dbQuery(sql, [uid, uid]);
	res.json(resp);
}

async function postBulletin(req, res){
	let body = req.body;

	let sql = `insert into bulletin (title, content, sender_id) values (?,?,?)`;

	let resp = await dbQuery(sql, [body.title, body.content, body.user_id]);
	
	let sql2 = `insert into bulletin_receiver (bulletin_id, course_id) values (?,?)`;
	if(body.courses == null){
		await dbQuery(sql2, [resp.insertId, null]);

		for await (let client of wsClients){
			client.send(JSON.stringify({type:'Bulletin'}));
		}

	} else {
		let courseIds = [];
		for await (const course of courses){
			courseIds.push(course.id);
			await dbQuery(sql2, [resp.insertId, course.id]);
		}

		let studentIdList = await dbQuery("select id from user u inner join course_student cs on u.id = cs.student_id where cs.course_id in ?", [courseIds]);
		studentIdList = studentIdList.filter((s, i, self)=>i == self.findIndex(item=>item.id == s.id));
		studentIdList.forEach(item=>wsClients[item.id] != undefined? wsClients[item.id].send(JSON.stringify({type:'Bulletin'})):null);

		let parentIdList = await dbQuery("select id from user u inner join parent_student ps on ps.parent_id = u.id inner join course_student cs on ps.student_id = cs.student_id where cs.course_id in ?", [courseIds]);
		parentIdList = parentIdList.filter((s, i, self)=>i == self.findIndex(item=>item.id == s.id));
		parentIdList.forEach(item=>wsClients[item.id] != undefined? wsClients[item.id].send(JSON.stringify({type:'Bulletin'})):null);

		let teacherIdList = await dbQuery("select id from user u inner join course c on c.teacher_id = u.id where c.id in ?", [courseIds]);
		teacherIdList = teacherIdList.filter((s, i, self)=>i == self.findIndex(item=>item.id == s.id));
		teacherIdList.forEach(item=>wsClients[item.id] != undefined? wsClients[item.id].send(JSON.stringify({type:'Bulletin'})):null);
	}

	res.status(200).json({"status":'ok'});
}

async function getBulletin(req, res){
	let id = req.query.bulletin_id;
	let sql = `select b.*, u.name as sender from bulletin b inner join user u on b.sender_id = u.id where b.id = ?`;
	let resp = await dbQuery(sql, id);
	res.json(resp[0]);
}

export {getBulletin, getBulletins, postBulletin}