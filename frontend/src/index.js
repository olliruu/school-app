import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter,RouterProvider} from "react-router-dom";

import Root from './Components/Root.jsx'
import MainError from './Components/MainError.jsx'
import Home from './Components/Home.jsx'
import Conversations from './Components/Conversations.jsx'
import Conversation from './Components/Conversation.jsx'
import Bulletin from './Components/Bulletin.jsx'
import Bulletins from './Components/Bulletins.jsx'
import NewBulletin from './Components/NewBulletin.jsx'
import Login from './Components/Login.jsx'
import Register from './Components/Register.jsx'
import Courses from './Components/Courses.jsx'
import AddCourse from './Components/AddCourse.jsx'
import Grades from './Components/Grades.jsx'
import Schedule from './Components/Schedule.jsx'
import Groups from './Components/Groups.jsx'
import Homeworks from './Components/Homeworks.jsx'
import Homework from './Components/Homework.jsx'
import CreateHomework from './Components/CreateHomework.jsx'
import Exams from './Components/Exams.jsx'
import CreateExam from './Components/CreateExam.jsx'
import Attendance from './Components/Attendance.jsx'
import Attendances from './Components/Attendances.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errroElement:<MainError/>,
    children:[
        {path:'',element:<Home/>},
        {path:"conversations",element:<Conversations/>},
        {path:"conversations/:userId", element:<Conversation/>},
        {path:"bulletins",element:<Bulletins/>},
        {path:"bulletins/:bulletinId", element:<Bulletin/>},
        {path:"new_bulletin", element:<NewBulletin/>},
        {path:"Courses",element:<Courses/>},
        //{path:"add_course", element:<AddCourse/>},
        {path:"grades", element:<Grades/>},
        {path:"schedule", element:<Schedule/>},
        //{path:"groups", element:<Groups/>},
        {path:"courses", element:<Courses/>},
        {path:"homeworks", element:<Homeworks/>},
        {path:"create_homework", element:<CreateHomework/>},
        {path:"homeworks/:homeworkId", element:<Homework/>},
        {path:"exams", element:<Exams/>},
        {path:"exam", element:<CreateExam/>},
        {path:"Attendances", element:<Attendances/>},
        {path:"Attendance/:lessonId", element:<Attendance/>},
    ]
  },
  {
      path:"/login",
      element:<Login/>
  },
  {
      path:"register",
      element:<Register/>,
  },
  {
      path:"*",
      element:<MainError/>
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);