import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {
  Layout,
  UserForm,
  FlashMessage,
  SpacerSmall,
  Subtitle,
} from '../components'
import {setCurrentUserAtBrowser, setCurrentAuthTokenAtBrowser} from '../utils'
import {signInUser} from '../services'

export default function SignIn() {
  const router = useRouter()
  const [reqError, setReqError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)

  async function handleSubmit({email, password}) {
    setIsLoading(true)
    const {ok, data, error, isReady} = await signInUser({email, password})
    setIsLoading(!isReady)

    if (ok) {
      setCurrentUserAtBrowser(data.user)
      setCurrentAuthTokenAtBrowser(data.auth_token)
      return router.push('/tsks')
    }

    setReqError(error.message)
  }

  return (
    <Layout>
      <FlashMessage type='error' message={reqError} />
      <Subtitle value='signin' />
      <UserForm handleSubmit={handleSubmit} isLoading={isLoading} />
      <SpacerSmall />
      <Link href='/signup'>or signup a new account</Link>
    </Layout>
  )
}
