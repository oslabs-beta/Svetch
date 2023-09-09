// eslint-disable-next-line import/prefer-default-export
export function load({ cookies }) {
  return {
    state: cookies.get('state')
  }
}