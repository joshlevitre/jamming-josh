import React, { Component } from 'react';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.search = this.search.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylistToSpotify = this.savePlaylistToSpotify.bind(this);
  }

  async search(term) {
    const results = await Spotify.getSearchResults(term);
    this.setState({searchResults: results});
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } this.setState({playlistTracks: [...this.state.playlistTracks, track]});
  }

  removeTrack(trackId) {
    this.setState({playlistTracks: this.state.playlistTracks.filter( track => trackId !== track.id)});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  async savePlaylistToSpotify() {
    const trackURIs = this.state.playlistTracks.map( track => track.uri );

    Spotify.addTracksToPlaylist(
      await Spotify.createPlaylist(
        await Spotify.getUserId(),
        this.state.playlistName
      ),
      trackURIs
    );
  }

  componentDidMount() {
    Spotify.getAccessToken();
  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mm</span>ing Josh</h1>
        <div className="App">
          <SearchBar
              onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}/>
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              updatePlaylistName={this.updatePlaylistName}
              savePlaylist={this.savePlaylistToSpotify}/>
          </div>
        </div>
      </div>
    )
  }
}
