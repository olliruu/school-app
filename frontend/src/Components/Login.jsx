import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';

import {getUserId, setUserData} from '../Utils/DataStorage.js';
import {login} from '../Utils/DataFetch.js';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function Login(){
	
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const [error, setError] = useState('');

	useEffect(()=>{
		if(getUserId() >0){
			navigate("/");
		}
	}, []);

	function signIn(){
		login(username, password).then(json=>{
			console.log(json);
			if(json.id <0){
				return;
			}
			setUserData(json.id, json.name, json.type, json.students);
			navigate("/");
		});//.catch(e=>setError(e.toString()));
	}

	return (
		<div>
			<Paper>
				<Typography>Login</Typography>
				
				<TextField fullWidth label="Username" onChange={(e)=>setUsername(e.target.value)}/>
				<TextField fullWidth type='password' label="password" onChange={(e)=>setPassword(e.target.value)}/>
				
				<Button variant='contained' fullWidth disabled={username.length <1 || password.length <1} onClick={signIn}>Login</Button>

				<Typography onClick={()=>navigate('/register')}>No account? Go to register page</Typography>
				<Typography> {error}</Typography>
			</Paper>
		</div>
	)
}