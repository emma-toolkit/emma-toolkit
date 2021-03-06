import React from 'react'
import throttle from 'lodash.throttle'
import config from '../../config.json'
const createClass = React.createClass;

export default createClass({
  getInitialState() {
    return {x: null, y: null};
  },
  componentDidUpdate() {
    if (!this.props.connecting && window.onmousemove !== null) return;
    const box = this.refs.div.getBoundingClientRect();
    const onMouseMove = this.props.connecting && !this.props.in_handle ?
      throttle(e => {
        if (e.target.className !== 'handle') {
          this.setState({
            x: e.pageX - box.left,
            y: e.pageY - box.top
          });
        }
      }) :
      null;
    window.onmousemove = onMouseMove;
  },
  handleMouseDown() {
    this.setState({
      x: this.props.out_handle.x,
      y: this.props.out_handle.y
    });
    this.props.startConnecting();
  },
  getEndPos() {
    return this.props.in_handle || this.state;
  },
  getOutHandle() {
    return !this.props.out_handle ? null : (
      <div
        className='handle'
        onMouseDown={this.handleMouseDown}
        style={{
          top: this.props.out_handle.y,
          left: this.props.out_handle.x
        }}
      />
    );
  },
  getInHandle() {
    return !this.props.in_handle ? null : (
      <div
        className='handle'
        style={{
          top: this.props.in_handle.y,
          left: this.props.in_handle.x
        }}
      />
    );
  },
  getLine() {
    const end_pos = this.getEndPos();
    return !this.props.connecting ? null : (
      <svg id='edge-line'>
        <line
          x1={this.props.out_handle.x}
          y1={this.props.out_handle.y}
          x2={end_pos.x}
          y2={end_pos.y}
        />
      </svg>
    );
  },
  render() {
    return (
      <div className='overlay' ref='div'>
        {this.getOutHandle()}
        {this.getInHandle()}
        {this.getLine()}
      </div>
    );
  }
});
