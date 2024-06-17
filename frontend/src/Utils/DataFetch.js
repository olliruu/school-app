import {getUserId} from './DataStorage.js';

const BASE_IP = 'http://localhost:4000/api';

async function getConversations(){
	
	const response = await fetch(`${BASE_IP}/messages?my_id=${getUserId()}`);

	return response.json();
}

async function getConversation(otherId){
	const response = await fetch(`${BASE_IP}/messages?my_id=${getUserId()}&other_id=${otherId}`);

	return response.json();
}

async function getNames(){
	const response = await fetch(`${BASE_IP}/names/adults?user_id=${getUserId()}`);

	return response.json();
}

async function postMessage(body){
	const response = await fetch(`${BASE_IP}/message`, {
		method:'POST',
		headers:{
			'Content-type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	return response.json();
}

async function getBulletins(){
	const response = await fetch(`${BASE_IP}/bulletins?user_id=${getUserId()}`);

	return response.json();
}

async function getBulletin(bulletinId){
	const response = await fetch(`${BASE_IP}/bulletin?bulletin_id=${bulletinId}`);

	return response.json();
}

async function postBulletin(body){
	const response = await fetch(`${BASE_IP}/bulletin`, {
		method:'POST',
		headers:{
			'Content-type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	return response.json();
}
/*
async function getCourseNames(){
	const response = await fetch(`${BASE_IP}/courses/name`);

	return response.json();
}
*/

async function getLessons(startDate, endDate, student){
	const response = await fetch(`${BASE_IP}/lessons?start_date=${startDate}&end_date=${endDate}&user_id=${student != undefined ? student : getUserId()}`);

	return response.json();
}

async function getAttendancesStudent(studentId){
	const response = await fetch(`${BASE_IP}/attendances/student/${studentId}`);

	return response.json();
}

async function getAttendancesTeacher(lessonId){
	const response = await fetch(`${BASE_IP}/attendances/teacher/${lessonId}`);

	return response.json();
}

async function postAttendance(lessonId, studentId, status){
	const response = await fetch(`${BASE_IP}/attendance`, {
		method:'POST',
		headers:{
			'Content-type':'application/json'
		},
		body: JSON.stringify({'lesson_id':lessonId, 'student_id': studentId, 'status':status})
	});

	console.log(response);

	return response.json();
}

async function getCoursesDate(teacherId, date){
	const response = await fetch(`${BASE_IP}/courses/date?date=${date}&teacher_id=${teacherId}`);
	return response.json();
}

async function getHomeworksStudent(userId){
	const response = await fetch(`${BASE_IP}/homeworks/student?user_id=${userId}`);
	return response.json();
}

async function getHomeworksTeacher(userId){
	const response = await fetch(`${BASE_IP}/homeworks/teacher?user_id=${userId}`);
	return response.json();
}

async function createHomework(formData){
	const response = await fetch(`${BASE_IP}/homework/teacher/create`, {
		'method':'POST',
		body:formData
	});
	return response.json();
}

async function getCourseNames(userId, type){
	const response = await fetch(`${BASE_IP}/courses/name?user_id=${userId}&user_type=${type}`);
	return response.json();
}

async function getHomeworkStudent(homeworkId, answerId){
	const response = await fetch(`${BASE_IP}/homework/student/?homework_id=${homeworkId}&answer_id=${answerId}`);
	return response.json();
}

async function postHomeworkStudent(formData){
	const response = await fetch(`${BASE_IP}/homework/student/`, {
		method:'POST',
		body:formData
	});
	return response.json();
}

async function getHomeworkTeacher(homeworkId){
	const response = await fetch(`${BASE_IP}/homework/teacher/?homework_id=${homeworkId}`);
	return response.json();
}

async function postHomeworkTeacher(answerId, grade, comment){
	const response = await fetch(`${BASE_IP}/homework/teacher/`, {
		method:'POST',
		headers:{
			'Content-type':'application/json'
		},
		body:JSON.stringify({answer_id:answerId, 'grade':grade, 'comment':comment})
	});
	return response.json();
}

async function getGrades(userId, userType){
	const response = await fetch(`${BASE_IP}/grades?user_id=${userId}&user_type=${userType}`);

	return response.json();
}

async function postGrade(courseId, studentId, grade){
	const response = await fetch(`${BASE_IP}/grade`, {
		method:'POST',
		headers:{
			'Content-type':'application/json'
		},
		body:JSON.stringify({'course_id':courseId, 'student_id':studentId, 'grade':grade})
	});

	return response.json();
}

async function deleteGrade(gradeId){
	const response = await fetch(`${BASE_IP}/grade?grade_id=${gradeId}`, {
		method:'DELETE',
	});

	return response.json();
}

async function updateGrade(gradeId, grade){
	const response = await fetch(`${BASE_IP}/grade?grade_id=${gradeId}`, {
		method:'PUT',
		headers:{
			'Content-type':'application/json'
		},
		body:JSON.stringify({'grade_id':gradeId, 'grade':grade})
	});

	return response.json();
}

async function getStudents(courseId){
	const response = await fetch(`${BASE_IP}/students?course_id=${courseId}`);

	return response.json();
}

async function getExams(userId, userType){
	const response = await fetch(`${BASE_IP}/exams?user_id=${userId}&user_type=${userType}`);

	return response.json();
}

async function postExam(studentId, grade, courseId, name){
	const response = await fetch(`${BASE_IP}/exam`, {
		method:'POST',
		headers:{
			'Content-type':'application/json'
		},
		body:JSON.stringify({'student_id':studentId, 'grade':grade, 'course_id':courseId, 'name':name})
	});

	return response.json();
}

async function deleteExam(examId){
	const response = await fetch(`${BASE_IP}/exam?exam_id=${examId}`, {
		method:'DELETE',
	});

	return response.json();
}

async function getCourses(userId){
	const response = await fetch(`${BASE_IP}/courses?user_id=${userId}`);

	return response.json();
}

async function deleteCourse(courseId){
	const response = await fetch(`${BASE_IP}/course?course_id=${courseId}`, {
		method:'DELETE',
	});

	return response.json();
}

async function postCourse(name, description, location, startDate, endDate, teacher, participants, lessons){
	const response = await fetch(`${BASE_IP}/course`, {
		method:'POST',
		headers:{
			'Content-type':'application/json'
		},
		body:JSON.stringify({'name':name, 'description':description, 'location':location,
		start_date:startDate, end_date:endDate, teacher_id:teacher, 'participants':participants, 'lessons':lessons})
	});

	return response.json();
}

async function updateCourse(id, name, description, location, participants){
	const response = await fetch(`${BASE_IP}/course`, {
		method:'PUT',
		headers:{
			'Content-type':'application/json'
		},
		body:JSON.stringify({'course_id':id, 'name':name, 'description':description, 'location':location,'participants':participants})
	});

	return response.json();
}

async function login(username, password){
	const response = await fetch(`${BASE_IP}/login`, {
		method:'POST',
		headers:{
			'Content-type':'application/json'
		},
		body:JSON.stringify({'username':username, 'password':password})
	});

	return response.json();
}

async function register(name, password, username, userType, students){
	const response = await fetch(`${BASE_IP}/register`, {
		method:'POST',
		headers:{
			'Content-type':'application/json'
		},
		body:JSON.stringify({'name':name, 'password':password, 'username':username, 'type':userType, 'students':students})
	});

	return response.json();
}

async function getAllStudents(){
	const response = await fetch(`${BASE_IP}/students/all`);

	return response.json();
}

async function getTodaysInfo(userId){
	const response = await fetch(`${BASE_IP}/today/info?user_id=${userId}`);

	return response.json();
}


export {BASE_IP, getConversations, getConversation, getNames, postMessage, getBulletin, getBulletins, postBulletin,
 getLessons, getAttendancesStudent, getAttendancesTeacher, postAttendance, getCoursesDate,
getHomeworksStudent, getHomeworksTeacher, createHomework, getCourseNames, getHomeworkStudent, postHomeworkStudent,
getHomeworkTeacher, postHomeworkTeacher, getGrades, postGrade, deleteGrade, updateGrade, getStudents, getExams,
postExam, deleteExam, getCourses, deleteCourse, postCourse, updateCourse, login, register, getAllStudents, getTodaysInfo};