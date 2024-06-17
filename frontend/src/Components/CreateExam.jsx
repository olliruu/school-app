import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import {getUserId, getUserType} from '../Utils/DataStorage.js';
import {getCourseNames, getStudents, postExam} from '../Utils/DataFetch.js';


import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';

export default function CreateExam(){

	const navigate = useNavigate();
	let [courses, setCourses] = useState([]);
	let [students, setStudents] = useState([]);

	let [name, setName] = useState('');
	let [grade, setGrade] = useState('');
	let [course, setCourse] = useState(null);
	let [student, setStudent] = useState(null);

	function fetchCourses(){
		setStudent(null);
		getCourseNames(getUserId(), getUserType()).then(json=>setCourses(json));
	}

	function fetchStudents(){
		getStudents(course.id).then(json=>setStudents(json));
	}

	function create(){
		postExam(student.id, grade, course.id, name);
		navigate("/exams");
	}
	console.log(student);
	console.log(course);
	console.log(grade);
	console.log(name);
	
	return (
		<Paper>
			<Autocomplete onOpen={fetchCourses} options={courses} onChange={(e,t)=>setCourse(t)} sx={{ width: 500, height:100 }} 
				getOptionLabel={option=> option.name??''} clearOnBlur loading 
				renderInput={(params) => <TextField {...params}  label="Course" />}/>

			<Autocomplete onOpen={fetchStudents} options={students} onChange={(e,t)=>setStudent(t)} sx={{ width: 500, height:100 }} 
				getOptionLabel={option=> option.name??''} clearOnBlur loading disabled={course == null}
				renderInput={(params) => <TextField {...params}  label="Course" />}/>

			<TextField label="Exam name" variant="outlined" onChange={(e)=>setName(e.target.value)} />

			

			 
            <FormControl fullWidth>
                <InputLabel id="label">Grade</InputLabel>
                <Select labelId="label" label="Grade" onChange={(e)=>setGrade(e.target.value)}>
                    {[4,5,6,7,8,9,10].map(grade=>(
                        <MenuItem value={grade}>{grade}</MenuItem>
                    ))}
                </Select>
                </FormControl>

			<Stack direction="row">
				<Button onClick={()=>navigate("/exams")} variant='contained'>Cancel</Button>
				<Button disabled={course == null || name.length <1 || student == null || grade.length <1} onClick={create} variant='contained'>Create</Button>
			</Stack>
		</Paper>
	);
}