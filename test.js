/* eslint-disable @typescript-eslint/no-var-requires */
const https = require('https');
  
// Sample URL
const url = 'https://api.spacetraders.io/my/ships?type=EM-MK-I&location=OE-PM-TR';
  
const request = https.request({
	url:url,
	headers:{
		'Authorization':'Bearer 32f01f32-ec1e-4be5-8c7d-1e8e0cc56da1'
	},
	host:'api.spacetraders.io',
}, (response) => {
	let data = '';
	response.on('data', (chunk) => {
		data = data+ chunk;
	});
  
	response.on('end', () => {
		const body = JSON.stringify(data);
		console.log(body);
	});
});
  
request.on('error', (error) => {
	console.log('An error', error);
});
  
request.end(); 