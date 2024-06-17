
import {useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';

import {getTodaysInfo} from '../Utils/DataFetch.js';
import {getUserId, getUsername} from '../Utils/DataStorage.js';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MessageIcon from '@mui/icons-material/Message';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs'



export default function Home(){
	const navigate = useNavigate();
	const [user,setUser] = useState(null);
	const [newMessages, setNewMessages] = useState([]);
	const [lessons,setLessons] = useState(null);

	useEffect(()=>{

		if(getUserId() <1){
			navigate("/login");
			return;
		}

		getTodaysInfo(getUserId()).then(json=>{
			setNewMessages(json.messages);
			setLessons(json.lessons);
		});

		//openWebSocketConnection();
    }, []);

	const newMessagesList = newMessages.map((message,index)=>(
		<ListItem key={index} disablePadding>
			<ListItemButton onClick={()=>navigate(`/conversations/${message.receiver_id}`)}>
				<Stack>
					<Stack direction="row">
						<ListItemIcon >
							<MessageIcon />
						</ListItemIcon>
						<ListItemText primary={message.sender} />
					</Stack>
					<ListItemText primary={showContent(message.content)} />	
				</Stack>	
			</ListItemButton>
		</ListItem>
	));

	function showContent(c){
		if(c.length >30){
			return c;
		} else {
			return `${c.substring(0, 30)}...`;
		}
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

	const todaysLessons = lessons?.map((lesson, index)=>(
		<TimelineItem key={index}>
			<TimelineOppositeContent color="text.secondary">
				{`${secondsToString(lesson.start_time)}-${secondsToString(lesson.end_time)}`}
			</TimelineOppositeContent>
			<TimelineSeparator>
				<TimelineDot />
				{lessons.length - 1 == index?null:<TimelineConnector />}
			</TimelineSeparator>
			<TimelineContent>{lesson.course}</TimelineContent>
		</TimelineItem>
	));

	return (
		<Paper>
			<div>
			<Typography>{`Welcome back ${getUsername()}`}</Typography>
			</div>

			<Typography>{newMessages.length >0? `You have ${newMessages.length} new message${newMessages.length==1?'':'s'}`:"No new messages"}</Typography>
			<Stack direction='row'>
				<List component={Stack} direction="row">
					{newMessagesList}
				</List>
			</Stack>
			<Typography>Todays lessons:</Typography>
			{lessons?.length <1 ?<Typography>{"You don't have any lessons today"}</Typography>:null}
			<Timeline position="alternate">
				{todaysLessons}
			</Timeline>
		</Paper>
	);
}