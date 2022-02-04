/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-var-requires */
const token = 'Bearer 32f01f32-ec1e-4be5-8c7d-1e8e0cc56da1';
const username = 'SadLonelyGamer';
const { ApiCom } = require('./apiCom');
const com = new ApiCom(token, username);
com.getStatus();
// com.getSystemShipListings('OE', 'MK-I').catch(err => { console.log(err.message); });
// com.getBuyLocation('EM-MK-I', 'OE').catch(err => { console.log(err.message); });
// com.buyShip('OE-PM-TR', 'EM-MK-I').catch(err => { console.log(err.message); });
// com.getUserShips().catch(err => { console.log(err.message); });
// com.getAccount();
// com.getAvailableShips('MK-I').catch(err => { console.log(err.message); });
// com.getAccount().catch(err => { console.log(err.message); });
// com.getSystemInfo('OE').catch(err => { console.log(err.message); });
// com.getShipInfo('ckyngh01b27970415s6jsksbsze').catch(err => { console.warn(err.message); });
// com.getShips().catch(err => { console.warn(err.message); });
// com.getUserLoans().catch(err => { console.warn(err.message); });
// com.getLoans().catch(err => { console.log(err.message); });
// com.takeLoan('STARTUP').catch(err => { console.log(err.message); });
// com.payLoan('ckydjoxd4102674115s6l5skc2l4').catch(err => console.log(err.message));
com.getSystemLocations('Os');
com.on('error', (err) => {
	console.log(err.message);
});
