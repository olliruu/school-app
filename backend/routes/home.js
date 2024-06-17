import {dbQuery } from '../initDB.js';

export async function getTodaysInfo(req, res){
	let uid = req.query.user_id;
	let sql =`select m.content, u.name 
	from message m inner join user u on m.sender_id = u.id 
	where status = 'new' and m.receiver_id = ?
	order by m.create_time desc`;
	let messages = await dbQuery(sql, uid);
	let sql2 =`select l.start_time, l.end_time, c.name as course
	from lesson l inner join course c on c.id = l.course_id inner join course_student cs on c.id = cs.course_id
	where week = curdate() and cs.student_id = ?
	order by l.start_time asc`;
	let lessons = await dbQuery(sql2, uid);
	
	res.json({'messages':messages, 'lessons':lessons});
}