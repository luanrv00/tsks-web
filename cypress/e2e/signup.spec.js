import user from '../fixtures/user.json'

// TODO: fix env var not being loaded
const NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY =
  process.env.NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY || '@tsks-user'

describe('SignUp', () => {
  context('cannot without email', () => {
    beforeEach(() => {
      const testApiPostRequest = {
        method: 'POST',
        endpoint: '**/v1/signup',
      }

      const testApiPostResponse = {
        statusCode: 400,
        body: {
          ok: false,
          message: '400 Bad Request',
        },
      }

      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })

  context('cannot without password', () => {
    beforeEach(() => {
      const testApiPostRequest = {
        method: 'POST',
        endpoint: '**/v1/signup',
      }

      const testApiPostResponse = {
        statusCode: 400,
        body: {
          ok: false,
          message: '400 Bad Request',
        },
      }

      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })

  context('cannot without valid email', () => {
    beforeEach(() => {
      const testApiPostRequest = {
        method: 'POST',
        endpoint: '**/v1/signup',
      }

      const testApiPostResponse = {
        statusCode: 400,
        body: {
          ok: false,
          message: '400 Bad Request',
        },
      }

      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type('invalid email')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('400 Bad Request').should('exist')
    })
  })

  context('cannot without unregistered email', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signup',
    }

    const testApiPostResponse = {
      statusCode: 409,
      body: {
        ok: false,
        message: '409 Conflict',
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('renders error message', () => {
      cy.contains('409 Conflict').should('exist')
    })
  })

  context('signup succesfully', () => {
    const testApiPostRequest = {
      method: 'POST',
      endpoint: '**/v1/signup',
    }

    const testApiPostResponse = {
      statusCode: 201,
      body: {
        ok: true,
        user,
      },
    }

    beforeEach(() => {
      cy.intercept(
        testApiPostRequest.method,
        testApiPostRequest.endpoint,
        testApiPostResponse
      )

      cy.visit('/signup')
      cy.get('input[placeholder="user@tsks.app"]').type(user.email)
      cy.get('input[placeholder="******"]').type('123')
      cy.get('button').click()
    })

    it('redirects to tsks', () => {
      cy.location('pathname').should('eq', '/tsks')
    })

    it('saves user on localStorage', () => {
      cy.wait(2000)
      cy.window().then(window => {
        const localStorageUser = JSON.parse(
          window.localStorage.getItem(NEXT_PUBLIC_TSKS_LOCAL_STORAGE_KEY)
        )

        expect(localStorageUser).to.deep.eq(user)
      })
    })
  })
})
