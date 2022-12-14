export const MIN_TIMESTAMP = new Date(0);
export const MAX_TIMESTAMP = new Date(8640000000000000)
export const dayDiff = (to, from) => (to - from) / (1000 * 60 * 60 * 24);
export const daysTil = (to) => dayDiff(to, new Date())
export const cmpDateAsc = (left, right) => left <= right ? -1 : 1
export const getTaskDate = (task) => {
  const dates = [task.scheduled, task.start, task.due].filter(Boolean)
  if (dates.length > 0) {
    dates.sort(cmpDateAsc)
    return dates[0]
  } else {
    return MAX_TIMESTAMP;
  }
}