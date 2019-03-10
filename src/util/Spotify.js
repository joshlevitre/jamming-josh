const clientId = '2911a516106f436ca6ade41a5a01e972';
let accessToken = '';
let expiresIn = '';

const authURL = 'https://accounts.spotify.com/authorize';
const apiEndpoint = 'https://api.spotify.com/v1/';
// const redirectURI = 'http://localhost:3000'; // Uncomment for dev
const redirectURI = 'https://jamming-josh.herokuapp.com'; // Uncomment for prod
const scopes = 'playlist-modify-private';
const queryParams = `?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scopes}&response_type=token`;
const authEndpoint = `${authURL}${queryParams}`;

const Spotify = {

  getAccessToken: () => {
    if (accessToken) {
      return;  // Return if access token already set
  } else if (window.location.href !== `${redirectURI}/`) { // If the url is not our main app url, try to parse for the access token or error in url
      if (window.location.href.match(/access_token=([^&]*)/)) {
        accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
        expiresIn = Number(window.location.href.match(/expires_in=([^&]*)/)[1]);
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return;
      } else if (window.location.href.match(/error=([^&]*)/)) {
        console.log('Spotify returned error: ' + window.location.href.match(/error=([^&]*)/)[1]);
        return;
      } else {
        window.location = redirectURI; // this will probably trigger if they're not using https
      }
    } else {window.location = authEndpoint;} // Redirect to Spotify to get access token
  },

  getSearchResults: async (term) => {
    const trackQuery = term.replace(/\s/g, '%20'); // converts spaces to '%20'
    const searchEndpoint = `${apiEndpoint}search?q=${trackQuery}&type=track`;

    try {
      const response = await fetch(searchEndpoint, {
        headers: {Authorization: `Bearer ${accessToken}`}
      })
      if (response.ok) {
        const jsonResponse = await response.json();
        // Maps over response to return an array with the data we need
        const tracks = jsonResponse.tracks.items.map( track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          };
        });
        return tracks
      }
    } catch(error) {console.log(error)};
  },

  getUserId: async () => {
    const userEndpoint = `${apiEndpoint}me`;
    const headers = { headers: {Authorization: `Bearer ${accessToken}`} };

    try {
      const response = await fetch(userEndpoint, headers)
      if (response.ok) {
        const jsonResponse = await response.json();
        const userId = jsonResponse.id;
        return userId;
      }
    } catch(error) {console.log(error)};
  },

  createPlaylist: async (userId, playlistName) => {
    const playlistEndpoint = `${apiEndpoint}users/${userId}/playlists`;
    const data = JSON.stringify({
      name: playlistName,
      public: false
    });
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json'
    };

    try {
      const response = await fetch(playlistEndpoint, {
        method: 'POST',
        body: data,
        headers: headers
      })
      if (response.ok) {
        const jsonResponse = await response.json();
        const playlistId = jsonResponse.id;
        return playlistId;
      }
    } catch(error) {console.log(error)};
  },

  addTracksToPlaylist: async (playlistId, uris) => {
    const playlistEndpoint = `${apiEndpoint}playlists/${playlistId}/tracks`;
    const data = JSON.stringify({uris: uris});
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json'
    };

    try {
      const response = await fetch(playlistEndpoint, {
        method: 'POST',
        body: data,
        headers: headers
      })
      if (response.ok) {
        // const jsonResponse = await response.json(); // I might want to do something with this later
        return;
      }
    } catch(error) {console.log(error)};


  }

};

export default Spotify;
