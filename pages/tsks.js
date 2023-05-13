import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {TsksList, Layout} from '../components'
import {getCurrentUserAtBrowser} from '../utils'

export default function Tsks() {
  const router = useRouter()
  const [tsks, setTsks] = useState({})
  const [fallbackMsg, setFallbackMsg] = useState('No tsks found')

  useEffect(() => {
    async function fetchTsks() {
      const user = getCurrentUserAtBrowser()

      if (!user) {
        return router.push('/signin')
      }

      const apiToken = user.auth_token

      try {
        // TODO: move fetching data to a separate service
        await fetch('https://tsks-api.onrender.com/v1/tsks', {
          headers: {
            authorization: `Bearer ${apiToken}`,
            'Access-Control-Allow-Origin': '*',
          },
        })
          .then(res => res.json())
          .then(res => {
            if (!res.ok) {
              return setFallbackMsg(res.msg)
            } else if (res.tsks.length && !res.error) {
              return setTsks(res.tsks)
            }
          })
          .catch(e => setFallbackMsg(e.toString()))
      } catch (e) {
        handleError(e)
      }
    }

    fetchTsks()
  }, [])

  return (
    <Layout>
      {Boolean(Object.keys(tsks).length) ? (
        <TsksList tsks={tsks} />
      ) : (
        <p>{fallbackMsg}</p>
      )}
    </Layout>
  )
}
