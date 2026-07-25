import { useEffect, useMemo, useReducer } from 'react'
import * as api from '../lib/api'
import { AuthContext } from './auth-context'

const initialState = {
  user: null,
  status: api.getTokens()?.accessToken ? 'loading' : 'guest',
  error: '',
}

function authReducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, status: 'loading', error: '' }
    case 'authenticated':
      return { user: action.user, status: 'authenticated', error: '' }
    case 'guest':
      return { user: null, status: 'guest', error: action.error || '' }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    let mounted = true
    if (!api.getTokens()?.accessToken) return undefined

    api
      .getCurrentUser()
      .then((data) => mounted && dispatch({ type: 'authenticated', user: data.user }))
      .catch(() => {
        api.clearTokens()
        if (mounted) dispatch({ type: 'guest' })
      })

    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: state.status === 'authenticated',
      async login(credentials) {
        dispatch({ type: 'loading' })
        try {
          const data = await api.login(credentials)
          dispatch({ type: 'authenticated', user: data.user })
          return data
        } catch (error) {
          dispatch({ type: 'guest', error: error.message })
          throw error
        }
      },
      async register(payload) {
        dispatch({ type: 'loading' })
        try {
          const data = await api.register(payload)
          dispatch({ type: 'guest' })
          return data
        } catch (error) {
          dispatch({ type: 'guest', error: error.message })
          throw error
        }
      },
      async logout() {
        await api.logout()
        dispatch({ type: 'guest' })
      },
    }),
    [state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
