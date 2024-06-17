import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import {getAttendancesTeacher, postAttendance} from '../Utils/DataFetch.js';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';

export default function Attendance(){

    let {lessonId} = useParams();
	const [attendaces, setAttendances] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [date, setDate] = useState('');

    useEffect(()=>{
        //get from backend

        getAttendancesTeacher(lessonId).then(json=> {setAttendances(json); setCourseName(json[0].course_name);setDate(json[0].date)});

        /*
		setAttendances([
			{'id':1, 'name':'Tero T', status:''},
			{'id':2, 'name':'Taneli K', status:'absent'},
			{'id':3, 'name':'Ilona V', status:'present'},
		]);
        */

    }, []);

    function setAttendance(status, item){
        //post status to backend
        postAttendance(item.id, item.student_id, status);

        setAttendances(attendaces.map(a=> {
            if(a.id == item.id){
                a.status = status;   
            }
            return a;
        }))
    }

	const attendaceList = attendaces.map((item, index)=>(
        <TableRow key={index}>
            <TableCell className="table-cell-first" align="center">{item.name}</TableCell>
            <FormControl fullWidth>
					<InputLabel id="label">Status</InputLabel>
					<Select inputProps={{ readOnly: item.status == 'authorized absence' || item.status == 'unauthorized absence'  }} labelId="label" value={item.status ?? ''} label="Status" onChange={(e)=>setAttendance(e.target.value, item)}>
						<MenuItem value={'present'}>Present</MenuItem>
						<MenuItem value={'absent'}>Absent</MenuItem>
                        <MenuItem disabled={true} value={'authorized absence'}>Authorized absence</MenuItem>
                        <MenuItem disabled={true} value={'unauthorized absence'}>Unauthorized absence</MenuItem>
					</Select>
			</FormControl>
        </TableRow>
    ));



    return (
        <Paper>
            <div>
                <Typography>{courseName}</Typography>
                <Typography>{dayjs(date).format('DD.MM.YYYY')}</Typography>
            </div>
            
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell className="table-cell-first" align="center">Student</TableCell>
                            <TableCell> Attendance status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody> 
                        {attendaceList}
                    </TableBody>
                </Table>
            </TableContainer>

        </Paper>
    )
}