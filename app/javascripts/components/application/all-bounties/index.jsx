import React, { Component } from 'react'
import PropTypes from 'prop-types'

import bountiesSapphire from '@/contracts/bountiesSapphireFactory'
import { BigNumber } from 'bignumber.js';

import Hero from '@/components/hero'
import BountyRow from './bounty-row'

require('./style.scss')

const AllBounties = class extends Component {

  constructor (props) {
    super(props)

    this.state = {
      bountyIds: [],
      numBounties: 1
    }
  }

  componentDidMount() {
    this._isMounted = true;

    this.refreshTokenList();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  refreshTokenList() {
    bountiesSapphire(window.web3).then((instance) => {
      instance.getNumBounties().then((result) => {
        this.setState({ numBounties: Number(result) });
        //console.log('instance.getNumBounties(): ' + this.state.numBounties);
        //console.log('window.web3.eth.defaultAccount: ' + window.web3.eth.defaultAccount);
      })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render () {
    let content
    if (this.state.numBounties >= 1) {

      content =
        <section className='section'>
          <div className='container'>
            <p className="title">
              List of all Bounties in the Market
            </p>          
            <div className='table__wrapper'>
              <table className='table is-striped is-fullwidth'>
                <thead>
                  <tr>
                    <th>
                      BountyID
                    </th>
                    <th>
                      Bounty Description
                    </th>
                    <th>
                      Amount to be Paid
                    </th>
                    <th>
                      Bounty Stage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(Array(this.state.numBounties),(x,i)=>i).map((_bountyId) => {
                  return <BountyRow bountyId={Number(_bountyId)} key={_bountyId} />
                  } )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
    } else {
      content =
        <Hero>
          <h1 className='title has-text-grey-light has-text-centered'>
            No bounties found.
          </h1>
        </Hero>
    }
    return content
  }
}

AllBounties.propTypes = {
  web3: PropTypes.object
}

export default AllBounties
