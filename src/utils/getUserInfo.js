import axios from 'axios'
const getUserInfo={
  getUserInfo(){
    const username=window.localStorage.getItem('loginName')
    const token=window.localStorage.getItem('token')
    axios({
      method: 'POST',
      url: '/uac/user/queryUserInfo/'+username,
      headers: {
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+token,
      },
    })
      .then((res) => {
        if(res && res.status === 200){
          console.log(res.data.result)

          window.localStorage.setItem('role',res.data.result.roles.roleName)
          window.localStorage.setItem('roleCode',res.data.result.roles.roleCode)
          window.localStorage.setItem('id',res.data.result.id)
          console.log(this.state.data)
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
export default getUserInfo