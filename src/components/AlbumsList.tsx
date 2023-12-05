import { AlbumListProps } from '@/utils/interfaceAlbumList';
import styles from '../styles/AudioPlayer.module.scss';
import Image from 'next/image'; // Importa la etiqueta Image
import React from 'react';
import defaultThumbnail from '../data/default-music-image.png';
import { albums } from '@/data/tracks';




export const AlbumsList: React.FC<{ albums: AlbumListProps[] }> = ({ albums }) => {

const [albumList, setAlbumList] = React.useState<AlbumListProps[]>([]);
const [currentAlbumIndex, setCurrentAlbumIndex] = React.useState<number | null>(null);

const handleClickAlbum = (albumIndex: number) => {
  console.log("albumIndex", albumIndex);
  setCurrentAlbumIndex(albumIndex);
  const selectedAlbum = albums[albumIndex];

  if (selectedAlbum.tracks.length > 0) {
    // Obtiene la primera canción del álbum
    const firstTrack = selectedAlbum.tracks[0];
    console.log("firstTrack", firstTrack);

    // Reproduce la primera canción
    // Debes usar tu lógica específica para reproducir canciones aquí
    // Puede ser mediante el uso de un reproductor de audio o una función personalizada.
  }
};
  return (
    <section className={styles.albumsContainer}>
        <section>
            <p>Albums</p>
          {albums.map((album, index) => {
            return (
              <article key={index}>
                <div onClick={() => handleClickAlbum(index)} className={styles.album}>
                  <h3>{album.author}</h3>
                  <h4>{album.album}</h4>
                  <Image
                      src={album.thumbnail ? album.thumbnail : defaultThumbnail}
                      alt={`Thumbnail for ${album.author}`}
                      width={100} // Ajusta el ancho y alto según tus necesidades
                      height={100}
                  />
                </div>
              </article>
            );
          })}
        </section>
    </section>
  );
};