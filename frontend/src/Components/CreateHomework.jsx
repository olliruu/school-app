import {useNavigate} from 'react-router-dom';
import React, {useState, useEffect} from 'react';

import {getUserId, getUserType} from '../Utils/DataStorage.js';
import {getCourseNames, createHomework} from '../Utils/DataFetch.js';


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';


export default function CreateHomework(){

	const [name, setName] = useState('');
	const [course, setCourse] = useState(null);
	const [courses, setCourses] = useState([]);
	const [deadline, setDeadline] = useState(null);
	const [description, setDescription] = useState('');
	const [files, setFiles] = useState([]);
	const navigate = useNavigate();

	function create(){
		let formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("deadline", deadline != null ? deadline.toISOString():null);
		formData.append("course_id", course.id);
		[...files].forEach(file=>{
			formData.append(`files`, file, file.name);
		});

		createHomework(formData);
		navigate("/homeworks");
	}

	function fetchCourses(){
		//getCourses(getUserId());
		if(courses.length >0)
			return;

			getCourseNames(getUserId(), getUserType()).then(json=>setCourses(json));

			/*
		setCourses([
			{id:1, 'name':'Matikka 2', 'description':'Matikan kurssi', start_date:'12-04-23', end_date:'12-05-26', 'lessons':[{'id':2, 'id':4}], 'participants': [{id:1,name:'Kalle h'}, {id:2,name:'Ilona V'}], timestamp:'12-04-23'},
			{id:2, 'name':'Äikkä 3', 'description':'Äikkä on ihanaa', start_date:'11-11-20', end_date:'13-02-02', 'lessons':[{'id':2, 'id':4, 'id':5}], 'participants': [{name:'Ville s', id:4}, {name:'Saija R', id:5}, {id:6, name:'Kalle B'}], timestamp:'05-11-21'},
		]);
		*/
	}

	return (
		//<Typography></Typography>
	<Paper>
		<TextField value={name} sx={{mt:1}} onChange={(e)=>setName(e.target.value)} fullWidth label="Name" />

		<TextField multiline minRows={15} value={description} sx={{mt:1}} onChange={(e)=>setDescription(e.target.value)} fullWidth label="Description" />

		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<DatePicker value={deadline} onChange={(v)=>setDeadline(v)} slotProps={{field: { clearable: true, onClear: () => setDeadline(null) },}} label="Deadline" />
		</LocalizationProvider>

		<Typography>Add attachments to the homework:</Typography>
		<input type="file" multiple onChange={(e)=>setFiles(e.target.files)}/>

		<Autocomplete onOpen={fetchCourses} options={courses} onChange={(e,t)=>setCourse(t)} sx={{ width: 500, height:100 }} 
                getOptionLabel={option=> option.name??''}
                renderInput={(params) => <TextField {...params}  label="Course" />}
                clearOnBlur loading />

		<Stack direction="row">
			<Button onClick={()=>navigate("/homeworks")} variant='contained'>Cancel</Button>
			<Button disabled={name.length <1 || description.length <1 || course == null} onClick={create} variant='contained'>Create</Button>
		</Stack>
	</Paper>
	);
}