import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'

import { GENRES } from '../../constants'

import './GenresInput.scss'

const NO_MATCHES_EXIST = '[No matching genres]'

function GenresInput({ playlistGenres, setPlaylistGenres }) {
  const [value, setValue] = useState('')
  const [previousValue, setPreviousValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [noMatches, setNoMatches] = useState(false)

  const getSuggestions = (value) => {
    if (value === null) {
      return []
    }

    const splitInputGenre = value.split(',')
    const inputGenre = splitInputGenre[splitInputGenre.length - 1]
      .trim()
      .toLowerCase()
    const inputLength = inputGenre.length
    if (inputLength === 0) {
      setNoMatches(false)
      return []
    } else {
      const filteredGenres = GENRES.filter(
        (genre) => genre.toLowerCase().slice(0, inputLength) === inputGenre,
      )

      if (filteredGenres.length === 0) {
        setNoMatches(true)
        return []
      } else if (
        filteredGenres.length === 1 &&
        filteredGenres[0] === inputGenre
      ) {
        setNoMatches(false)
        return []
      } else {
        setNoMatches(false)
        return filteredGenres
      }
    }
  }

  const onChange = (event, { newValue }) => {
    setPreviousValue(value)
    setValue(newValue)
    setPlaylistGenres(newValue)
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value))
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const getSuggestionValue = (suggestion) => suggestion

  const renderSuggestion = (suggestion) =>
    suggestion === NO_MATCHES_EXIST ? (
      <div className="noMatches">{NO_MATCHES_EXIST}</div>
    ) : (
      <div>{suggestion}</div>
    )

  const onSuggestionSelected = (event, { suggestion }) => {
    const previousValueList = previousValue.split(',')
    const previousValueListLength = previousValueList.length - 1
    const newValue =
      previousValueListLength === 0
        ? suggestion
        : `${previousValueList
            .slice(0, previousValueList.length - 1)
            .join(',')},${suggestion}`
    setPreviousValue(value)
    setValue(newValue)
    setPlaylistGenres(newValue)
  }

  const inputProps = {
    value: playlistGenres,
    onChange,
    className: 'inputField',
    placeholder: 'genres (default: all)',
    spellcheck: 'false',
  }

  return (
    <>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        alwaysRenderSuggestions={true}
        focusInputOnSuggestionClick={true}
      />
      {noMatches && <div className="noMatches">{NO_MATCHES_EXIST}</div>}
    </>
  )
}

GenresInput.propTypes = {
  playlistGenres: PropTypes.any,
  setPlaylistGenres: PropTypes.func,
}

export default GenresInput
