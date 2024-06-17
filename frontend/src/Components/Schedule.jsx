import { useMemo, useSyncExternalStore, useRef, useState, useEffect } from "react";

import {getUserId, getUserType, getStudents} from '../Utils/DataStorage.js';
import {getLessons} from '../Utils/DataFetch.js';

import Timetable from './Timetable.jsx';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

dayjs.extend(isoWeek);


export default function Schedule(){

    const [lessons, setLessons] = useState([]);
    const [clickedCard, setClickedCard] = useState(null);
    const [monday, setMonday] = useState(dayjs().isoWeekday(1));
    const [student, setStudent] = useState(getStudents()[0]);

    useEffect(()=>{
        
        getLessons(monday.toISOString(), monday.add(7, 'day').toISOString(), getUserType() == 'teacher'? getUserId() : student.id).then(json=>setLessons(json));
        
    }, []);

    console.log(getStudents());

    console.log(lessons);
    
    function changeWeek(isNext){
        console.log(isNext);
        let m = '';
        if(isNext){
            m = dayjs(monday).add(7, 'day').toISOString();
        } else {
            m = dayjs(monday).subtract(7, 'day').toISOString();
        }
        console.log(monday);
        setMonday(m);
        getLessons(m, dayjs(m).add(6, 'day').toISOString(), getUserType() =='teacher'?getUserId():student.id).then(json=>setLessons(json));
    }

    function displayWeek(){
        return `${dayjs(monday).format('DD.MM.YYYY')}-${dayjs(monday).add(6,'day').format('DD.MM.YYYY')}`;
    }

    function secondsToString(s){
        let hours = Math.floor(s/3600);
        let minutes =  s % 3600 / 60;
        return `${numDigits(hours) == 1?'0':''}${hours}:${numDigits(minutes) == 1?'0':''}${minutes}`;
    }

    //returns number of digits in a value.
    function numDigits(x) {
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

	return(
        <>
        
        <div className='parent'>
            <Button onClick={()=>changeWeek(true)}>Next week</Button>
            <Typography>{displayWeek()}</Typography>
            <Button onClick={()=>changeWeek(false)}>Previous week</Button>
        </div>

        {
            getUserType() != 'parent'?null:
            <FormControl fullWidth>
                <InputLabel id="label">Student</InputLabel>
                <Select labelId="label" value={student??''} label="Student" onChange={
                    (e)=>{
                        setStudent(e.target.value);
                        getLessons(monday, dayjs(monday).add(6, 'day').toISOString(), e.target.value.id).then(json=>setLessons(json));
                    }
                }>
                    {getStudents().map(student=>(
                        <MenuItem value={student}>{student.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        }

        <Timetable lessons={lessons} onLessonClick={setClickedCard}/>

        <Dialog open={clickedCard != null} onClose={()=>setClickedCard(null)}>
            <DialogTitle>Lesson information</DialogTitle>
            <Stack className='parent'>
                <Typography>{clickedCard?.name ?? ''}</Typography>
                <Typography>{clickedCard?.description ?? ''}</Typography>
                <Typography>{`${secondsToString(clickedCard?.start_time ?? '')} - ${secondsToString(clickedCard?.end_time??'')}`}</Typography>
                <Typography>{clickedCard?.location ?? ''}</Typography>
                <Typography>{`Teacher: ${clickedCard?.teacher ?? ''}`}</Typography>
            </Stack>
        </Dialog>
        </>
	);
}