import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getBulletin} from '../Utils/DataFetch.js';
import {getUserId, getUsername} from '../Utils/DataStorage.js';

import './css/NewBulletin.css';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';

export default function Bulletin(){
	let {bulletinId} = useParams();
	let [bulletin, setBulletin] = useState({});
	let [loading, setLoading] = useState(true);

	useEffect(()=>{
		//getBulletin(bulletinId)
		getBulletin(bulletinId).then(json=>{console.log(json);setBulletin(json); setLoading(false)});
		//setBulletin({'id':1, title:'important announcment!', content:'This is very importantn announcment!!!!', 'sender':'Ilona I', create_time:'12-04-09', sender_id:7});
		//setLoading(false);
	},[]);

	return (
		<Paper>
			
			<div className='parent'>
				{
					loading?<Typography variant='h6'>Loading bulletin...</Typography>:
					<Stack className='parent'>
						<Typography sx={{mt:5}} variant='h4'>{bulletin.title}</Typography>
						<Typography sx={{mt:5}}>{bulletin.content}</Typography>
					</Stack>
				}
			</div>
			{
				loading ? null : <>

					<Typography sx={{ml:'5%', mt:10}} variant='h6'>{`Sender: ${bulletin.sender}`}</Typography>
	
					<Typography sx={{ml:'5%', pb:'3%'}} variant='h6'>{`Date: ${dayjs(bulletin.create_time).format('DD/MM/YYYY HH:mm:ss')}`}</Typography>
				</>
			}
			
		</Paper>
	);
}