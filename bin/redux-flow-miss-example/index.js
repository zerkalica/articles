// @flow

import React from 'react'
import { renderToString } from 'react-dom/server'
import { combineReducers, createStore } from 'redux'
import { connect, Provider } from 'react-redux'

// user data
interface UserState {
  name: string;
}

const userInitState: UserState = {
  name: 'User 1'
}

function user(state?: UserState = userInitState, action: Object): UserState {
  return state
}

// component

interface AppProps {
  title: string;
}

interface AppContext {
  userName: string;
}

function AppView({title, userName}: AppProps & AppContext) {
  return <div>title: {title}, name: {userName}</div>
}

// state is all app state
function mapStateToProps(state: {user: UserState}): AppContext {
  return { userName:  state.user.name }
}

const AppContainer = connect(mapStateToProps)(AppView)

// main

// reducer not type checked
const reducer = combineReducers({
  userBad: user
})

const store = createStore(reducer)

// store in Provider is not type checked
console.log(renderToString(
  <Provider store={null /* store */}>
    <AppContainer title="title" />
  </Provider>
))
