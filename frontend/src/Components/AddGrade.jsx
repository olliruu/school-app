import React, {useState, useEffect} from 'react';
import {getStudents, getCourseNames, postGrade} from '../Utils/DataFetch.js';
import {getUserId, getUserType} from '../Utils/DataStorage.js';

import './css/AddGrade.css';


import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

function StudentStep({courseId, next}){
    
    const [students, setStudents] = useState([]);
    useEffect(()=>{
        getStudents(courseId).then(json=>setStudents(json));
        setStudents([{id:1, name:'Tuukka T'}, {id:2, name:'Selma E'},{id:4, name:'Helena H'}, {id:3, name:'Kia J'}, {id:5, name:'Johannes U'}]);
    }, []);

    function studentSelected(selected){
        let student = students.find(c=> c.name == selected);
        if(student){
            next(student.id);
        }
    }

    return (
        <Autocomplete style={{width:'100%'}} onChange={(e,v)=> studentSelected(v)}  options={students.map(s=>s.name)} sx={{ height:200 }} renderInput={(params) => <TextField {...params} label="Student" />} />
    )
}

function CourseStep({courseId, next}){
    
    const [courses, setCourses] = useState([]);
    useEffect(()=>{
        getCourseNames(getUserId(), getUserType()).then(json=>setCourses(json));
    }, []);

    function courseSelected(selected){
        let course = courses.find(c=> c.name == selected);
        if(course){
            next(course.id);
        }
    }

    return (
        <Autocomplete style={{width:'100%'}} onChange={(e,v)=> courseSelected(v)}  options={courses.map(c=>c.name)} sx={{ height:200 }} renderInput={(params) => <TextField {...params} label="Course" />}/>
    )
}

function GradeStep({next}){

    return(
        <FormControl fullWidth sx={{height:200}}>
            <InputLabel id="label">Grade</InputLabel>
            <Select labelId="label" label="Grade" onChange={(e)=>next(e.target.value)}>
                {Array.from({length:7}, (i,index) => i =+ 4+index).reverse().map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
            </Select>
        </FormControl>
    )
}

export default function AddGrade({callback}){
    
    const [step, setStep] = useState(0);
    const [courseId, setCourseId] = useState(-1);
    const [studentId, setStudentId] = useState(-1);
    const [grade, setGrade] = useState(-1);
    const [proceed, setProceed] = useState(false);
    
    function currentStep(){
        switch(step){
            case 0: return <CourseStep next={(id)=>{
                setCourseId(id);
                setProceed(true);
            }}/>;
            case 1: return <StudentStep courseId={courseId} next={(id)=>{
                setStudentId(id);
                setProceed(true);
            }}/>;
            case 2: return <GradeStep next={(g)=>{
                setGrade(g);
                setProceed(true);
            }}/>;
        }
    }

    function nextStep(){
        if(step <2){
            setStep(step+1);
            setProceed(false);
        } else {
            postGrade(courseId, studentId, grade);
            callback();
        }
    }

    function previousStep(){
        if(step >0){
            setStep(step-1);
            setProceed(false);
        } else {
            callback();
        }
    }

    return(
    <Paper className="box" >
        <div className="parent-center">
            <Typography variant="h4">Add new grade</Typography>
        </div>
        <Stepper className="stepper" activeStep={step}>
            {['Select course', 'Select student', 'Select grade'].map((item, index)=>(
                <Step key={index}>
                    <StepLabel>{item}</StepLabel>
                </Step>
            ))}
        </Stepper>
        {currentStep()}
        <div className="button-parent">
            <Button className="button" onClick={()=>previousStep()} variant="contained">{step > 0 ? 'Previous' : 'Cancel'}</Button>
            <Button className="button" disabled={!proceed} onClick={()=> nextStep()} variant="contained">{step <2?'Next':'Add grade'}</Button>
        </div>
    </Paper>
    )
}