import React, { Component } from 'react';
import { Track } from '../Track/Track';

import './TrackList.css';



export class TrackList extends Component {
  render() {

    const tracks = this.props.tracks;

    return (
      <div className="TrackList">
          {tracks.map( (track) => {
            return (
              <Track
                key={track.id}
                track={track}
                isRemoval={this.props.isRemoval}
                onAdd={this.props.onAdd}
                onRemove={this.props.onRemove}/>
            );
          })}
      </div>
    )
  }
}
