import React from 'react'
import { Autocomplete } from '@material-ui/lab'
import { TextField, Chip } from '@material-ui/core'

import { GENRES } from '../../constants'

import './GenresInput.scss'

function GenresInput() {
  const renderTags = (value, getTagProps) =>
    value.map((option, index) => (
      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
    ))

  const renderInput = (additionalProps) => (
    <TextField
      className="inputField textField"
      id="standard-basic"
      placeholder="genres"
      classes={
        {
          // root: 'textField',
        }
      }
      inputProps={{
        underline: {
          '&&&:before': {
            borderBottom: 'none',
          },
          '&&&:after': {
            borderBottom: 'none',
            visibility: 'hidden',
          },
        },
      }}
      {...additionalProps}
    />
  )

  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={GENRES}
      getOptionLabel={(option) => option}
      renderTags={renderTags}
      renderInput={renderInput}
      classes={
        {
          // root: 'inputField',
          // inputRoot: 'inputField',
        }
      }
    />
  )
}

export default GenresInput
