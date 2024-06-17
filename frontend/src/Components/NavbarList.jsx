import {Link, useNavigate} from 'react-router-dom';

import {useState, useEffect, useRef} from 'react';
import {setUserData, pubSub} from '../Utils/DataStorage.js';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';

import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BackHandIcon from '@mui/icons-material/BackHand';
import MessageIcon from '@mui/icons-material/Message';

export default function NavbarList(){

    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);
    const [wsMessages, setWsMessages] = useState([]);
    const counter = useRef(0);

    function callback(event) {
        let data = event.detail;
        if(data.type != navbarItemsStuff[selected].text.slice(0,-1)){
            setWsMessages(messages=>[...messages, data]);
        }
    }

    useEffect(()=>{
        pubSub.on("message", callback);

        return ()=> {
            pubSub.remove("message", callback);
            
        };
    },[]);

    const logOut = function(){
        setUserData(-1, '', '', []);
        navigate("/login");
    }

    //nav bar items for school stuff
    const navbarItemsStuff = [
        {text:'Home', link:'/', icon:<HomeOutlinedIcon/>, callback:null},
        {text:'Conversations', link:'/conversations', icon:<MessageIcon/>, callback:null},
        {text:'Bulletins', link:'/bulletins', icon:<InboxOutlinedIcon/>, callback:null},
        {text:'Schedule', link:'/schedule', icon:<CalendarTodayOutlinedIcon/>, callback:null},
        {text:'Attendace', link:'/attendances', icon:<BackHandIcon/>, callback:null},
        {text:'Homeworks', link:'/homeworks', icon:<HistoryEduOutlinedIcon/>, callback:null},
        {text:'Grades', link:'/grades', icon:<GradingOutlinedIcon/>, callback:null},
        {text:'Exams', link:'/exams', icon:<ContentPasteOutlinedIcon/>, callback:null},
        {text:'Courses', link:'/courses', icon:<SchoolOutlinedIcon/>, callback:null},
        {text:'Log out', link:null, icon:<LogoutOutlinedIcon/>, callback:logOut},
    ];

    function itemClick(i){
        if(i == navbarItemsStuff.length - 1){
            logOut();
        } else {
            setSelected(i);
            setWsMessages(wsMessages.filter(m=>m.type != navbarItemsStuff[i].text.slice(0,-1) ));
        }
    }

    function getContentCount(i){
        return wsMessages.filter(m=> m.type == navbarItemsStuff[i].text.slice(0,-1)).length;
    }

    const listItems = navbarItemsStuff.map((item, index) => {
       return <ListItem selected={selected == index} key={index} disablePadding>
                <ListItemButton component={Link} to={item.link} onClick={()=>itemClick(index)}>
                    <Badge badgeContent={getContentCount(index)} color="primary">
                        <ListItemIcon>{item.icon}</ListItemIcon>
                     </Badge>
                    <ListItemText primary={item.text} />
              </ListItemButton>
        </ListItem>
    });


	return <List>{listItems}</List>;
}