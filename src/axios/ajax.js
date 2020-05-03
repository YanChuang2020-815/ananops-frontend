import axios from 'axios'
import {message} from 'antd'

export default function ajax(url,data={},type='POST'){
  return new Promise((resolve) => {
    let promise
    
    if(type==='POST'){
      promise = axios.post(url,data,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Bearer '+ window.localStorage.getItem('access_token')
        },
      })
    }else if(type==='GET'){
      promise = axios.get(url,{
        params:data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization':'Bearer '+ window.localStorage.getItem('access_token')
        },
      })
    }
   
      
    promise.then(response => {
      resolve(response.data)

    }).catch(error => {
      message.error('请求出错了',error.message)
    })
    
  }) 
}