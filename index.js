const { ApiCom } = require('./apiCom')

const token = "Bearer 32f01f32-ec1e-4be5-8c7d-1e8e0cc56da1"
const username = "SadLonelyGamer"

let com = new ApiCom(token, username);

com.getStatus()
.then(res => { console.log(`http code: ${ res.status }\nStatus: ${ res.data.status }`) })
.catch(err => { console.log(err) })

com.getAccount()
.then(res => { console.log(`
http Code: ${res.status}
Account:
    [Username] - ${res.data.user.username}
    [Ship Count] - ${res.data.user.shipCount}
    [Structure Count] - ${res.data.user.structureCount}
    [Credits] - ${res.data.user.credits}`) })

.catch(err => { console.log(err) })






