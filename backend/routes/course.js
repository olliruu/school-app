import {dbQuery } from '../initDB.js';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';

dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore)


async function getCourses(req, res){
	let uid = req.query.user_id;
	let sql =`select c.id, c.name, c.description, c.start_date, c.end_date, c.create_time as 'date' from course c where c.teacher_id = ?`;
	let resp = await dbQuery(sql, uid);

	for await(let course of resp){
		course.participants = await dbQuery('select u.name, u.id from user u inner join course_student cs on cs.student_id = u.id where cs.course_id = ?', course.id);
	}
	res.json(resp);
}


async function deleteCourse(req, res){
	let courseId = req.query.course_id;
	let sql =`delete from course where id = ?`;
	let resp = await dbQuery(sql, courseId);
	res.json({'status':'ok'});
}

async function postCourse(req, res){
	let body = req.body;


	let sql =`insert into course (name, description, location, start_date, end_date, teacher_id)
	values (?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), STR_TO_DATE(?, '%Y-%m-%d'), ?)`;
	let resp = await dbQuery(sql, [body.name, body.description, body.location,
	body.start_date.split('T')[0], body.end_date.split('T')[0] ,body.teacher_id]);

	for await (let participant of body.participants){
		await dbQuery(`insert into course_student (course_id, student_id) values (?, ?)`, [resp.insertId, participant.id]);
	}

	//1 is monday, 7 is sunday
	let startMonday = dayjs(req.body.start_date).isoWeekday(1);
	let endDay = dayjs(req.body.end_date);

	let sql2 = `insert into lesson (course_id, day, week, start_time, end_time) values (?, ?, STR_TO_DATE(?, '%Y-%m-%d'), ?, ?)`;

	for await (let lesson of body.lessons){

		let l = startMonday.add(getWeekDay(lesson.day) ,'day');
		while(l.isSameOrBefore(endDay, 'day')){
			await dbQuery(sql2, [resp.insertId, lesson.day, l.toISOString().split('T')[0], lesson.start_time, lesson.end_time]);
			l = l.add(7, 'day');
		}
	}
	res.json({'status':'ok'});
}

function getWeekDay(day){
	switch(day){
		case 'Monday' : return 0;
		case 'Tuesday' : return 1;
		case 'Wednesday':return 2;
		case 'Thursday':return 3;
		case 'Friday':return 4;
		case 'Saturday':return 5;
		case 'Sunday':return 6;
	}
}

async function updateCourse(req, res){
	let body = req.body;

	let sql =`update course set name = ?, description = ? where id = ?`;
	await dbQuery(sql, [body.name, body.description, body.course_id]);
	await dbQuery("delete from course_student where course_id = ?", body.course_id);
	for await(let participant of body.participants){
		await dbQuery("insert into course_student (course_id, student_id) values (?, ?)", [body.course_id, participant.id]);
	}

	res.json({'status':'ok'});
}

async function getCoursesDate(req, res){
	let uid = req.query.teacher_id;
	let date = req.query.date;
	let sql =`select l.id, c.name, l.start_time, l.end_time from course c inner join lesson l on l.course_id = c.id
	where c.teacher_id = ? and STR_TO_DATE(?, '%Y-%m-%d') = l.week `;
	let resp = await dbQuery(sql, [uid, date]);
	console.log(resp);
	res.json(resp);
}

async function getCoursesName(req, res){
	let uid = req.query.user_id;
	let type = req.query.user_type;
	let sql;
	if(type == 'teacher'){
		sql =`select name, id from course where teacher_id = ?`;
	} else {
		sql =`select c.name, c.id from course c inner join course_student cs on cs.course_id = c.id where cs.student_id = ?`;
	}
	let resp = await dbQuery(sql, uid);
	res.json(resp);
}

export {getCourses, updateCourse, deleteCourse, postCourse, getCoursesDate, getCoursesName}