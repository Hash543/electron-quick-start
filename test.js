// /var/www/inspect-admin/admin/csv_upload
// with commonJS
const { Client } = require('node-scp')
const fs = require('fs')
const dir = 'd:/csv'
async function test(cb) {
		const client = await Client({
		  host: '139.162.112.149',
		  port: 22,
		  username: 'csvupload',
		  password: 'cW8RsAanDL',
		  // privateKey: fs.readFileSync('./key.pem'),
		  // passphrase: 'your key passphrase',
		})
	  	const files = fs.readdirSync(dir);
	  	for (const file of files){
	  		await client.uploadFile(dir+"/"+file, '/var/www/inspect-admin/admin/csv_upload/'+file)
	  		fs.rmSync(dir+"/"+file)
	  	}
	  	client.close()
}
test();