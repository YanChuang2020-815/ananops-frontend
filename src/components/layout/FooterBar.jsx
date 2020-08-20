import React from 'react';
import { connect } from 'react-redux';

class FooterBar extends React.Component {

  render() {
    return (
      <div style={{background: "#f0ad4e", display: "flex", justifyContent: "flex-end"}}>
        <strong>Copyright @ </strong>火眼金睛——智慧安防系统 &copy;
      </div>
    );
  }
}

export default connect()(FooterBar);