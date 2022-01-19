const { ApiCom } = require('./apiCom');

const token = "Bearer 32f01f32-ec1e-4be5-8c7d-1e8e0cc56da1";
const username = "SadLonelyGamer";

let com = new ApiCom(token, username);

com.getStatus().catch(err => { console.log(err.message) })

com.getBuyLocation('ZA-MK-III', 'OE').catch(err => { console.warn(err.message); });