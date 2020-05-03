import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'
import AlarmHome from './alarm'
import AlarmAddUpdate from './alarm-add-update'
import DetailAlarm from './detail'

export default class Alarm extends Component{
  render(){
    return (
      <Switch>
        <Route exact path="/alarm" component={AlarmHome}/>
        <Route path="/alarm/addupdate" component={AlarmAddUpdate}/>
        <Route path="/alarm/detail" component={DetailAlarm}/>
        <Redirect to="/alarm"/>
      </Switch>
    )
  }
}
