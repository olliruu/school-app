import express from "express";
import multer  from 'multer';
const upload = multer({ dest: './uploads/' })
//import dayjs from 'dayjs';
//import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
//import isoWeek from 'dayjs/plugin/isoWeek.js';

import {getExams, postExam, deleteExam} from './exam.js';
import {messages, postMessage} from './message.js';
import {getBulletin, getBulletins, postBulletin} from './bulletin.js';
import {getAttendancesStudent, getAttendancesTeacher, postAttendance} from './attendance.js';
import {getHomeworksStudent, getHomeworksTeacher, getHomeworkStudent,
getHomeworkTeacher, postHomeworkStudent, postHomeworkTeacher, createHomework} from './homework.js';
import {getGrades, postGrade, deleteGrade, updateGrade} from './grade.js';
import {getCourses, postCourse, deleteCourse, updateCourse, getCoursesDate, getCoursesName} from './course.js';
import {getStudents, getAllStudents, getNames} from './people.js';
import {login, register} from './access.js';
import {getLessons} from './lesson.js';
import {getFile} from './media.js';

import {getTodaysInfo} from './home.js';


//dayjs.extend(isoWeek);
//dayjs.extend(isSameOrBefore)
//const __dirname = path.resolve();
const router = express.Router();

router.route("/messages").get(messages);
router.route("/message").post(postMessage);
router.route("/names/adults").get(getNames);
router.route("/bulletins").get(getBulletins);
router.route("/bulletin").get(getBulletin).post(postBulletin);
router.route('/lessons').get(getLessons);
router.route("/attendances/student/:student_id").get(getAttendancesStudent);
router.route("/attendances/teacher/:lesson_id").get(getAttendancesTeacher);
router.route('/attendance').post(postAttendance);
router.route('/courses/date').get(getCoursesDate);
router.route('/homeworks/teacher').get(getHomeworksTeacher);
router.route('/homeworks/student').get(getHomeworksStudent);
router.route('/homework/teacher/create').post(upload.array('files'), createHomework);
router.route('/homework/teacher').post(postHomeworkTeacher).get(getHomeworkTeacher);
router.route('/homework/student').post(upload.array('files') ,postHomeworkStudent).get(getHomeworkStudent);
router.route('/courses/name').get(getCoursesName)
router.route('/files/:resource').get(getFile);
router.route('/grades').get(getGrades);
router.route("/grade").post(postGrade).delete(deleteGrade).put(updateGrade);
router.route('/students').get(getStudents);
router.route('/exams').get(getExams);
router.route('/exam').delete(deleteExam).post(postExam);
router.route('/courses').get(getCourses);
router.route('/course').delete(deleteCourse).post(postCourse).put(updateCourse);
router.route('/login').post(login);
router.route('/register').post(register);
router.route("/students/all").get(getAllStudents);
router.route("/today/info").get(getTodaysInfo);


export let wsClients = [];
export let prepareWs = ()=>{
	router.ws('/websocket/:user_id', (ws, req)=>{
		let userId = req.params.user_id;
		
		wsClients[userId] = ws;
	});
}

export default router;