import engaña from './gustavo cerati- bocanada/02 Engaña.mp3';
import bocanada from './gustavo cerati- bocanada/03 Bocanada.mp3';
import selfoss from './Gus Gus - 2011 - Arabian Horse/01 - GusGus - Selfoss.mp3';
import beWithMe from './Gus Gus - 2011 - Arabian Horse/02 - GusGus - Be With Me.mp3';

// audio thumbnails
import bocanadaImage from './bocanada.jpg';

export const albums = [
  {
    album: 'Bocanada',
    author: 'Gustavo Cerati',
    thumbnail: bocanadaImage,
    tracks: [
      {
        album: 'Bocanada',
        title: 'Engaña',
        src: engaña,
      },
      {
        album: 'Bocanada',
        title: 'Bocanada',
        src: bocanada,
      },
      // Agrega más canciones de este álbum aquí
    ],
  },
  {
    album: 'Arabian Horse',
    author: 'Gus Gus',
    thumbnail: '', // Puedes cambiar la miniatura si es diferente para este álbum
    tracks: [
      {
        album: 'Arabian Horse',
        title: 'Selfoss',
        src: selfoss,
      },
      {
        album: 'Arabian Horse',
        title: 'Be With Me',
        src: beWithMe,
      },
      // Agrega más canciones de este álbum aquí
    ],
  },
  // Agrega más álbumes o artistas según sea necesario
];