import React,{Component} from 'react'

export default class Kibana extends Component{
  render(){
    return (
      <div style={{height:'100%'}}>
        <iframe title="kibana" src="https://www.ananops.com/elk/"  width="100%" height="100%"></iframe>
      </div>
    )
  }
}