import {dbQuery } from '../initDB.js';
import path from 'path';
const __dirname = path.resolve();

export async function getFile(req, res){
	let resource = req.params.resource;

	let sql =`select name from homework_file where resource = ?`;
	let resp = await dbQuery(sql, resource);
	console.log(resp);
	console.log(__dirname);

	res.set("Content-Disposition", `attachment; filename="${resp[0].name}"`);
	res.sendFile(resource, {root: path.join(__dirname,'/uploads')});
}

