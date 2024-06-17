import {useNavigate, useOutletContext} from 'react-router-dom';
import React, {useState, useEffect} from 'react';

import {getUserId, pubSub} from '../Utils/DataStorage.js';
import {getConversations, getNames} from '../Utils/DataFetch.js';
import './css/Conversations.css';

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
import Autocomplete, {createFilterOptions} from '@mui/material/Autocomplete';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';

export default function Conversations(){
	
	const [conversations, setConversations] = useState([]);
	const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [names, setNames] = useState([]);
    const [selected, setSelected] = useState('');
    const navigate = useNavigate();
    const defaultFilterOptions = createFilterOptions();
    

    const filterOptions = (options, state) => {
        return defaultFilterOptions(options, state).slice(0, 6);
    };

	useEffect(()=>{
		//setConversations(getConversations);
        getConversations().then(json=>setConversations(json));

        //console.log(conversations);

        let callback = (data) =>{
            if(data.type == 'Conversation'){
                getConversations().then(json=>setConversations(json));
            }
        }
        pubSub.on("message", callback);

        return ()=> pubSub.remove("message", callback);
	}, []);

    function convoClick(id){
        navigate(`${window.location.pathname}/${id}`);
    }

	const convoList = conversations.map((row, index) => (
        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} onClick={()=>convoClick(row.other_user_id)}>
              <TableCell component="th" scope="row">{row.other_user_name}</TableCell>
              <TableCell align="right">{row.content}</TableCell>
              <TableCell align="right">{row.sender}</TableCell>
              <TableCell align="right">{row.status = "seen"?'Seen':'New'}</TableCell>
              <TableCell align="right">{dayjs(row.create_time).format('DD/MM/YYYY HH:mm:ss')}</TableCell>
            </TableRow>
    ));

    function createConversation(){
        console.log(selected);
        if(selected.id){
            convoClick(selected.id);
        }
    }

    

    const handleOpen = () =>{
            //console.log(names);
        if(names.length == 0) {
            //setNames(["heikki", 'emilia', 'ver', 'fervevfe', 'frewvrewgef', 'fsrsfrfwwedf', 'gfrewgwfwfdfw', '................', 'mfoiuwn4444444']);
            getNames().then(json=>setNames(json));
            console.log(names);
        }
        //setShowDialog(true)
    };

	return (
        <>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Person</TableCell>
                        <TableCell align="right">Last Message</TableCell>
                        <TableCell align="right">Sender</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {convoList}
                </TableBody>
            </Table>
        </TableContainer>

        <div className='parent'>
            <Button variant="contained" className='buttonLeft' startIcon={<AddIcon />} onClick={()=>setShowDialog(true)}>Create conversation</Button>
        </div>
        


        <Dialog open={showDialog} onClose={()=>setShowDialog(false)}>
        <DialogTitle>Start a new Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
                To start a new conversation select the name of the person that you want to start the conversation with.
          </DialogContentText>
           <Autocomplete loading={names.length == 0} onChange={(e,v)=>setSelected(v)} getOptionLabel={option=>option.name??''} onOpen={handleOpen} options={names} sx={{ width: 500, height:300 }} renderInput={(params) => <TextField {...params} label="Person" />}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=> setShowDialog(false)}>Cancel</Button>
          <Button onClick={createConversation}>Create conversation</Button>
        </DialogActions>
      </Dialog>
        </>
	)
}
