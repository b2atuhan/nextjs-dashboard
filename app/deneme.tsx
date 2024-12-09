'use client';

import { useEffect, useState, useRef } from 'react';

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
  }
}
// Replace with your Client Secret

export default function Spotify() {
  const [songList, setSongList] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<string>('');

  const fetchPlaylistTracks = async (playlistId: string) => {
    const clientId = '2b8f8232d55e4a8e8fa2a8010337898d';
    const clientSecret = 'b9672855185a45aba8f34f2080eb2731';

    try {
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

      // Log the playlist URL for debugging
      console.log(
        `Fetching playlist from URL: https://api.spotify.com/v1/playlists/${playlistId}/tracks`
      );

      // Fetch tracks from the playlist
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
      console.log('Playlist Data:', JSON.stringify(playlistData, null, 2)); // Debugging log

      // Safely extract track URIs
      const tracks =
        playlistData?.items
          ?.map((item: any) => item?.track?.uri)
          .filter(Boolean) || [];

      if (tracks.length === 0) {
        console.warn('No tracks found in playlist.');
      }

      setSongList(tracks);
      if (tracks.length > 0) {
        setCurrentSong(tracks[0]); // Set the first song as the initial song
      }
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
    }
  };

  useEffect(() => {
    fetchPlaylistTracks('3WZaJeRfxz0NtHOXrTaKlI'); 
  }, []);

  const songListRef = useRef<string[]>([]);
  useEffect(() => {
    songListRef.current = songList; // Keep the ref updated with the latest state
  }, [songList]);

  useEffect(() => {
    if (!currentSong) return; // Only run if there's a current song

    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      const element = document.getElementById('embed-iframe');
      if (!element) return;

      const options = {
        width: '600',
        height: '300',
        uri: currentSong, // Use the current song URI
      };

      const callback = (EmbedController: any) => {
        document.querySelector('.episode')?.addEventListener('click', () => {
          const randomIndex = Math.floor(
            Math.random() * songListRef.current.length
          );
          const newSong = songListRef.current[randomIndex];
          setCurrentSong(newSong); // Update the state with the new song
          EmbedController.loadUri(newSong); // Update the player with the new song
          console.log('Selected Song:', newSong);
        });
      };

      IFrameAPI.createController(element, options, callback);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [currentSong]); // Depend on currentSong, only run when it changes

  return (
    <main className='row-start-2 flex flex-col items-center gap-y-6 rounded-2xl bg-spotify_light_gray p-7 opacity-100'>
      <div className='rounded-2xl bg-spotify_green p-4 text-2xl font-extrabold text-black'>
        Random Song
      </div>
      <div id='embed-iframe'></div>
      <div className='episode cursor-pointer rounded-2xl bg-spotify_green p-4 font-extrabold text-black'>
        Click to request a new song
      </div>
    </main>
  );
}
