import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';

import {getUserId, setUserData} from '../Utils/DataStorage.js';
import {register} from '../Utils/DataFetch.js';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function Register(){
	
	const [username, setUsername] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [students, setStudents] = useState([]);
	const [userType, setUserType] = useState('teacher');

	const [studentUsername, setStudentUsername] = useState('');
	const [studentName, setStudentName] = useState('');
	const [studentPassword, setStudentPassword] = useState('');

	const navigate = useNavigate();

	useEffect(()=>{
		if(getUserId() >0){
			navigate("/");
		}
	}, []);

	function createAccount(){
		register(name, password, username, userType, userType == 'parent'?students:[]).then(json=>{
			if(json.id <1)
				return;
		
			setUserData(json.id, json.name, json.type, json.students);	
			navigate("/");
		});
	}

	function addStudent(){
		setStudents([...students, {'name':studentName, 'username':studentUsername, 'password':studentPassword}]);
		setStudentName('');
		setStudentPassword('');
		setStudentUsername('');
	}

	function removeStudent(s){
		setStudents(students.filter(student => student != s));
	}

	const studentList = students.map((s, i)=>(
		<ListItemButton key={i} selected={false} onClick={(event) => removeStudent(s)}>
			<ListItemText primary={`name: ${s.name} password:${s.password}`} />
			<ListItemIcon>
				<DeleteOutlineOutlinedIcon/>
			</ListItemIcon>
        </ListItemButton>
	));

	return (
		<div>
			<Paper sx={{width:'400px', height:'350px'}}>
				<Typography>Create account</Typography>
				
				<TextField fullWidth label="Name" onChange={(e)=>setName(e.target.value)}/>
				<TextField fullWidth label="Username" onChange={(e)=>setUsername(e.target.value)}/>
				<TextField type='password' fullWidth label="Password" onChange={(e)=>setPassword(e.target.value)}/>


				<FormControl fullWidth>
					<InputLabel id="label">User type</InputLabel>
					<Select labelId="label" value={userType} label="User type" onChange={(e)=>setUserType(e.target.value)}>
						<MenuItem value={'teacher'}>Teacher</MenuItem>
						<MenuItem value={'parent'}>Parent</MenuItem>
					</Select>
				</FormControl>

				{
					userType == 'parent'?
					
					<Box>
						<Typography>Create account for a student</Typography>

						<TextField fullWidth value={studentName} label="Student name" onChange={(e)=>setStudentName(e.target.value)}/>
						<TextField fullWidth value={studentUsername} label="Student username" onChange={(e)=>setStudentUsername(e.target.value)}/>
						<TextField type='password' value={studentPassword} fullWidth label="Student password" onChange={(e)=>setStudentPassword(e.target.value)}/>
						<Button variant='contained' disabled={studentUsername.length <1 || studentPassword.length <1 || studentName.length <1} onClick={addStudent}>Add Student</Button>

						<List>
							{studentList}
						</List>
					</Box>

					

					:null
				}
						
				
				<Button disabled={username.length <1 || password.length <1 || name.length <1 || userType == 'parent' && students.length <1} onClick={createAccount}>create account(s)</Button>

				<Typography onClick={()=>navigate('/login')}>Already have an account? Go to login page</Typography>
			</Paper>
		</div>
	)
}