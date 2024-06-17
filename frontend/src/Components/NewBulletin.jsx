import {useNavigate} from 'react-router-dom';
import React, {useState, useEffect} from 'react';

import {getUserId, getUserType} from '../Utils/DataStorage.js';
import {postBulletin, getCourseNames} from '../Utils/DataFetch.js';
import './css/NewBulletin.css';

import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

export default function NewBulletin(){

	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [switchSelected, setSwitchSelected] = useState(true);
	const [courses, setCourses] = useState([]);
	const [allCourses, setAllCourses] = useState([]);

	const navigate = useNavigate();

	useEffect(()=>{
		//getCourses();
		getCourseNames(getUserId(),getUserType()).then(json=>setAllCourses(json));
		//setAllCourses([{'id':1, name:'ryhmä 1'},{'id':2, name:'ryhmä 2'},{'id':3, name:'ryhmä 3'},{'id':4, name:'ryhmä 4'},])
	}, []);

	function hideButton(){
		return title.length <1 || content.length <1 || (courses.length <1 && !switchSelected)
	}

	function createBulletin(){
		postBulletin({'title':title, 'content':content, 'courses':courses.length == 0?null:courses, 'user_id':getUserId()});
		navigate(`/bulletins`);
	}
	
	const menuItems = allCourses.map((group) => (
				<MenuItem key={group.id} value={group}>
				<Checkbox checked={courses.indexOf(group.id) > -1} />
				<ListItemText primary={group.name} />
				</MenuItem>
			))

	return (<Paper>

		<Stack>

		<div className='parent'>
			<Typography variant='h6'>Create a new bulletin</Typography>
		</div>

		<TextField value={title} sx={{mt:1}} onChange={(e)=>setTitle(e.target.value)} fullWidth label="Title" />

		<TextField value={content} sx={{mt:5}} minRows={5} onChange={(e)=>setContent(e.target.value)} multiline fullWidth label="Content" />

		<Stack direction="row" sx={{mt:3}} spacing={1} alignItems="center">
			<Typography>Send to specific group(s)</Typography>
			<Switch defaultChecked onChange={(e)=>setSwitchSelected(e.target.checked)}/>
			<Typography>Send to everyone</Typography>
		</Stack>

		{switchSelected?null: <>
			<FormControl sx={{mt:3}}>
			<InputLabel id='label'>Courses</InputLabel>
			<Select value={courses} label="Courses" multiple onChange={(e)=>setCourses(e.target.value)} labelId='label' 
			renderValue={(selected) => selected.map(s=>s.name).join(", ")} >
			{menuItems}
			</Select>
			</FormControl>
			</>
		}

		<Button sx={{mt:5}} disabled={hideButton()} variant="contained" onClick={createBulletin}>Create bulletin</Button>
		</Stack>

	</Paper>);
}