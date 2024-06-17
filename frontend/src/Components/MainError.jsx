import {useNavigate} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {getUserId} from '../Utils/DataStorage.js';

import Typography from '@mui/material/Typography';

export default function MainError(){
	
	const navigate = useNavigate();

	return (<div>
			<Typography>You have wandered to a non existing page!</Typography>
			{
				getUserId() > -1
				?<Typography onClick={()=>navigate("/")} >Click here to get to the home page</Typography>
				:<Typography onClick={()=>navigate("/login")} >Click here to get to the login page</Typography>
			}
		</div>);
}