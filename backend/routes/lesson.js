import {dbQuery } from '../initDB.js';

async function getLessons(req, res){
	let monday = req.query.start_date;
	let sunday = req.query.end_date;
	let uid = req.query.user_id;
	let type = await dbQuery("select type from user where id = ?", uid);

	if(type[0].type == 'teacher'){
		let sql =`select l.*, c.name, c.description, c.location, (select name from user where id = c.id) as teacher
		from lesson l inner join course c on l.course_id = c.id
		where c.teacher_id = ? and l.week between date(?) and date(?)`;
		let resp = await dbQuery(sql, [uid, monday.split('T')[0], sunday.split('T')[0]]);
		res.json(resp);
	} else {
		let sql =`select l.*, c.name, c.description, c.location, (select name from user where id = c.id) as teacher 
		from lesson l inner join course c on l.course_id = c.id
		where c.id in (select course_id from course_student where student_id = ?) and l.week between date(?) and date(?)`;
		let resp = await dbQuery(sql, [uid, monday.split('T')[0], sunday.split('T')[0]]);
		res.json(resp);
	} 
}

export {getLessons}