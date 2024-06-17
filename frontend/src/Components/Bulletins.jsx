import {useNavigate} from 'react-router-dom';
import React, {useState, useEffect} from 'react';

import {getUserId, getUserType} from '../Utils/DataStorage.js';
import {getBulletins} from '../Utils/DataFetch.js';
import './css/Conversations.css';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

export default function Bulletin(){
	
    const [bulletins, setBulletins] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        getBulletins(getUserId()).then(json=>setBulletins(json));
        //setBulletins(fakeRows);
    }, []);
    
    function bulletinClick(id){
        navigate(`${window.location.pathname}/${id}`);
    }

    const fakeRows = [
      {user_id:1,  bulletin_id:1,  title:'viesti asiaa', content:"Hei!", seen:false, date:"20.12.2024", sender:'Heikki T'},
      {user_id:2,  bulletin_id:2, title:"Lukujärjestys muutos",  content:"Lukujärjestys muutos", seen:true, date:"17.9.2023", sender:'You'},
      {user_id:3,  bulletin_id:3,  title:'kuulumisia' ,content:"Missä arvosanat?", seen:false, date:"2.1.2022", sender:'Vertti H'},
    ];

    const bulletinList = bulletins.map((bulletin, index )=>{
        return <TableRow key={bulletin.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} onClick={()=>bulletinClick(bulletin.id)}>
            <TableCell component="th" scope="row">{bulletin.title}</TableCell>
            <TableCell align="right">{bulletin.sender}</TableCell>
            <TableCell align="right">{bulletin.seen?'Seen':'New'}</TableCell>
            <TableCell align="right">{dayjs(bulletin.create_time).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
              </TableRow>
    });

    function createBulletin(){
        navigate(`/new_bulletin`);
    }

	return (
		<>
			<TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell align="right">Sender</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bulletinList}
                </TableBody>
            </Table>
            </TableContainer>

            {getUserType() == 'teacher'? <Button variant="contained" onClick={createBulletin} startIcon={<AddIcon />} sx={{margin:'10px'}}>Create bulletin</Button>:null}
		</>
	);
}