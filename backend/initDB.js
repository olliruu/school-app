import mysql from 'mysql';
import { readFile } from 'node:fs/promises';

let conn =  await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "olli",
		database: 'schoolapp'
	});

conn.connect((err)=>{
	//db does not exist. Initialize here
	if(err){
		console.log("database doesnt exists");
		conn = mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "olli",
		});
		conn.connect((err)=>{
			if(err){
				throw err;
			} else {
				console.log("initializing database");
				initDB();
			}
		});
	}
});


async function initDB(){
	let init = await readFile('init.sql', 'utf8');
	
	init = init.split(';');
	init = init.filter(c=>c.trim().length != 0);

	for (let index in init){
		await dbQuery(init[index], null, conn);
	}

	console.log("database initialized");
	/*
	await conn.changeUser({
		host: "localhost",
		user: "root",
		password: "olli",
		database:"schoolapp"
	});
	*/

	let fake = await readFile('fake.sql', 'utf8');

	fake = fake.split(';');
	fake = fake.filter(c=>c.trim().length != 0);

	for (let index in fake){
		await dbQuery(fake[index], null, conn);
	}

	console.log("fake data added to db");

	//await dbQuery("insert into course_student (course_id, student_id) values (?,?)", [1,3], conn);
	//let resp = await dbQuery("select * from course_student", null, conn);

}

//blocking db query to avoid callback hell.
async function dbQuery(query, values){
	let resp = await new Promise(resolve=> conn.query(query, values, (err, results, fields)=>resolve([err,results, fields]) ));
	//log error if any
	if(resp[0]){
		console.log(resp[0]);
	}
	//return results only
	//conn.end();
	return resp[1];
}

export {dbQuery, conn};