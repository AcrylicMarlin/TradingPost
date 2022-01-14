const axios = require('axios').default

    /*
    Class to create a communications object to interact with the SpaceTraders API

    params:
    token {String} - SpaceTraders API Token
    username {String} - Spacetraders API Username
    */
class ApiCom {

    constructor(token, username) {
        this._token = token;
        this._username = username;
        this._base_url = "http://api.spacetraders.io"
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

    async getStatus() {
        const res = await axios.get(`${this._base_url}/game/status`)
        .then(res => {
            return res
        })
        .catch(err => {
            console.log(err)
        })
        return res
    }
    async getAccount() {
        const res = await axios.post(`${this._base_url}/my/account`, {}, {
            headers:{
                "Authorization":this._token
            }
        })
        .then(res => {
            return res
        })
        .catch(err => { return console.log(err) })
        return res
    }
    async getShips() {
        const res = await axios.post()
    }
}

module.exports = {
    ApiCom
}