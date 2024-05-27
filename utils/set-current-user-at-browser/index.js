const {NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY} = process.env

export function setCurrentUserAtBrowser(user) {
  window.localStorage.setItem(
    NEXT_PUBLIC_USER_LOCAL_STORAGE_KEY,
    JSON.stringify(user)
  )
}
