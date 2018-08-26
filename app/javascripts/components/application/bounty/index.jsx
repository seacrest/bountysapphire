import React, {
  Component
} from 'react'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'

import { Link } from 'react-router-dom'
import _ from 'lodash';
import PropTypes from 'prop-types'
import { BigNumber } from 'bignumber.js';

import classnames from 'classnames'

import Address from '@/components/address'
import EtherscanButton from '@/components/EtherscanButton'

import getBounty from '@/services/get-bounty'
import getBountyData from '@/services/get-bounty-data'
import getNumSubmissions from '@/services/get-num-submissions'
import bountiesSapphire from '@/contracts/bountiesSapphireFactory'

import SubmissionRow from './submission-row'


require('./style.scss')

const Bounty = class extends Component {

  constructor (props) {
    super(props)
    this.state = {
      submissionData: '',
      type: null
    }
  }

  bountyId () {
    return this.props.match.params.bountyId
  }

  componentDidMount() {
    this._isMounted = true;

    this.getBountyFromBlockchain();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getBountyFromBlockchain() {
    getBounty(this.bountyId(), window.web3).then((values) => {
      if (this._isMounted) {
        this.setState({
          bountyId: this.bountyId(),
          issuer: values[0],
          deadline: values[1],
          fulfillmentAmount: values[2],
          bountyStage: values[3],
          balance: values[4]
        })
      }
    })
    getBountyData(this.bountyId(), window.web3).then((values) => {
      if (this._isMounted) {
        this.setState({
          data: values
        })
      }
    })
    getNumSubmissions(this.bountyId(), window.web3).then((values) => {
      if (this._isMounted) {
        this.setState({
          numSubmissions: Number(values)
        })
      }
    })
  }

  async onClickSave () {
    // Reset the error handling
    this.setState({ titleError: '' })

    if (this.state.submissionData.length < 1) {
      this.setState({ titleError: 'Please enter at least 1 character for the description' })
    } else {
      try {
        let contractInstance = await bountiesSapphire(window.web3);
        const txHash = await contractInstance.submitBounty.sendTransaction(
            this.state.bountyId,
            this.state.submissionData
            )
        toastr.success('Success', 'The transaction has been broadcast.')
      } catch(err) {
        toastr.error('Error', 'The transaction was cancelled or rejected.')
      }
      getNumSubmissions(this.bountyId(), window.web3).then((values) => {
        if (this._isMounted) {
          this.setState({
            numSubmissions: Number(values)
          })
        }
      })
    }
  }

  render () {
    var content
    var submissionListContent
    var submissionFormContent

    if (this.state.issuer !== null) {
      var address = 'no-address';

    if (this.state.titleError)
      var titleError =
        <p className="help is-danger">{this.state.titleError}</p>

    if (this.state.errorMessage)
      var errorMessage = <p className='help is-danger'>{this.state.errorMessage}</p>
    
    console.log("this.state.bountyStage: " + this.state.bountyStage)
    var bountyStage = ['Active','Closed']

      content = (
        <div className="token columns is-centered">
          <div className='column is-three-quarters-tablet is-three-quarters-desktop is-one-half-widescreen is-one-half-fullhd has-text-centered'>

            <p className="token__title title has-text-grey">
              {this.state.data}
            </p>

            <table className='table is-striped is-fullwidth'>
              <thead>
                <tr>
                  <th>
                    bountyID
                  </th>
                  <th width="80%">
                    Amount to be Paid
                  </th>
                  <th>
                    Bounty Stage
                  </th>
                  <th>
                    Number of Submissions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {this.bountyId()}
                  </td>
                  <td>
                    {this.state.fulfillmentAmount}
                  </td>
                  <td>
                    {bountyStage[Number(this.state.bountyStage)]}
                  </td>
                  <td>
                    {this.state.numSubmissions}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )

      submissionListContent = null
      if (this.state.issuer == window.web3.eth.defaultAccount) {
        submissionListContent = (
        <div className="token columns">
          <div className='column is-three-quarters-tablet is-three-quarters-desktop is-one-half-widescreen is-one-half-fullhd has-text-centered'>

            <p className="token__title title has-text-grey has-text-centered">
              Current Submissions for your Bounty
            </p>

            <table className='table is-striped is-fullwidth'>
              <thead>
                <tr>
                  <th>
                    Submission ID
                  </th>
                  <th>
                    Accepted
                  </th>
                  <th width="80%">
                    Submitter Address
                  </th>
                  <th>
                    Submission Description
                  </th>
                  <th>
                    Accept Submission?
                  </th>
                </tr>
              </thead>
                <tbody>
                  {Array.from(Array(this.state.numSubmissions),(x,i)=>i).map((_submissionId) => {
                  return <SubmissionRow bountyId={Number(this.state.bountyId)} submissionId={_submissionId} key={_submissionId} />
                  } )}
                </tbody>
            </table>
          </div>
        </div>

          )
      }

      submissionFormContent = null
      if (this.state.issuer != window.web3.eth.defaultAccount) {
        submissionFormContent = (
        <div className='container'>
          <div className='columns'>
            <div className='column is-one-half-desktop'>

              <div className="etherplate-form">
                <div className="etherplate-form--wrapper">

                  <div className="field">
                    <label className="label">Submission Description</label>
                    <div className="control">
                      <input
                        disabled={this.state.bountyStage != '0'}
                        placeholder={`Describe your submission here`}
                        className="input"
                        value={this.state.submissionData}
                        onChange={(e) => this.setState({ submissionData: e.target.value })} />
                    </div>
                    {titleError}
                  </div>

                  <br />
                  <p>
                    <button
                      disabled={this.state.bountyStage != '0'}
                      className={classnames('button is-success is-medium')}
                      onClick={(e) => this.onClickSave()}>
                      Submit Work for Bounty
                    </button>
                  </p>
                  {errorMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      }
    }

    return (
      <section className='section'>
        <div className='container'>
          {content}

          {submissionListContent}

        </div>

          {submissionFormContent}

      </section>

    )
  }
}

Bounty.propTypes = {
  match: PropTypes.object.isRequired
}

Bounty.defaultProps = {
  bounty: PropTypes.object
}

const mapStateToProps = function(state, props) {
  let bounty = {}

  //if (state.bountyId.length > 0) {
    let bountyIdAsBigNumber = new BigNumber(props.match.params.bountyId)
    bounty = props.match.params.bountyId
    //bounty = _.find(state.bountyId, { args: { bountyId: bountyIdAsBigNumber } })
  //}

  return {
    bounty: bounty
  }
}

export default connect(mapStateToProps)(Bounty);
