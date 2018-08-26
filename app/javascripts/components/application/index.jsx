import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import ReduxToastr, { reducer as toastr } from 'react-redux-toastr'

import { addTokenAction, updateTokenAction, bountyActivatedAction, submissionAcceptedAction } from '@/redux/actions'
import { tokens } from '@/redux/reducers'

import bountiesSapphire from '@/contracts/bountiesSapphireFactory'

import web3Wrap from '@/components/web3Wrap'

import Header from './layout/header'
import Footer from './layout/footer'
import Landing from './landing'
import NotFoundPage from './not-found'
import Bounty from './bounty'

import CreateBounty from './create-bounty'
import AllBounties from './all-bounties'
import MyBounties from './my-bounties'

// Add more reducers to this object:
const rootReducer = combineReducers({
  toastr: toastr
})

const store = createStore(
  rootReducer,
  typeof window !== undefined
    && window.__REDUX_DEVTOOLS_EXTENSION__
    && window.__REDUX_DEVTOOLS_EXTENSION__()
)

//
// This component demos replaying the events from the blockchain network
// to pull all data associated with the current wallet address into a
// redux store, as well as subscribing to the event and adding new
// tokens to the store
//
export class Application extends Component {

  constructor (props) {
    super(props)
    this.state = {
      web3: null
    }

    this.web3NewBounty = web3Wrap(CreateBounty)
    this.web3MyBounties = web3Wrap(MyBounties)
    this.web3AllBounties = web3Wrap(AllBounties)
  }

  componentDidMount() {
    if (window.web3 !== undefined) {
      this.getBountiesAndSubscribeToEvent();
    }
  }

  componentWillUnmount () {
    if (this.BountyActivatedEvent) {
      this.BountyActivatedEvent.stopWatching()
      this.SubmissionAcceptedEvent.stopWatching()
    }
  }

  getBountiesAndSubscribeToEvent() {
    bountiesSapphire(window.web3).then((instance) => {
      this.BountyActivatedEvent = instance.BountyActivated({}, {
        fromBlock: 0, toBlock: 'latest'
      });
      // every time a new bounty is activated
      this.BountyActivatedEvent.watch((error, result) => {
        if (error) {
          console.error(error)
        } else {
          store.dispatch(bountyActivatedAction(result))
        }
      });

      this.SubmissionAcceptedEvent = instance.SubmissionAccepted({}, {
        fromBlock: 0, toBlock: 'latest'
      });
      // every time a submission is accepted
      this.SubmissionAcceptedEvent.watch((error, result) => {
        if (error) {
          console.error(error)
        } else {
          store.dispatch(submissionAcceptedAction(result))
        }
      });

    }).catch((error) => {
      console.error(error)
    })
  }

  render (){
    return (
      <Provider store={store}>
        <>
          <Route path="/:active?" component={Header} />

          <main className="application-content">
            <Switch>
              <Route path='/bounties/all' component={this.web3AllBounties} />
              <Route path='/bounties/mine' component={this.web3MyBounties} />
              <Route path='/bounties/new' component={this.web3NewBounty} />
              <Route path='/bounties/:bountyId' component={Bounty} />

              <Route exact={true} path='/' component={Landing} />

              <Route component={NotFoundPage} />
            </Switch>
          </main>

          <ReduxToastr
            timeOut={700000}
            newestOnTop={true}
            tapToDismiss={false}
            position="bottom-center"
            transitionIn="bounceIn"
            transitionOut="bounceOut" />

          <Footer />
        </>
      </Provider>
    )
  }
}
