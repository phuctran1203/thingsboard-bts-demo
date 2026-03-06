// export function randomNumber(min: number = 0, max: number = 1) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
export function randomDecimal(
  min: number = 0,
  max: number = 0.01,
  fixed: number = 2,
) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(fixed));
}
