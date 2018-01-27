export default {
  plus: () => ({count}) => ({count: count + 1}),
  minus: () => ({count}) => ({count: count - 1})
}
