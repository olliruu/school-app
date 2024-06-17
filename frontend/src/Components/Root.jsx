import {Outlet} from 'react-router-dom';
import NavbarList from './NavbarList.jsx';
import {useLocation} from 'react-router-dom';

import { BASE_IP} from '../Utils/DataFetch.js';
import {getUserId, pubSub} from '../Utils/DataStorage.js';

import {useState, useEffect, useRef} from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


const drawerWidth = 270;

export default function Root() {

    const connection = useRef(null);
    const location = useLocation();
    const [pageName, setPageName] = useState('Home');
    //const [message, setMessage] = useState(null);

    useEffect(()=>{
        const ws = new WebSocket(`${BASE_IP}/websocket/${getUserId()}`.replace('http', 'ws'));

        ws.onopen = function () {
		    console.log("ws connect!");
		    ws.send("Hello server!");
	    };

	    ws.addEventListener("message", (event) => {
		    console.log("Message from server ", event.data);
		    let data = JSON.parse(event.data);
            pubSub.dispatch("message", data);
	    });

        connection.current = ws;
        
        const path = location.pathname.split('/')
        const name = path[path.length - 1]
        //setPageName(location.pathname == '/'? 'Home': name[0].toUpperCase() + name.slice(1))
        //console.log(location);
        //location.pathname.split('/')[1] != 'conversation'
        return () => {
            connection.current.close();

        };
    }, []);

    function setName(name){

    }
    /*
    function getMessage(){
        if(message){
            let m = message;
            console.log(`message root before null: ${message}`);
            setMessage(null);
            console.log(`message root after null: ${message}`);
        return m;
        }
        return null;
    }
    */
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h5" noWrap component="div">
            {/*pageName*/}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
        <Typography variant="h5" noWrap component="div">
            School App
          </Typography>
        </Toolbar>
        <Divider />
            <NavbarList/>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Outlet/>
      </Box>
    </Box>
  );
}