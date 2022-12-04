export const styles = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => acc + `${key}: ${value};`, '')
}