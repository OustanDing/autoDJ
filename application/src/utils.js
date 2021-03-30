export function msToMinString(ms) {
  const mins = msToMin(ms)
  return `${mins} mins`
}

export function msToMin(ms) {
  return Math.ceil(ms / 60000)
}

export function minToMs(mins) {
  return mins * 60000
}
