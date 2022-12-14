export const cmpPriorityAsc = (left, right) => left >= right ? -1 : 1;
export const getTaskPriority = (task) => {
  const { text } = task;
  if (text.indexOf('⏫') > 0) return 2;
  if (text.indexOf('🔼') > 0) return 1
  if (text.indexOf('🔽') > 0) return -1;
  return 0;
}