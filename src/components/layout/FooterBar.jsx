import React from 'react';
import { connect } from 'react-redux';

class FooterBar extends React.Component {

  render() {
    return (
      <div style={{background: "#f0ad4e", display: "flex", justifyContent: "flex-end"}}>
        <strong>Copyright @ </strong>安安运维（北京）科技有限公司 &copy; 2020-2021   - - V1.0.0
      </div>
    );
  }
}

export default connect()(FooterBar);