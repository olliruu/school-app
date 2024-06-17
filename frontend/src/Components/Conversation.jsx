import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {getConversation, postMessage} from '../Utils/DataFetch.js';
import {getUserId, getUsername} from '../Utils/DataStorage.js';

import './css/Conversation.css';

import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

function stringToColor(string) {
	let hash = 0;
	let i;

	for (i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = '#';

	for (i = 0; i < 3; i += 1) {
	    const value = (hash >> (i * 8)) & 0xff;
	    color += `00${value.toString(16)}`.slice(-2);
	}
  return color;
}

function Message({message, timestamp, name, sender}){
  
	let fullName; 
	let firstName;
	let lastName;
	try{
	fullName = name.split(' ');
	firstName = fullName[0][0];
	lastName = fullName.length < 2?'':fullName[fullName.length -1][0];
	}catch(e){
	firstName = name;
	lastName = '';
	}
	
	return (
	    <>
    <div className={sender == getUserId()?'messageRowRight':'messageRowLeft'}>
		{sender != getUserId()? <Avatar alt={name} sx={{bgcolor:stringToColor(name)}} >{`${firstName}${lastName}`}</Avatar> : null}
		<div className={sender == getUserId()?'r':'l'}>
			<div className={sender == getUserId()?'displayNameRight':'displayNameLeft'}>{name}</div>
				<div className={sender == getUserId()?'messageOrange':'messageBlue'}>
				<div>
					<p className={sender == getUserId()?'messageContentRight':'messageContentLeft'}>{message}</p>
				</div>
				<div className={sender == getUserId()?'messageTimeStampRight':'messageTimeStampLeft'}>{timestamp}</div>
			</div>
        </div>
		{sender == getUserId()? <Avatar alt={name} sx={{bgcolor:stringToColor(name)}} >{`${firstName}${lastName}`}</Avatar> : null}
	</div>
    </>
  );
};


export default function Conversation(){
	let {userId} = useParams();
	const [messages, setMessages] = useState([]);
	const [user, setUser] = useState('');
	const [message, setMessage] = useState('');

	useEffect(()=>{
		//let messages = await getConversation(userId);
		getConversation(userId).then(json=>{setMessages(json); setUser(json.other_name)});
	},[]);

	function subscribe(content, senderId){
		console.log("called!");
		setMessages([...messages, {'content':content, sender_id:senderId, timestamp:dayjs()}]);
	}

	const messageList = messages.map((message, index)=>{
		return <Message key={index} message={message.content} name={message.sender_id == getUserId()? getUsername():message.other_name} sender={message.sender_id} timestamp={dayjs(message.create_time).format('DD/MM/YYYY HH:mm:ss')}/>
	});
	console.log(messages);
	console.log(getUserId());

	function sendMessage(){
		setMessages([...messages, {'content':message, sender: getUserId(), 'sender_id':getUserId(), timestamp:Date(), message_id:messages.length}]);
		postMessage({'message':message, receiver_id:userId, sender_id:getUserId()});
		
		setMessage('');
	}

	return (<>
		<div>{user}</div>
		<Paper  sx={{width:'90%', maxHeight:'80%', minHeight:400}} className={messageList.length == 0?'center_parent':''}>
			{messageList}
			{messageList.length == 0? <Typography variant="h6">Start conversation by sending a message!</Typography>:''}
		</Paper>
		<div>
		<TextField  value={message}  sx={{width:"90%"}} onChange={(e) => setMessage(e.target.value)} id="standard-text" label="Write a message" />
            <Button variant="contained" sx={{height: 55, ml:1}} color="primary" onClick={sendMessage}>
                <SendIcon />
            </Button>
		</div>
	</>);
}