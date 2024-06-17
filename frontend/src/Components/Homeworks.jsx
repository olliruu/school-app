import {useNavigate, createSearchParams} from 'react-router-dom';
import React, {useState, useEffect} from 'react';

import {getUserId, getUserType, getStudents} from '../Utils/DataStorage.js';
import {getHomeworksTeacher, getHomeworksStudent} from '../Utils/DataFetch.js';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';

export default function Homeworks(){

    const [homeworks, setHomeworks] = useState([]);
    const navigate = useNavigate();
    const [student, setStudent] = useState(getStudents()[0]);

    useEffect(()=>{
        if(getUserType() == 'teacher'){
            getHomeworksTeacher(getUserId()).then(json=>setHomeworks(json));
        } else {
            getHomeworksStudent(student?.id??getUserId()).then(json=>setHomeworks(json));
        }
    }, [student]);

    console.log(homeworks);

    function homeworkClick(h){
        if(getUserType() == 'parent') {
            navigate(`${window.location.pathname}/${h.id}?student_id=${student.id}&answer_id=${h.answer_id}`);
        } else if(getUserType() == 'student'){
            navigate(`${window.location.pathname}/${h.id}?answer_id=${h.answer_id}`);
        } else {
            console.log(h);
            navigate(`${window.location.pathname}/${h.id}`);
        }
    }

    const homeworkList = homeworks.map(homework =>(
        <TableRow key={homework.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} onClick={()=>homeworkClick(homework)}>
            <TableCell component="th" scope="row">{homework.name}</TableCell>
            <TableCell align="right">{homework.course}</TableCell>
            <TableCell align="right">{dayjs(homework.deadline).format('DD/MM/YYYY')}</TableCell>
            <TableCell align="right">{getUserType() == 'teacher'? homework.returns :homework.teacher}</TableCell>
            {getUserType() == 'student'?<TableCell align="right">{homework.grade?.length >0?'Graded':homework.answer_id!= null?'Returned':'Not returned'}</TableCell>:null}
            <TableCell align="right">{homework.date == null?'no deadline':dayjs(homework.date).format('DD/MM/YYYY')}</TableCell>
        </TableRow>
    ));

    function createHomework(){
        navigate(`/create_homework`);
    }

	return (
        <Box>
            
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

		    <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Course</TableCell>
                        <TableCell align="right">Deadline</TableCell>
                        <TableCell align="right">{getUserType() == 'teacher'?'Returns ':'Teacher'}</TableCell>
                        {getUserType() == 'student'?<TableCell align="right">Status</TableCell>:null}
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {homeworkList}
                </TableBody>
            </Table>
            </TableContainer>


            {getUserType() == 'teacher'? <Button startIcon={<AddIcon />} onClick={createHomework} variant='contained'>Create new homework</Button>:null}
        </Box>
	)
}