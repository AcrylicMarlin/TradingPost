const axios = require('axios').default;

async function getLocations() {
    const res = axios.get('https://api.spacetraders.io/locations', {
    headers:{
        "Authorization":"Bearer 32f01f32-ec1e-4be5-8c7d-1e8e0cc56da1"
        }
    })
    .then(res => { return res })
    .catch(err => { throw err });
    return res
}
getLocations().then(res => { console.log(res.data.toJSON()) }).catch(err => { throw err });