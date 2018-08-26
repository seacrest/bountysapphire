import React, {
  Component
} from 'react'
import { Link } from 'react-router-dom'

import Hero from '@/components/hero'

export default class Landing extends Component {

  render () {
    return (
      <Hero>
        <div className="columns">
          <div className="column"></div>

          <div className="column is-two-thirds">
            <p className="title">
              What is BountySapphire?
            </p>
            <p>
              <strong>BountySapphire</strong> is a bounty DApp. It supports bounty management as follows: 
            </p>
            <br />
            <p>
              If you are a job poster, you can create a new bounty, set a bounty description and include the amount to be paid for a successful submission. You can view a list of bounties that you have already posted. By clicking on a bounty, you can review submissions that have been proposed. You can accept or reject the submitted work. Accepting proposed work will pay the submitter the deposited amount. 
            </p>
            <br />
            <p>
              If you are a bounty hunter, you can submit work to a bounty for review.
            </p>

            <br />
            <Link to="/bounties/new" className="button is-info is-large">
              <span>Proceed to Create a Bounty</span>
            </Link>
            <br />
            <small className="is-size-7">(Connects to local or testing network, does not require actual Ether)</small>
          </div>

          <div className="column"></div>
        </div>
      </Hero>
    )
  }

}
