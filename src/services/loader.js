import React, { Component } from "react";
import '../services/loaderCss.css';

export default class Loader extends Component {
  render() {
    return (
      <div className="background">
      <div className="wrapper">
        <div className="ball-scale-multiple">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
    )
  }
}

