import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getGrades, deleteGrade, updateGrade} from '../Utils/DataFetch.js';
import {getUserId, getUserType, getStudents} from '../Utils/DataStorage.js';
import AddGrade from '../Components/AddGrade.jsx';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';

function GradesStudent(){
	const [grades, setGrades] = useState([]);
    const [student, setStudent] = useState(getStudents()[0]);

	useEffect(()=>{
		//getGrades(getUserId())
        getGrades(getUserType()=='parent'?student.id :getUserId(), getUserType()).then(json=>setGrades(json));
        /*
		setGrades([
			{'id':1, course_name:'matikka 1', student_name:'Kimmo S', grade:8, timestamp:'14-08-20', teacher_name:'Anneli A', seen:true},
			{'id':2, course_name:'maantieto 3', student_name:'Kimmo S', grade:5, timestamp:'12-03-19', teacher_name:'Aleks J', seen:false},
			{'id':3, course_name:'Fysiikka', student_name:'Kimmo S', grade:5, timestamp:'03-11-21', teacher_name:'Niina I', seen:true},
		]);
        */

	},[student]);

	const gradesList = grades.map(grade => (
		<TableRow key={grade.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{grade.course}</TableCell>
              <TableCell align="right">{grade.grade}</TableCell>
              <TableCell align="right">{grade.seen?'Seen':'New'}</TableCell>
              {getUserType() == 'parent' ? <TableCell align="right">{grade.student}</TableCell>:null}
              <TableCell align="right">{grade.teacher}</TableCell>
              <TableCell align="right">{dayjs(grade.date).format('DD.MM.YYYY')}</TableCell>
            </TableRow>
	))

	return (
        <Paper>

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
                        <TableCell>Course name</TableCell>
                        <TableCell align="right">Grade</TableCell>
                        <TableCell align="right">Status</TableCell>
                        {getUserType() == 'parent' ? <TableCell align="right">Student</TableCell>:null}
                        <TableCell align="right">Teacher</TableCell>
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {gradesList}
                </TableBody>
            </Table>
        </TableContainer>
        </Paper>
	);
}

function GradesTeacher(){

    const [grades, setGrades] = useState([]);
    const [gradeToUpgrade, setGradeToUpgrade] = useState(null);
    const [upgradedGrade, setUpgradedGrade] = useState(-1);

    const [add, setAdd] = useState(false);

    const numbers = Array.from({length:7}, (i,index) => i =+ 4+index).reverse();

    useEffect(()=>{
        getGrades(getUserId(), getUserType()).then(json=>setGrades(json));
	},[add]);

    function removeGrade(id){
        deleteGrade(id);
        setGrades(grades.filter(grade=> grade.id != id));
    }

    function update(grade){
        //update from server
        updateGrade(grade.id, upgradedGrade);

        setGrades(grades.map(g=> {
            if(grade.id != g.id){
                return g;
            } else {
                g.grade = upgradedGrade;
                return g;
            }
        }));
        setGradeToUpgrade(null);
        setUpgradedGrade(-1);
    }

    const gradesList = grades.map((grade, index)=>(
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{grade.course}</TableCell>
              <TableCell align="right">{grade.grade}</TableCell>
              <TableCell align="right">{grade.student}</TableCell>
              <TableCell align="right">{dayjs(grade.date).format('DD.MM.YYYY')}</TableCell>
              <TableCell align="right">
                    <Stack direction="row" justifyContent="end" spacing={1}>
                        <Tooltip title='Delete grade' arrow>
                            <IconButton onClick={()=>removeGrade(grade.id)} aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Update grade' arrow>
                            <IconButton onClick={()=>setGradeToUpgrade(grade)}>
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
              </TableCell>
        </TableRow>
    ));

    return (
        <>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Course name</TableCell>
                        <TableCell align="right">Grade</TableCell>
                        <TableCell align="right">Student</TableCell>
                        <TableCell align="right">Date</TableCell>
                        <TableCell sx={{pr:'40px'}} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {gradesList}
                </TableBody>
            </Table>
        </TableContainer>
            <Dialog sx={{width:'60%' ,height:'60%'}} open={gradeToUpgrade != null} onClose={()=>setGradeToUpgrade(null)}>
            <DialogTitle>Update grade</DialogTitle>
                <Stack>
                    <Typography>{gradeToUpgrade?.course_name ?? ''}</Typography>
                    <Typography>{gradeToUpgrade?.student_name ?? ''}</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="label">Grade</InputLabel>
                        <Select labelId="label" label="Grade" onChange={(e)=>setUpgradedGrade(e.target.value)}>
                            {numbers.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button onClick={()=> update(gradeToUpgrade)}>Update grade</Button>
                </Stack>
            </Dialog>
            {add ? null : <Button sx={{width:'100%', mt:'20px'}} variant='contained' onClick={()=>setAdd(true)}>New Grade</Button>}
            {add ? <AddGrade callback={()=>{setAdd(false) }}/> : null}
        </>
    );
}

export default function Grades(){
	return (
		<>
			{getUserType() == 'teacher'? <GradesTeacher/>:<GradesStudent/>}
		</>
	);
}