<<<<<<< HEAD:apiCom.ts
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios').default;
const qs = require('qs');
const { EventEmitter } = require('events');


/**
 * ApiCom
 * The communicator for the spacetraders api
 * (For use with discord.js)
 * @author - Justin Cardenas
 * @version - 1.0.0
 */

class ApiCom {
	private _token: string;
	private _username: string;
	private _base_url: string;
	private axios_client: typeof axios;
	public emitter:typeof EventEmitter;
	/**
	 * Builds the api communicator for SpaceTraders
	 * @param {String} token - The Bearer token of the user
	 * @param {String} username - Username of the user
	 */
	constructor(token:string, username:string) {
		this._token = token;
		this._username = username;
		this._base_url = 'https://api.spacetraders.io';
		this.axios_client = axios.create({
			baseURL:this._base_url,
			headers:{
				'Authorization':this._token
			}
		});
		this.emitter = new EventEmitter();
	}

	get getToken() {
		return this._token;
	}
	get getUsername() {
		return this._username;
	}
	set setToken(token:string) {
		this._token = token;
	}
	set setUsername(username:string) {
		this._username = username;
	}


	//Miscellaneous Requests

	/**
	 * Gets the status of game servers
	 */
	async getStatus() {
		const res = await this.axios_client.request({
			method:'get',
			url:`${this._base_url}/game/status`
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(`http code: ${ res.status }\nStatus: ${ res.data.status }`);

	}
	/**
	 * Gets the users account
	 */
	async getAccount() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/account',
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res);
	}




	// System Requests

	/**
	 * Gets information on a system
	 * @param symbol - symbol of system
	 */
	async getSystemInfo(symbol:string) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol.toUpperCase()}`
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}
	async getSystemLocations(symbol:string) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol}/locations`
		})
			.catch(err => { this.emitter.emit('httpError', err); return false;});
		
		if (!res) {
			return;
		}
		console.log(res.data);
	}

	// Ship Requests

	/**
	 * buy a thing
	 * @param location_symbol - Location of the ship
	 * @param ship_symbol - symbol of the ship to buy
	 */
	async buyShip(location_symbol:string, ship_symbol:string) {
		const res = await axios({
			method:'POST',
			url:'/my/ships',
			params:{
				location:location_symbol,
				type:ship_symbol
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}


	/**
	 * Gets the ship listings of the system
	 * @param symbol - Symbol of system
	 * @param ship_class - Class of ships (defaults to null)
	 * @returns - http request
	 */
	async getSystemShipListings(symbol:string, ship_class:string) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const res = await axios({
			method:'get',
			url:`/systems/${symbol.toUpperCase()}/ship-listings`,
			params:{
				'class':ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);

			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}
	/**
	 * Gets the users ships
	 */
	async getUserShips() {
		const res = await axios({
			method:'get',
			url:'/my/ships',
		});
		console.log(res.data);
	}
	/**
	 * Gets the buy location of the ship specifed in the system
	 * @param symbol - symbol of the ship to look for
	 * @param system - system to look in
	 */
	async getBuyLocation(symbol:string, system:string) {
		const res = await axios({
			method: 'get',
			url:`/systems/${system}/ship-listings`,
		})
			.catch(err => { this.emitter.emit('httpError', err); return false; });
		
		if (!res) {
			return;
		}
		let i = 0;
		for (const listing of res.data.shipListings) {
			if (listing.type === symbol) {
				i++;
				for (const location of listing.purchaseLocations) {
					console.log(location);
					
				}
				break;
			}
		}
		if (i === 0) {
			this.emitter.emit('error', new Error('This ship does not exist'));
		}
	
		
	}
	/**
	 * Gets all available ships
	 * @param ship_class - Sort by class (optional)
	 */
	async getAvailableShips(ship_class:string) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const res = await axios({
			method:'get',
			url:'/types/ships',
			params:{
				'class':ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });

		console.log(res.data);
	}
	/**
	 * Gets information on given ship
	 * @param shipID - actual id of the ship 
	 */
	async getShipInfo(shipID:string) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/my/ships/${shipID}`
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}
	/**
	 * Gets users ships
	 */
	async getShips() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/ships'
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}



	// Loans Requests


	/**
	 * get loans you have taken out
	 */
	async getUserLoans() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/loans'
		})
			.catch(err => { this.emitter.emit('httpError', err); return false; });
		if (!res) {
			return;
		}
		console.log(res.data);
	}


	/**
	 * Take a loan
	 * @param type - Type of loan to take
	 */
	async takeLoan(type:string) {
		const res = await this.axios_client.request({
			method:'POST',
			url:'/my/loans',
			params:{
				type:type.toUpperCase()
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { this.emitter.emit('httpError', err); return false;});
		
		if (!res) {
			return;
		}
		console.log(res.data);
	}
	/**
	 * get all loans available
	 */
	async getLoans() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/types/loans'
		})
			.catch(err => { this.emitter.emit('httpError', err); return false; });
		if (!res) {
			return;
		}
		console.log(res.data);
	}

	/**
	 * 
	 * @param loanID - id of the loan (NOT TYPE)
	 */
	async payLoan(loanID:string) {
		const res = await this.axios_client.request({
			method:'PUT',
			url:`/my/loans/${loanID}`,
		})
			.catch(err => { this.emitter.emit('httpError', err); return false; });
		
		if (!res) {
			return;
		}
		console.log(res.data);
	}
	
	
}

module.exports = {
	ApiCom
=======
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios').default;
const qs = require('qs');


/**
 * ApiCom
 * The communicator for the spacetraders api
 * (For use with discord.js)
 * @author - Justin Cardenas
 * @version - 1.0.0
 */

class ApiCom {
	/**
	 * Builds the api communicator for SpaceTraders
	 * @param {String} token - The Bearer token of the user
	 * @param {String} username - Username of the user
	 */
	constructor(token, username) {
		this._token = token;
		this._username = username;
		this._base_url = 'https://api.spacetraders.io';
		this.axios_client = axios.create({
			baseURL:this._base_url,
			headers:{
				'Authorization':this._token
			}
		});
	}

	get getToken() {
		return this._token;
	}
	get getUsername() {
		return this._username;
	}
	set setToken(token) {
		this._token = token;
	}
	set setUsername(username) {
		this._username = username;
	}


	//Miscellaneous Requests

	/**
	 * Gets the status of game servers
	 */
	async getStatus() {
		const res = await axios({
			method:'get',
			url:`${this._base_url}/game/status`
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(`http code: ${ res.status }\nStatus: ${ res.data.status }`);

	}
	/**
	 * Gets the users account
	 */
	async getAccount() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/account',
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res);
	}




	// System Requests

	/**
	 * Gets information on a system
	 * @param {String} symbol - symbol of system
	 */
	async getSystemInfo(symbol) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/systems/${symbol.toUpperCase()}`
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}

	// Ship Requests

	/**
	 * buy a thing
	 * @param {String} location_symbol - Location of the ship
	 * @param {String} ship_symbol - symbol of the ship to buy
	 */
	async buyShip(location_symbol, ship_symbol) {
		const res = await axios({
			method:'POST',
			url:'/my/ships',
			params:{
				location:location_symbol,
				type:ship_symbol
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}


	/**
	 * Gets the ship listings of the system
	 * @param {String} symbol - Symbol of system
	 * @param {String} ship_class - Class of ships (defaults to null)
	 * @returns - http request
	 */
	async getSystemShipListings(symbol, ship_class) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const res = await axios({
			method:'get',
			url:`/systems/${symbol.toUpperCase()}/ship-listings`,
			params:{
				'class':ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}
	/**
	 * Gets the users ships
	 */
	async getUserShips() {
		const res = await axios({
			method:'get',
			url:'/my/ships',
		});
		console.log(res.data);
	}
	/**
	 * Gets the buy location of the ship specifed in the system
	 * @param {String} symbol - symbol of the ship to look for
	 * @param {String} system - system to look in
	 */
	async getBuyLocation(symbol, system) {
		const res = await axios({
			method: 'get',
			url:`/systems/${system}/ship-listings`,
		})
			.catch(err => { throw new Error(err.response.data.error.message);});
		
		let i = 0;
		for (const listing of res.data.shipListings) {
			if (listing.type === symbol) {
				i++;
				for (const location of listing.purchaseLocations) {
					console.log(location);
					
				}
				break;
			}
		}
		if (i === 0) {
			throw new Error('Ship does not exist');
		}
	
		
	}
	/**
	 * Gets all available ships
	 * @param {String} ship_class - Sort by class (optional)
	 */
	async getAvailableShips(ship_class) {
		if (typeof ship_class === 'undefined') {
			ship_class = null;
		}
		const res = await axios({
			method:'get',
			url:'/types/ships',
			params:{
				'class':ship_class
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });

		console.log(res.data);
	}
	/**
	 * Gets information on given ship
	 * @param {String} shipID - actual id of the ship 
	 */
	async getShipInfo(shipID) {
		const res = await this.axios_client.request({
			method:'GET',
			url:`/my/ships/${shipID}`
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}
	/**
	 * Gets users ships
	 */
	async getShips() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/ships'
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}



	// Loans Requests


	/**
	 * get loans you have taken out
	 */
	async getUserLoans() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/my/loans'
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		
		console.log(res.data);
	}


	/**
	 * Take a loan
	 * @param {string} type - Type of loan to take
	 */
	async takeLoan(type) {
		const res = await this.axios_client.request({
			method:'POST',
			url:'/my/loans',
			params:{
				type:type.toUpperCase()
			},
			paramsSerializer: params => {
				return qs.stringify(params);
			}
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		console.log(res.data);
	}
	/**
	 * get all loans available
	 */
	async getLoans() {
		const res = await this.axios_client.request({
			method:'GET',
			url:'/types/loans'
		})
			.catch(err => { throw new Error(err.response.data.error.message); });

		console.log(res.data);
	}

	/**
	 * 
	 * @param {string} loanID - id of the loan (NOT TYPE)
	 */
	async payLoan(loanID) {
		const res = await this.axios_client.request({
			method:'PUT',
			url:`/my/loans/${loanID}`,
		})
			.catch(err => { throw new Error(err.response.data.error.message); });
		
		console.log(res.data);
	}
	
	
}

module.exports = {
	ApiCom
>>>>>>> 9a4baaf4347cc1bb940faf1445dd608a332fd1e6:apiCom.js
};