// eslint-disable-next-line import/prefer-default-export
export function load({ cookies }) {
  return {
    user: cookies.get('user')
  }
}