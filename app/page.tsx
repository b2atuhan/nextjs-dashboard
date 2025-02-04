'use client';
import { Spotify } from 'react-spotify-embed';
import { useEffect, useState } from 'react';
import playlistFetch from './data_fetch';
import { fetchPlaylistTracks, random_song } from './data_fetch';

export default function Home() {
  const [songLink, setSongLink] = useState<string>('');

  async function fetchRandomSong() {
    const song = await random_song('3WZaJeRfxz0NtHOXrTaKlI');
    setSongLink(song); // Update state with the new song URL
  }

  // Fetch a song when the component loads
  useEffect(() => {
    fetchRandomSong();
  }, []);

  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]'>
      <script src='https://open.spotify.com/embed/iframe-api/v1' async></script>
      <main className='row-start-2 flex flex-col items-center rounded-2xl opacity-100'>
        {songLink ? (
          <>
            <Spotify link={songLink} />
            <button
              onClick={fetchRandomSong}
              className='mt-4 rounded-lg bg-green-500 px-6 py-2 font-semibold text-white shadow-md transition hover:bg-green-600'
            >
              New Random Song 🎵
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}{' '}
      </main>
    </div>
  );
}
