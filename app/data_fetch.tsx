import { useState, useEffect } from 'react';

export async function fetchPlaylistTracks(playlistId: string) {
  try {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        'Missing Spotify Client ID or Secret in environment variables.'
      );
    }

    const tokenResponse = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: 'grant_type=client_credentials',
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Token request failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!playlistResponse.ok) {
      throw new Error(
        `Playlist request failed: ${playlistResponse.statusText}`
      );
    }

    const playlistData = await playlistResponse.json();

    // Debugging: Print the API response structure
    console.log('fetchPlaylistTracks API response:', playlistData);

    // Extract track URIs
    const tracks =
      playlistData?.items
        ?.map((item: any) => item?.track?.uri)
        .filter(Boolean) || [];

    console.log('Extracted track URIs:', tracks); // Log extracted track URIs

    return tracks;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    return [];
  }
}

export default function PlaylistComponent({
  playlistId,
}: {
  playlistId: string;
}) {
  const clientId = '2b8f8232d55e4a8e8fa2a8010337898d';
  const clientSecret = 'b9672855185a45aba8f34f2080eb2731';

  const [songList, setSongList] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const tracks = await fetchPlaylistTracks(playlistId);
      setSongList(tracks);
      if (tracks.length > 0) {
        setCurrentSong(tracks[0]); // Set the first song as the initial song
      }
    }
    fetchData();
  }, [playlistId]);

  return (
    <div>
      <h1>Playlist Tracks</h1>
      <ul>
        {songList.map((track, index) => (
          <li key={index}>{track}</li>
        ))}
      </ul>
      {currentSong && <p>Now Playing: {currentSong}</p>}
    </div>
  );
}
export async function random_song(playlistId: string): Promise<string> {
  try {
    const tracks = await fetchPlaylistTracks(playlistId);

    if (!tracks || tracks.length === 0) {
      console.log(tracks);
      console.error('No tracks found in playlist');
      return '';
    }

    // Get a random track from the list
    const randomIndex = Math.floor(Math.random() * tracks.length);
    const trackUri = tracks[randomIndex];

    // Debugging: Check if trackUri exists
    if (!trackUri) {
      console.error('random_song: trackUri is undefined or null', tracks);
      return '';
    }

    // Ensure trackUri follows expected format
    if (!trackUri.includes('spotify:track:')) {
      console.error('random_song: Unexpected trackUri format', trackUri);
      return '';
    }

    // Extract track ID and construct a valid Spotify URL
    const trackId = trackUri.split(':').pop();
    return `https://open.spotify.com/track/${trackId}`;
  } catch (error) {
    console.error('Error fetching random song:', error);
    return '';
  }
}
