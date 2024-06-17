

import {useState, useEffect} from 'react';
import {getAllStudents, postCourse,deleteCourse, updateCourse, getCourses} from '../Utils/DataFetch.js';
import {getUserId, getUserType} from '../Utils/DataStorage.js';
import Timetable from './Timetable.jsx';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
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
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import dayjs from 'dayjs';


function AddCourse({newCourseCallback}){
    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [students, setStudents] = useState([]);
    const [step, setStep] = useState(0);
    const [allStudents, setAllStudents] = useState([]);
    const [startTime, setStartTime] = useState(dayjs('2022-04-17T09:00'));
    const [endTime, setEndTime] = useState(dayjs('2022-04-17T10:00'));
    const [day, setDay] = useState('');
    const [lessons, setLessons] = useState([]);

    const steps = ['Course information', 'Lessons', 'participants'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(()=>{
        getAllStudents().then(json=> setAllStudents(json));
        /*
		setAllStudents([
			{'id':1, name:'Elias V'},
			{'id':2, name:'Hanne I'},
			{'id':3, name:'Ilmari B'},
			{'id':4, name:'Niilo K'},
		])
        */
	}, []);

    const menuItems = allStudents.map((student, index)=>(
        <MenuItem key={index} value={student}>
			<Checkbox checked={students.some(s=> s.id == student.id)} />
			<ListItemText primary={student.name} />
		</MenuItem>
    ));

    function next(){
        if(step <2) {
            setStep(step+1);
        } else {
            postCourse(name, description, location, startDate.toISOString(), endDate.toISOString(), getUserId() , students, lessons);
            //{'name':name, 'description':description, start_date:startDate.toISOString(), end_date:endDate.toISOString(), 'lessons':lessons, 'participants': students};
            //console.log({'name':name, 'description':description, 'start_date':startDate.toISOString(), 'end_date':endDate.toISOString(), 'lessons':lessons, 'participants': students});
            newCourseCallback();
        }
    }

    function isDisabled(){
        console.log(startDate);

        if(step == 0 && name.length >0 && startDate != null && endDate != null){
            return false;
        } else if (step == 1 && lessons.length >0) {
            return false;
        } else if(step == 2 && students.length > 0){
            return false;
        }
        return true;
    }

    function deleteLesson(lesson){
        setLessons(lessons.filter(l=> !(l.day == lesson.day && l.startTime == lesson.startTime && l.endTime == lesson.endTime)));
    }

    function addLesson(){
        setLessons([...lessons, {'day': day, 'start_time': getTimeAsSeconds(startTime), 'end_time': getTimeAsSeconds(endTime)}]);
        setDay('');
        setStartTime(null);
        setEndTime(null);
    }

    function getTimeAsSeconds(t){
        return t.hour() * 3600 + t.minute() * 60 + t.second();

    }

    function getStep(){
        switch(step){
            case 0: 
            return (
                <Stack>
                    <Typography>Course name</Typography>
                        <TextField value={name} onChange={(e)=>setName(e.target.value)} label="Course name"></TextField>
    
                        <Typography>Course start and end dates</Typography>
                        <Stack direction="row">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={startDate} onChange={(v)=>setStartDate(v)} label="Start date" />
                                <DatePicker value={endDate} onChange={(v)=>setEndDate(v)} label="End date" />
                            </LocalizationProvider>
                        </Stack>

                        <Typography>Course location (Optional)</Typography>
                    <TextField value={location} onChange={(e)=>setLocation(e.target.value)} label="Course location"></TextField>

                        <Typography>Course description (Optional)</Typography>
                    <TextField value={description} onChange={(e)=>setDescription(e.target.value)} label="Course description"></TextField>
                </Stack>
            );
            case 1: return (
                        <Paper>
                            <Typography>New Lesson</Typography>
                            <Stack direction="row">
                                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimeField value={startTime} onChange={(v)=>setStartTime(v)} label="Start time" format="HH:mm"/>
                                    <TimeField value={endTime} onChange={(v)=>setEndTime(v)} label="End time" format="HH:mm"/>
                                 </LocalizationProvider>
                            </Stack>
                            <FormControl fullWidth>
                                <InputLabel id="day-label">Day</InputLabel>
                                <Select labelId="day-label" value={day} label="Day" onChange={(e)=>setDay(e.target.value)}>
                                    {days.map((day, i)=>(
                                        <MenuItem key={i} value={day}>{day}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button disabled={day == '' || startTime == null || endTime == null} onClick={addLesson} variant='contained'>Add lesson</Button>
                            {lessons.length >0?<Typography>Delete lessons by clicking them on the timetable</Typography>:null}
                            <Timetable onLessonClick={deleteLesson} courseName={name} lessons={lessons}/>
                        </Paper>

                    );
                    case 2: return (
                        <Paper>
                        <FormControl sx={{mt:3}}>
			                <InputLabel id='label'>Students</InputLabel>
			                <Select sx={{minWidth:'250px'}} value={students} label="Students" multiple onChange={(e)=>setStudents(e.target.value)} labelId='label' 
			                    renderValue={(selected) => selected.map(s=>s.name).join(", ")} >
			                    {menuItems}
            			    </Select>
            			</FormControl>
                        </Paper>
                    );
                    
        }
    }

    return (
    <Stack>
        <Stepper activeStep={step}>
            {steps.map((label, index) =>(
                <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>

        <Paper>
            <Stack>
                {getStep()}
            <Button disabled={step==0} onClick={()=>setStep(step==0?0:step-1)}>Previous</Button>
            <Button disabled={isDisabled()} onClick={next}>{step<2?'Next':'Create course'}</Button>
            </Stack>
        </Paper>

    </Stack>
    );
}

function CourseList(){

    const [courses, setCourses] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [courseToUpdate, setCourseToUpdate] =  useState({id:-1, name:'', participants:[], description:'', start_date:'', end_date:'', Lessons:[]});
    const [b,setB] = useState(false);
    const [b2,setB2] = useState("1");
    const [users, setUsers] = useState([]);

    useEffect(()=>{

        getCourses(getUserId()).then(json=> setCourses(json));
        /*
        setCourses([
            {id:1, 'name':'Matikka 2', 'description':'Matikan kurssi', start_date:'12-04-23', end_date:'12-05-26', 'lessons':[{'id':2, 'id':4}], 'participants': [{id:1,name:'Kalle h'}, {id:2,name:'Ilona V'}], date:'12-04-23'},
            {id:2, 'name':'Äikkä 3', 'description':'Äikkä on ihanaa', start_date:'11-11-20', end_date:'13-02-02', 'lessons':[{'id':2, 'id':4, 'id':5}], 'participants': [{name:'Ville s', id:4}, {name:'Saija R', id:5}, {id:6, name:'Kalle B'}], date:'05-11-21'},
        ]);
        */
    },[]);

    console.log(courses);

    function removeCourse(id){
        
        deleteCourse(id);
        setCourses(courses.filter(course=>course.id != id));
    }

    function update(){
        
        updateCourse(courseToUpdate.id, courseToUpdate.name, courseToUpdate.description, courseToUpdate.location, courseToUpdate.participants);

        setCourses(courses.map(course=>{
            if(course.id != courseToUpdate.id){
                return course;
            } else {
                return {id:courseToUpdate.id, name:courseToUpdate.name, participants:courseToUpdate.participants, description:courseToUpdate.description, start_date:courseToUpdate.start_date, end_date:courseToUpdate.end_date, Lessons:courseToUpdate.lessons, date:dayjs().toISOString()};
            }
        }));
        setCourseToUpdate({id:-1, name:'', participants:[]});
        setShowDialog(false);
    }

    function removeParticipant(id){
        let course = courseToUpdate;
        course.participants.filter(item=> item.id != id);
        setCourseToUpdate(course);
        /*
            setCourseToUpdate({id:courseToUpdate.id, name:courseToUpdate.name, description: courseToUpdate.description,
        start_ddate
        participants: courseToUpdate.participants.filter(item=> item.id != id)});
        */
        setB(!b);
    }

    function fetchUsers(){
        //getUsersFromBackedn
        getAllStudents().then(json=>{
            json = json.filter(u=> !courseToUpdate.participants.some(p=> p.id == u.id));
            setUsers(json);
        });
    }

    function addUser(u){

        setCourseToUpdate({id:courseToUpdate.id, name:courseToUpdate.name, participants: [...courseToUpdate.participants, u],
        description:courseToUpdate.description, start_date:courseToUpdate.start_date, end_date:courseToUpdate.end_date,
        Lessons:courseToUpdate.lessons});
        
        setB2(b2=="1"?"2":"1");
    }

    const list = courses.map((course, index)=>(
                    <TableRow key={index}>
                        <TableCell>{course.name}</TableCell>
                        <TableCell align="right">{course.participants.length}</TableCell>
                        <TableCell align="right">{dayjs(course.start_date).format('DD.MM.YYYY')}</TableCell>
                        <TableCell align="right">{dayjs(course.end_date).format('DD.MM.YYYY')}</TableCell>
                        <TableCell align="right">{dayjs(course.date).format('DD.MM.YYYY')}</TableCell>
                        <TableCell align="right">
                            <Stack direction="row" justifyContent="end" spacing={1}>
                                <Tooltip title='Delete grade' arrow>
                                    <IconButton onClick={()=>removeCourse(course.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title='Update grade' arrow>
                                    <IconButton onClick={()=>{setCourseToUpdate(course);setShowDialog(true);}}>
                                        <EditIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </TableCell>
                    </TableRow>
    ));

    
    return (<>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Participants</TableCell>
                        <TableCell align="right">Start date</TableCell>
                        <TableCell align="right">End date</TableCell>
                        <TableCell align="right">Last updated</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list}
                </TableBody>
            </Table>
        </TableContainer>

         <Dialog open={showDialog} onClose={()=>setShowDialog(false)}>
            <DialogTitle>Update course</DialogTitle>
            <Stack className='parent'>
                <Typography>Course name</Typography>
                <TextField fullWidth value={courseToUpdate.name} onChange={(e)=>setCourseToUpdate({id:courseToUpdate.id, name:e.target.value, participants:courseToUpdate.participants, 
                description:courseToUpdate.description, start_date:courseToUpdate.start_date, end_date:courseToUpdate.end_date, Lessons:courseToUpdate.lessons})} label="Course name"></TextField>
                
                <Typography>Course description</Typography>
                <TextField fullWidth value={courseToUpdate.description} onChange={(e)=>setCourseToUpdate({id:courseToUpdate.id, name:courseToUpdate.name, participants:courseToUpdate.participants, 
                description:e.target.value, start_date:courseToUpdate.start_date, end_date:courseToUpdate.end_date, Lessons:courseToUpdate.lessons})} label="Course name"></TextField>

                <Typography>Remove participants</Typography>
                <Autocomplete options={courseToUpdate.participants} key={b}
                onChange={(e,t)=>t!=null?removeParticipant(t.id):null}
                sx={{ width: 500, height:200 }} 
                getOptionLabel={option=> option.name??''}

                renderInput={(params) => <TextField {...params}  label="Person" />}
                clearOnBlur/>

                <Typography>Add participants</Typography>
                 <Autocomplete onOpen={fetchUsers} options={users} key={b2}
                onChange={(e,t)=>t!=null?addUser(t):null}
                sx={{ width: 500, height:200 }} 
                getOptionLabel={option=> option.name??''}

                renderInput={(params) => <TextField {...params}  label="Person" />}
                clearOnBlur loading/>
                
            </Stack>
            <Stack direction="row">
                <Button variant='outlined' onClick={()=>{setShowDialog(false); setCourseToUpdate({id:-1, name:'', participants:[], description:'', start_date:null, end_date:null, Lessons:[]})} }>Cancel</Button>
                <Button variant='outlined' onClick={update}>Update Course</Button>
            </Stack>
        </Dialog>
        </>
    )
}

export default function Courses(){

    const [tab, setTab] = useState(0);

    function tabPage(){
        switch(tab){
            case 0: return <CourseList/>;
            case 1: return <AddCourse newCourseCallback={()=>setTab(0)}/>;   
        }
    }

	return (
        <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(e, v)=>setTab(v)}>
            <Tab label="Courses" value={0} />
            <Tab label="Create a course" value={1} />
          </Tabs>
        </Box>
        {tabPage()}
        </>
	);
}