import Image from 'next/image';
import Spotify from './deneme';

export default function Home() {
  interface User {
    aristName: string;
    songName: string;
    songCover: string;
  }

  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]'>
      <script src='https://open.spotify.com/embed/iframe-api/v1' async></script>
      <main className='row-start-2 flex flex-col items-center rounded-2xl bg-spotify_light_gray opacity-100'>
          <Spotify />
      </main>
    </div>
  );
}
