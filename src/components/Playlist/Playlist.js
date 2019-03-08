import React, { Component } from 'react';
import { TrackList } from '../TrackList/TrackList';
import './Playlist.css';

export class Playlist extends Component {
  constructor(props) {
    super(props)

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleNameChange(e) {
    this.props.updatePlaylistName(e.target.value)
  }

  handleClick() {
    this.props.savePlaylist()
  }

  render() {
    return (
      <div className="Playlist">
        <input
          defaultValue={'New Playlist'}
          onChange={this.handleNameChange} />
        <TrackList
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove}
          isRemoval={true} />
        <a
          className="Playlist-save"
          onClick={this.handleClick}
        >SAVE TO SPOTIFY</a>
      </div>
    )
  }
}
