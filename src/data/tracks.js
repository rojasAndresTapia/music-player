// Audio file paths (now served from public directory)
const audioBasePath = '/audio';

// Gustavo Cerati - Bocanada tracks
const engaña = `${audioBasePath}/gustavo cerati- bocanada/02 Engaña.mp3`;
const bocanada = `${audioBasePath}/gustavo cerati- bocanada/03 Bocanada.mp3`;
const puente = `${audioBasePath}/gustavo cerati- bocanada/04 Puente.mp3`;
const rioBabel = `${audioBasePath}/gustavo cerati- bocanada/05 Río Babel.mp3`;
const beautiful = `${audioBasePath}/gustavo cerati- bocanada/06 Beautiful.mp3`;
const perdonarEsDivino = `${audioBasePath}/gustavo cerati- bocanada/07 Perdonar es divino.mp3`;
const verboCarne = `${audioBasePath}/gustavo cerati- bocanada/08 Verbo Carne.mp3`;
const raiz = `${audioBasePath}/gustavo cerati- bocanada/09 Raíz.mp3`;
const ysiElHumo = `${audioBasePath}/gustavo cerati- bocanada/10 Y si el humo está en el foco.mp3`;
const paseoInmoral = `${audioBasePath}/gustavo cerati- bocanada/11 Paseo Inmoral.mp3`;
const aquiAhora = `${audioBasePath}/gustavo cerati- bocanada/12 Aquí & ahora (Los primeros 3 minutos).mp3`;
const alma = `${audioBasePath}/gustavo cerati- bocanada/14 Alma.mp3`;
const balsa = `${audioBasePath}/gustavo cerati- bocanada/15 Balsa.mp3`;

// Gus Gus - Arabian Horse tracks
const selfoss = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/01 - GusGus - Selfoss.mp3`;
const beWithMe = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/02 - GusGus - Be With Me.mp3`;
const deepInside = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/03 - GusGus - Deep Inside.mp3`;
const over = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/04 - GusGus - Over.mp3`;
const withinYou = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/05 - GusGus - Within You.mp3`;
const arabianHorse = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/06 - GusGus - Arabian Horse.mp3`;
const magnifiedLove = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/07 - GusGus - Magnified Love.mp3`;
const changesCome = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/08 - GusGus - Changes Come.mp3`;
const whenYourLoversGone = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/09 - GusGus - WhenYourLover's Gone.mp3`;
const benched = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/10 - GusGus - Benched.mp3`;

// audio thumbnails (now served from public directory)
const bocanadaImage = `${audioBasePath}/gustavo cerati- bocanada/bocanada.jpg`;
const arabianHorseImage = `${audioBasePath}/Gus Gus - 2011 - Arabian Horse/folder.jpg`;

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
      {
        album: 'Bocanada',
        title: 'Puente',
        src: puente,
      },
      {
        album: 'Bocanada',
        title: 'Río Babel',
        src: rioBabel,
      },
      {
        album: 'Bocanada',
        title: 'Beautiful',
        src: beautiful,
      },
      {
        album: 'Bocanada',
        title: 'Perdonar es divino',
        src: perdonarEsDivino,
      },
      {
        album: 'Bocanada',
        title: 'Verbo Carne',
        src: verboCarne,
      },
      {
        album: 'Bocanada',
        title: 'Raíz',
        src: raiz,
      },
      {
        album: 'Bocanada',
        title: 'Y si el humo está en el foco',
        src: ysiElHumo,
      },
      {
        album: 'Bocanada',
        title: 'Paseo Inmoral',
        src: paseoInmoral,
      },
      {
        album: 'Bocanada',
        title: 'Aquí & ahora (Los primeros 3 minutos)',
        src: aquiAhora,
      },
      {
        album: 'Bocanada',
        title: 'Alma',
        src: alma,
      },
      {
        album: 'Bocanada',
        title: 'Balsa',
        src: balsa,
      },
    ],
  },
  {
    album: 'Arabian Horse',
    author: 'Gus Gus',
    thumbnail: arabianHorseImage,
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
      {
        album: 'Arabian Horse',
        title: 'Deep Inside',
        src: deepInside,
      },
      {
        album: 'Arabian Horse',
        title: 'Over',
        src: over,
      },
      {
        album: 'Arabian Horse',
        title: 'Within You',
        src: withinYou,
      },
      {
        album: 'Arabian Horse',
        title: 'Arabian Horse',
        src: arabianHorse,
      },
      {
        album: 'Arabian Horse',
        title: 'Magnified Love',
        src: magnifiedLove,
      },
      {
        album: 'Arabian Horse',
        title: 'Changes Come',
        src: changesCome,
      },
      {
        album: 'Arabian Horse',
        title: 'When Your Lover\'s Gone',
        src: whenYourLoversGone,
      },
      {
        album: 'Arabian Horse',
        title: 'Benched',
        src: benched,
      },
    ],
  },
  // Agrega más álbumes o artistas según sea necesario
];