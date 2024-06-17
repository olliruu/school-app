import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';

import {getUserId, getUserType, getStudents} from '../Utils/DataStorage.js';
import {getExams, deleteExam} from '../Utils/DataFetch.js';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';

export default function Exams(){

    const [exams, setExams] = useState([]);
    const navigate = useNavigate();
    const [student, setStudent] = useState(getStudents()[0]);

    useEffect(()=>{
        
        //get from backend
        getExams(getUserType() == 'parent'? student.id : getUserId(), getUserType()).then(json=>setExams(json));

        //setExams([{'id':2, person:'tervo L', course:'Matikka 2', 'name':'loppukoe', grade:8, date:'23-05-12'}]);
    }, [student]);

   
    console.log(exams);

    function removeExam(id){
        //delete from backend
        deleteExam(id);
        setExams(exams.filter(exam=>exam.id != id));
    }

    const examsList = exams.map((exam, index)=>(
        <TableRow key={index}>
            <TableCell component="th" scope="row">{exam.name}</TableCell>
            <TableCell align="right">{exam.course}</TableCell>
            <TableCell align="right">{exam.grade}</TableCell>
            <TableCell align="right">{getUserType() == 'teacher' ? exam.student : exam.teacher}</TableCell>
            <TableCell align="right">{dayjs(exam.date).format('DD.MM.YYYY')}</TableCell>
            {getUserType() == 'teacher'?
            <TableCell align="right">
                <Tooltip title='Delete grade' arrow>
                    <IconButton onClick={()=>removeExam(exam.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </TableCell>:null}
        </TableRow>
    ));



	return (
        <>
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
                        <TableCell align="right">Grade</TableCell>
                        <TableCell align="right">{getUserType()=='teacher'?'Student':'Teacher'}</TableCell>
                        <TableCell align="right">Date</TableCell>
                        {getUserType() == 'teacher'?<TableCell align="right">Delete</TableCell>:null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {examsList}
                </TableBody>
            </Table>
        </TableContainer>
        {getUserType() == 'teacher'?<Button onClick={()=>navigate(`/exam`)} variant='contained'>Add exam result</Button>:null}
        </>
	)
}