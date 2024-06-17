import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {getUserType, getUserId, getStudents} from '../Utils/DataStorage.js';
import {getCoursesDate, getAttendancesStudent, postAttendance} from '../Utils/DataFetch.js';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function AttendanceTeacher(){
	const navigate = useNavigate();
	const [date,setDate] = useState(dayjs().toISOString());

	const [courseList, setCourseList] = useState([]);

	useEffect(()=>{
        //get from backend

		getCoursesDate(getUserId(), date).then(json=>setCourseList(json));

		/*
		setCourseList([
			{'id':2, 'name':'matikka'},
			{'id':2, 'name':'Liikunta'},
			{'id':2, 'name':'Enkku'},
		]);
		*/

    }, [date]);

	function changeDate(v){
		setDate(v.toISOString());
	}

	function secondsToString(s){
        let hours = Math.floor(s/3600);
        let minutes =  s % 3600 / 60;
        return `${numDigits(hours) == 1?'0':''}${hours}:${numDigits(minutes) == 1?'0':''}${minutes}`;
    }

	//returns number of digits in a value.
    function numDigits(x) {
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

	const courses = courseList.map((course,index)=>(
		<ListItem key={index} disablePadding>
			<ListItemButton onClick={()=>navigate(`/attendance/${course.id}`)}>
				<ListItemText primary={course.name}/>
				<ListItemText primary={`${secondsToString(course.start_time)}-${secondsToString(course.end_time)}`}/>
			</ListItemButton>
		</ListItem>
	));

	return (
		<Paper>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker defaultValue={dayjs(date)} onChange={(v)=>changeDate(v)} label="Selected day" />
			</LocalizationProvider>

			{
				courseList.length <1 
				?<Typography>No lessons on the selected day.</Typography>
				: <List component={Stack} direction="column">
					{courses}
				</List>
			
			}
		</Paper>
	);
}

function AttendanceStudent(){

	const navigate = useNavigate();
	const [selected, setSelected] = useState(null);
	const [selectedCourse, setSelectedCourse] = useState(-1);
	const [courseList, setCourseList] = useState([]);
	const [attendanceStatus, setAttendanceStatus] = useState('');
	const [student, setStudent] = useState(getStudents()[0]);
	useEffect(()=>{
		getAttendancesStudent(student.id).then(json=>setCourseList(json));

		/*
		setCourseList([
			{'id':1, 'name':'matikka', lessons:[{'id':1, date:"23-05-2022", start_time:10*3600, end_time:12*3600}, {'id':2, date:"25-05-2022", start_time:10*3600, end_time:12*3600}]},
			{'id':2, 'name':'liikunta', lessons:[{'id':3, date:"21-05-2022", start_time:10*3600, end_time:12*3600}, {'id':4, date:"24-05-2022", start_time:10*3600, end_time:12*3600}]},
			{'id':3, 'name':'Enkku', lessons:[{'id':5, date:"23-05-2022", start_time:10*3600, end_time:11*3600}, {'id':6, date:"23-05-2022", start_time:12*3600, end_time:13*3600}]},
		]);
		*/
		
    }, [student]);


	function secondsToString(s){
        let hours = Math.floor(s/3600);
        let minutes =  s % 3600 / 60;
        return `${numDigits(hours) == 1?'0':''}${hours}:${numDigits(minutes) == 1?'0':''}${minutes}`;
    }

	//returns number of digits in a value.
    function numDigits(x) {
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

	function updateAttendace(){
		//send to backend {'id':selected.attendace_id, 'attendace_status':attendanceStatus, student:selected.student_id}
		console.log(attendanceStatus);
		console.log(selected.status);

		postAttendance(selected.id, getUserType()=='student'?getUserId():student.id,attendanceStatus).catch(e=>console.log(e));

		setCourseList(courseList.map(course=>{
			
			if(course.id != selectedCourse){
				return course;
			} else {
				let index = course.lessons.findIndex(l=>l.id == selected.id);
				course.lessons[index]['status'] = attendanceStatus;
				return course;
			}
		}));
		setSelected(null);
		setAttendanceStatus('');
	}
	console.log(courseList);
	const courses = courseList.map((course,index)=>(
		<ListItem key={index} >
			<Stack direction="row">
				<ListItemText primary={course.name}/>
				{
					<List component={Stack} direction="row">
					{
						course.lessons.map((lesson, index)=>(
							<ListItem key={index} onClick={(e)=>{setSelected(lesson);setSelectedCourse(course.id)}}>
								<Stack>
									<ListItemText primary={lesson.day}/>
									<ListItemText primary={`${secondsToString(lesson.start_time)}-${secondsToString(lesson.end_time)}`}/>
									<ListItemText primary={lesson.status}/>
								</Stack>
							</ListItem>
						))
					}
					</List>
				}
			</Stack>
		</ListItem>
	));

	return (
		<Paper>
			<div>
				<Typography>Click a lesson to change attendace status</Typography>
			</div>	

			{
            getUserType() != 'parent'?null:
            <FormControl fullWidth>
                <InputLabel id="label">Student</InputLabel>
                <Select labelId="label" value={student??''} label="Student" onChange={
                    (e)=>{
                        setStudent(e.target.value);
                    }
                }>
                    {getStudents().map(student=>(
                        <MenuItem value={student}>{student.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        }
			
			{
				courseList.length <1
				?<Typography>No lessons on the selected day.</Typography>
				:<List component={Stack} direction="column">
					{courses}
				</List>
			}

			<Dialog open={selected != null}>
				<DialogTitle>Change attendace status</DialogTitle>
				
				{
					selected?.attendance_status == 'present'?<Typography>Student was present, no action needed</Typography>:
					<FormControl fullWidth>
					<InputLabel id="label">Status</InputLabel>
					<Select labelId="label" value={attendanceStatus.length >0?attendanceStatus:selected?.attendace_status ?? ''} label="Status" onChange={(e)=>setAttendanceStatus(e.target.value)}>
						<MenuItem value={'authorized absence'}>Authorized absence</MenuItem>
						<MenuItem value={'unauthorized absence'}>Unauthorized absence</MenuItem>
					</Select>
					</FormControl>
				}

				<Stack direction="row">
					<Button onClick={()=>{setSelected(null);setAttendanceStatus('')}} variant='contained'>Cancel</Button>
					<Button disabled={attendanceStatus.length < 1} onClick={updateAttendace} variant='contained'>Create</Button>
				</Stack>
			</Dialog>

		</Paper>
	);
}

export default function Attendaces(){
	console.log(getUserType());

	return getUserType() == 'teacher'? <AttendanceTeacher/>: <AttendanceStudent/>;
}