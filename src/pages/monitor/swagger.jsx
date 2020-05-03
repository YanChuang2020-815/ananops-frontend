import React,{Component} from 'react'

export default class Swagger extends Component{
  render(){
    return (
      <div style={{height:'100%'}}>
        <iframe title="swagger" src="http://www.ananops.com:29995/swagger-ui.html"  width="100%" height="100%"></iframe>
      </div>
    )
  }
}