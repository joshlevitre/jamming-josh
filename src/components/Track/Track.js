import React, { Component } from 'react';

import './Track.css';

export class Track extends Component {
  constructor(props) {
    super(props)

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction(isRemoval) {
    return(
      isRemoval ?
        <a className="Track-action" onClick={this.removeTrack}>-</a> :
        <a className="Track-action" onClick={this.addTrack}>+</a>
    )
  }

  addTrack(){
    this.props.onAdd(this.props.track);
  }

  removeTrack(){
    this.props.onRemove(this.props.track.id);
  }

  render() {

    const track = this.props.track;

    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{track.name}</h3>
          <p>{track.artist} | {track.album}</p>
        </div>
        {this.renderAction(this.props.isRemoval)}
      </div>
    )
  }
}
