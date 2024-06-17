
let userId = sessionStorage.getItem('id')??-1;
let username = sessionStorage.getItem('name')??'';
let userType = sessionStorage.getItem('type')??'';

let students = [];
try{
	students = JSON.parse(sessionStorage.getItem('students'));
} catch(e){
	console.log(e);
}

function setUserData(id, name, type, s){
	userId = id;
	username = name;
	userType = type;
	students = s;

	sessionStorage.setItem("id", id);
	sessionStorage.setItem("name", name);
	sessionStorage.setItem("type", type);
	sessionStorage.setItem("students", JSON.stringify(s));
}

function getUserId() {
	return userId;
}

function getUsername(){
	return username;
}

function getUserType(){
	return userType;
}

function getStudents(){
	return students;
}

// pub/sub pattern for sending events between unrelated components.
const pubSub = {
	on(event, callback){
		console.log("add Event");
		document.addEventListener(event, callback);
	},
	dispatch(event, data){
		document.dispatchEvent(new CustomEvent(event, {detail:data}));
	},
	remove(event, callback){
		console.log("remove Event");
		document.removeEventListener(event, callback);
	}
}

export {getUserId, getUsername, getUserType, getStudents, setUserData, pubSub};