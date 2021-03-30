import { GENRES } from '../../constants'

// Object of (genre, null) pairs for quick lookup
const GENRES_DICT = {}
for (const genre of GENRES) {
  GENRES_DICT[genre] = null
}

export function validatePlaylistSettings({
  playlistName,
  genres: genresString,
  maxDuration,
}) {
  if (playlistName === '' || maxDuration === '') {
    return false
  }

  if (parseInt(maxDuration) <= 0) {
    return false
  }

  const genres = genresString.split(',')

  if (genresString !== '') {
    if (genres.some((genre) => genre === '')) {
      return false
    }

    if (genres.some((genre) => !(genre in GENRES_DICT))) {
      return false
    }
  }

  return true
}
