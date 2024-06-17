import './css/Schedule.css';

import { useMemo, useSyncExternalStore, useRef} from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';



export default function Timetable({lessons, courseName, onLessonClick}){

    const ref = useRef(null);
    const {width, height} = useDimensions(ref);
    
    const days = ['','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const dayList = days.map((day,i) =>(
        <TableCell key={i} sx={{width:day.length == 0 ? 20 : 'auto' }} className={day.length == 0 ? 'table-cell-first' : "table-cell"} align="center">{day}</TableCell>
    ));

    function placeLesson(day, start, end){

        let offsetRight = 5 - days.indexOf(day);
        let offsetBottom = 16 - end / 3600;
        let heightMultiplier = (end - start) / 3600;

        return {right:`${offsetRight * width}px`, bottom:`${offsetBottom * height}px`, height:`${heightMultiplier * height}px`, width:`${width}px`};
    }

    function secondsToString(s){
        let hours = Math.floor(s/3600);
        let minutes =  s % 3600 / 60;
        return `${numDigits(hours) == 1?'0':''}${hours}:${numDigits(minutes) == 1?'0':''}${minutes}`;
    }

    const lessonList = lessons.map((item, index)=>(
        <Tooltip key={index} title={`${secondsToString(item.start_time)} - ${secondsToString(item.end_time)}`} arrow>
            <Card sx={{ boxShadow: 6 }} style={placeLesson(item.day, item.start_time, item.end_time)} onClick={()=>onLessonClick(item)} className="lesson">
                <Typography>{item?.name ?? courseName}</Typography>
            </Card>
        </Tooltip>
    ));

    //returns number of digits in a value.
    function numDigits(x) {
        return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
    }

    function setTime(item){
        let start = numDigits(item) == 1? `0${item}:00`:`${item}:00`;
        let end = numDigits(item+1) == 1? `0${item+1}:00`:`${item+1}:00`;
        return `${start}\n${end}`;
    }

    const hourList = Array.from({length:8}, (item, index)=> item = index + 8).map(item=>(
        <TableRow key={item} sx={{}}>
            <TableCell className="table-cell-first" align="center">{setTime(item)}</TableCell>
            <TableCell ref={ref} className="table-cell"></TableCell>
            <TableCell className="table-cell"></TableCell>
            <TableCell className="table-cell"></TableCell>
            <TableCell className="table-cell"></TableCell>
            <TableCell className="table-cell"></TableCell>
        </TableRow>
    ));

    return (
        <TableContainer className="schedule" component={Paper}>
            {height>0?lessonList:null}
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {dayList}
                    </TableRow>
                </TableHead>
                <TableBody> 
                   {hourList}
                </TableBody>
            </Table>
        </TableContainer>
    )
}


function subscribe(callback) {
    window.addEventListener("resize", callback);
    return () => {
        window.removeEventListener("resize", callback);
    }
}

function useDimensions(ref) {
    const dimensions = useSyncExternalStore(
        subscribe,
        () => JSON.stringify({
            width: ref.current?.offsetWidth ?? 0, 
            height: ref.current?.offsetHeight ?? 0,
        })
    );
  return useMemo(() => JSON.parse(dimensions), [dimensions]);
}