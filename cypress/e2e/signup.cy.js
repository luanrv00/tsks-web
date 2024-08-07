import userFixture from '../fixtures/user.json'
import postSignupFixture from '../fixtures/api-post-signup.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY || '@tsks-user'

const NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY || '@tsks-auth-token'

describe('signup', () => {
  context('cannot without email', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('required').should('exist')
    })
  })

  context('cannot without password', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type('unregistered@mail.com')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('required').should('exist')
    })
  })

  context('cannot without valid email', () => {
    beforeEach(() => {
      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type('invalid email')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('invalid email').should('exist')
    })
  })

  context('cannot without unregistered email', () => {
    beforeEach(() => {
      cy.intercept(postSignupFixture.method, postSignupFixture.endpoint, {
        fixture: 'api-response-user-409',
      })

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type('unregistered@mail.com')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('409 Conflict').should('exist')
    })
  })

  context('when signing up', () => {
    beforeEach(() => {
      cy.intercept(
        postSignupFixture.method,
        postSignupFixture.endpoint,
        () => new Promise(res => setTimeout(res({json: () => {}}), 4000))
      ).as('signup')

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type('unregistered@mail.com')
      cy.get('input[placeholder="******"]').type('123')
    })

    it('renders loading button', () => {
      cy.get('button').click()
      cy.get('button').should('have.class', 'loading')
    })

    it('calls signup api', () => {
      cy.get('button').click()
      cy.wait('@signup')
    })
  })

  context('when signing up fails', () => {
    beforeEach(() => {
      cy.intercept(postSignupFixture.method, postSignupFixture.endpoint, {
        forceNetworkError: true,
      })

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type('unregistered@mail.com')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('Failed to fetch').should('exist')
    })

    it('not renders loading button', () => {
      cy.get('button').should('not.have.class', 'loading')
    })
  })

  context('signup succesfully', () => {
    beforeEach(() => {
      cy.intercept(postSignupFixture.method, postSignupFixture.endpoint, {
        fixture: 'api-response-user-201',
      })

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type(userFixture.email)
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    afterEach(() => {
      cy.removeLocalStorageUser()
      cy.removeLocalStorageAuthToken()
    })

    it('saves user on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageUser = JSON.parse(
          window.localStorage.getItem(NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY)
        )

        expect(localStorageUser).to.deep.eq(userFixture)
      })
    })

    it('saves auth token on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageAuthToken = window.localStorage.getItem(
          NEXT_PUBLIC_AUTH_TOKEN_LOCAL_STORAGE_KEY
        )
        expect(localStorageAuthToken).to.exist
      })
    })

    it('redirects to tsks', () => {
      cy.location('pathname').should('eq', '/tsks')
    })
  })

  describe('renders a link to signin', () => {
    beforeEach(() => {
      cy.visit('/signup')
    })

    it('renders a link to signin', () => {
      cy.contains('or signin to your account').should('exist')
    })

    it('redirects to signin when clicking', () => {
      cy.location('pathname').should('eq', '/signup')
      cy.contains('or signin to your account').click()
      cy.location('pathname').should('eq', '/signin')
    })
  })
})
