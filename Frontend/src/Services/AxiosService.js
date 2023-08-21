import axios from 'axios'

console.log("axios service", this)


// const endpoint = "192.168.1.54:3000"
// const endpoint = "http://localhost:3000"
const endpoint = "https://api.collabroflow.com"

let headers = {
    Authorization:''
}
const updateAuthHeaders = (token)=>{ // User better way to load this (from localStorage)
    console.log("here?", token)
    headers.Authorization = `${token}`;
    console.log("header updated", headers);
}

const post = (url, req)=>{
    return new Promise((resolve, reject)=>{
        axios.post(`${endpoint}${url}`, req, {headers})
        .then( res=>{
            // console.log("res", res)
            resolve(res.data);
        })
        .catch(error=>{
            resolve({ error: 'Invlid Token' })
        })
    })
}

const get = (url)=>{
    // console.log("headers", headers);
    return new Promise((resolve, reject)=>{
        axios.get(`${endpoint}${url}`, {headers})
        .then( res=>{
            // console.log("axios get", res);
            resolve(res.data);
        })
        .catch(error=>{
            resolve({ error: 'Invlid Token' });
        })
    })
}

const upload = (url, file)=> {
    console.log("video upload");
    // console.log("axios url", url);

    const config = {
        onUploadProgress: function(progressEvent) {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            
        },        
    }

    let data = new FormData()
    data.append('file', file)

    axios.put(url, data, config)
        .then(res => {
            console.log('axios res', res)
        })
        .catch(err => {
            console.log('axios err', err)           
        })
};

export default {
    post,
    get,
    upload,
    updateAuthHeaders
}