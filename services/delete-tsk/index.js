import {getCurrentAuthTokenAtBrowser} from '../../utils'

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

// TODO: handle catch return
export async function deleteTsk({tskId}) {
  const apiToken = getCurrentAuthTokenAtBrowser()

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/tsks/${tskId}`, {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      authorization: `Bearer ${apiToken}`,
    },
    method: 'DELETE',
  })
    .then(r => r.json())
    .catch(e => e)

  if (!res.ok) {
    const {ok, message} = res
    return {ok: Boolean(ok), error: {message}, isReady: true}
  }

  const {ok} = res
  return {ok, isReady: true}
}
