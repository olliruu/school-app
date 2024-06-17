import {dbQuery } from '../initDB.js';
import {wsClients} from './main.js';

async function messages(req, res){
	let uid = req.query.my_id;
	let otherUser = req.query.other_id;
	if(otherUser){
		let sql = `select *, (select name from user where id = ?) as other_name from message
		where sender_id = ? and receiver_id = ? or sender_id = ? and receiver_id = ?
		order by create_time asc`;
		let resp = await dbQuery(sql, [otherUser, uid, otherUser, otherUser, uid]);
		console.log(resp);
		res.json(resp);
	} else {
		//update this?
		let sql = `
	select distinct m.*, u.name as sender,
	if( m.sender_id = ?, m.receiver_id, m.sender_id) as other_user_id, 
	(select name from user where id = if( m.sender_id = ?, m.receiver_id, m.sender_id)) as other_user_name 
	from message m inner join user u on m.sender_id = u.id
	where m.sender_id = ? or m.receiver_id = ?
	order by m.create_time desc`;

	let resp = await dbQuery(sql, [uid, uid, uid, uid]);
	//console.log(resp);
	res.json(resp);
	}
}

async function postMessage(req, res){
	let body = req.body
	let sql = `insert into message (content, status, receiver_id, sender_id) values (?, 'new', ?, ?)`;
	let resp = await dbQuery(sql, [body.message, body.receiver_id, body.sender_id]);
	res.status(200).json({'status':'ok'});
	let client = wsClients[body.receiver_id];
	if(client){
		client.send(JSON.stringify({type:'Conversation', content:body.message, sender_id:body.sender_id}));
	}
}

export {messages, postMessage}