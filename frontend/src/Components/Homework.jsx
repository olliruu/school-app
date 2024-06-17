import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {postHomeworkTeacher, getHomeworkTeacher, getHomeworkStudent, postHomeworkStudent, BASE_IP} from '../Utils/DataFetch.js';
import {getUserId, getUserType} from '../Utils/DataStorage.js';
import {useNavigate, useSearchParams} from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';

import dayjs from 'dayjs';


function HomeworkTeacher(){

	let {homeworkId} = useParams();
	const [homeworks, setHomeworks] = useState([]);
	const [homework, setHomework] = useState({});
	const [selected, setSelected] = useState(null);
	const [grade, setGrade] = useState('');
	const [comment, setComment] = useState('');
	const navigate = useNavigate();

	useEffect(()=>{
		//getHomework(homeworkId)
		getHomeworkTeacher(homeworkId).then(json=>{
			console.log(json);
			setHomework(json.homework[0]);
			setHomeworks(json.homeworks);
		});
		//setHomeworks([{'id':1, 'name':'Assignment 1!', student:'Lassi J', description:'This is very importantn announcment!!!!', 'grade':'insu', comment:'soidu', 'teacher':'Ilona I', timestamp:'12-04-09', deadline:"11-06-23", 'files':['id':1, 'name':'file 1', 'resource':'reousree to load']}]);
	},[]);

	function gradeHomework(){
		//send hw to backend
		//{answer_id:selected.id, 'grade':grade, 'comment':comment};
		postHomeworkTeacher(selected.id, grade, comment);

		setHomeworks(homeworks.map(h=>{
			if(h.id != selected.id){
				return h;
			} else {
				h.grade = grade;
				h.comment = comment;
				return h;
			}
		}));
	}

	const homeworksList = homeworks.map((h,i)=>(
			 <ListItem key={i} disablePadding>
				<ListItemButton onClick={()=>setSelected(h)}>
					<ListItemText primary={h.student} />
					{
						h.grade != null?'Graded' : h.answer != null ?'Returned':'Not returned'
					}
				</ListItemButton>
            </ListItem>
	));
	
	return (
		<Stack>

			<Stack component={Paper}>
				<Typography>{`Homework name: ${homework.name}`}</Typography>
				<Typography>{`Homework deadline: ${homework.deadline == null?'no deadline':dayjs(homework.deadline).format('DD/MM/YYYY')}`}</Typography>
				<Typography>Homework description:</Typography>
				<Typography>{homework.description}</Typography>
			</Stack>

			<List sx={{}}>
				{homeworksList}
			</List>
		<Paper>
			
			<Stack direction="row">
				

				{
					selected != null?
					selected.answer != null?
					<Paper >
						<Typography>{`Student name: ${selected.student}`}</Typography>
						<Typography>Answer:</Typography>
						<Typography>{selected.answer}</Typography>
					
						{selected?.files?.length >0?<>
							<Typography>Files returned with homework:</Typography>
							<Filelist files={selected.files}/>
							</>:<Typography>No files returned with homework.</Typography>}

						{
							selected?.grade != null
							?
							<Stack>
								<Typography variant='h6' >Homework is graded</Typography>
								<Typography>{`Grade: ${selected.grade}`}</Typography>
								<Typography>{`Comment: ${selected.comment}`}</Typography>
							</Stack>
							
							:
							<Stack direction='row' fullWidth>
								<Typography>Grade homework</Typography>
								<TextField value={selected?.comment} label="Comment (optional)" onChange={(e)=>setComment(e.target.value)} variant="outlined"/>
								<TextField value={selected?.grade} label="Grade" onChange={(e)=>setGrade(e.target.value)} variant="outlined" />
								<Button onClick={gradeHomework} variant='contained'>Grade homework</Button>
							</Stack>
						}
					</Paper>
					:<Typography variant='h6'>Student has not returned homework yet!</Typography>

				:<Stack><Typography variant='h6'>No homework selected</Typography></Stack>
				}
			</Stack>

			<Button onClick={()=>navigate("/homeworks")} fullWidth variant='contained'>Return to homeworks page</Button>
		</Paper>
		</Stack>
	)
}

function HomeworkStudent(){	
	
	let {homeworkId} = useParams();
	let [content, setContent] = useState('')
	const [files, setFiles] = useState([]);
	const [homework, setHomework] = useState(null);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(()=>{
		//getHomework(homeworkId)
		getHomeworkStudent(homeworkId, searchParams.get("answer_id")).then(json=>setHomework(json));
		//setHomework({'id':1, 'name':'Assignment 1!', description:'This is very importantn announcment!!!!', 'teacher':'Ilona I', timestamp:'12-04-09', deadline:"11-06-23", files:['id':1, 'name':'file 1', 'resource':'reousree to load']});
	},[]);


	console.log(homework);
	function sendHomework(){
		//post homework

		let fd = new FormData();
		fd.append("homework_id", homeworkId);
		fd.append("content", content);
		fd.append("student_id", getUserType() == 'student'?getUserId(): searchParams.get("student_id"));
		[...files].forEach(file => fd.append("files", file, file.name));
		postHomeworkStudent(fd);

		navigate("/homeworks");
	}

	

	return (
		<Paper>

			<Typography>Homework name: {homework != null?homework.name:'loading homework...'}</Typography>
			<Typography>Homework description: {homework != null?homework.description:'loading homework...'}</Typography>
			<Typography>{homework != null?`Teacher:${homework.teacher}`:'loading homework...'}</Typography>
			<Typography variant='h6'>{getUserType() == 'parent'? 'Parents cannot do homeworks':''}</Typography>
			
			<Filelist files={homework?.files}/>
			
			<TextField InputProps={{readOnly: homework?.answer != null || getUserType() == 'parent'}} multiline minRows={15} value={homework?.answer?? content} sx={{mt:1}} onChange={(e)=>setContent(e.target.value)} fullWidth label="Your answer" />
			
			{homework?.answer == null && getUserType() != 'parent'?<Typography>Add attachments to the homework:</Typography>:null}
			{homework?.answer == null && getUserType() != 'parent'?<input type="file" multiple onChange={(e)=>setFiles(e.target.files)}/>:null}

			{
				homework?.grade != null?
				<Stack>
					<Typography>Grade: {homework.grade}</Typography>
					<Typography>Comment: {homework.comment??''}</Typography>
				</Stack>:<Typography>{homework?.answer != null ? 'Teacher has not graded your answer yet!':''}</Typography>
			}

			<Stack direction="row">
				<Button fullWidth onClick={()=>navigate("/homeworks")} variant='contained'>{homework?.answer != null ||getUserType() == 'parent' ?'Return to homeworks': 'Cancel'}</Button>
				<Button fullWidth disabled={content.length < 1 || homework?.answer != null || getUserType() == 'parent'} onClick={sendHomework} variant='contained'>{homework?.answer != null?'You have already done this homework': 'Create'}</Button>
			</Stack>
		</Paper>
	)
}

function Filelist({files}){

	function download(name, resource){
		const a = document.createElement('a')
		a.href = `${BASE_IP}/files/${resource}`;
		a.download = name;
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

	const fileList = files?.map(file =>  (
				<ListItem disablePadding>
					<ListItemButton onClick={()=>download(file.name, file.resource)}>
						<ListItemIcon >
							<InsertDriveFileOutlinedIcon />
						</ListItemIcon>
						<ListItemText primary={`${file.name}`} />
					</ListItemButton>
				</ListItem>
	));

	return (<List>
		{fileList}
	</List>);
}

export default function Homework(){

	return getUserType() == 'teacher'? <HomeworkTeacher/>: <HomeworkStudent/>;
}