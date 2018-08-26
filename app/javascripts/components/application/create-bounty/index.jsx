import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'

import range from 'lodash.range'
import classnames from 'classnames'

import bountiesSapphire from '@/contracts/bountiesSapphireFactory'

import { addTokenAction } from '@/redux/actions'

import Ether from '@/components/ether'

import style from './style.scss'

const MyCustomComponent = class extends Component {

  render() {
    return (
      <span>
        {this.props.children}
      </span>
    )
  }

}


const CreateBounty = class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      price: '',
      title: '',
      titleError: '',
      errorMessage: '',
      redirectToTokenList: false
    }
  }

  async componentDidMount() {
    try {
      let contractInstance = await bountiesSapphire(window.web3);

      this.setState({ price: '100000000000000000' })
    } catch(error) {
      toastr.error('Error', error.message)
    }
  }

  async onClickSave () {
    // Reset the error handling
    this.setState({ titleError: '' })

    if (this.state.title.length < 1) {
      this.setState({ titleError: 'Please enter at least 1 character for the description' })
    } else {
      try {
        let contractInstance = await bountiesSapphire(window.web3);
        var aYearFromNow = new Date();
        aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
        // To simplify the use case, we initialize the balance of a bounty
        // to 3 times of the amount to be paid for each accepted submission.
        // Therefore, at most 3 accepted submissions per bounty.
        const txHash = await contractInstance.createBounty.sendTransaction(
            window.web3.eth.defaultAccount,
            Math.round(aYearFromNow.getTime()/1000),
            this.state.title,
            this.state.price,
            this.state.price*3,
            { value: this.state.price*3 }
        )

        this.props.addToken({ transactionHash: txHash })
        this.setState({ redirectToMyBounties: true })
        toastr.success('Success', 'The transaction has been broadcast.')
      } catch(err) {
        toastr.error('Error', 'The transaction was cancelled or rejected.')
        //toastr.error('Error', err.message)
      }
    }
  }

  render () {
    if (this.state.redirectToMyBounties)
      return <Redirect to={'/bounties/mine'} />

    if (this.state.titleError)
      var titleError =
        <p className="help is-danger">{this.state.titleError}</p>

    if (this.state.errorMessage)
      var errorMessage = <p className='help is-danger'>{this.state.errorMessage}</p>

    return (
      <section className='section'>
        <div className='container'>
          <div className='columns'>
            <div className='column is-one-half-desktop'>

              <div className="etherplate-form">
                <div className="etherplate-form--wrapper">

                  <div className="field">
                    <label className="label">Amount to be paid (in Wei)</label>
                    <div className="control">
                      <input
                        className="input"
                        value={this.state.price}
                        onChange={(g) => this.setState({ price: g.target.value })} />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Bounty Description</label>
                    <div className="control">
                      <input
                        placeholder={`Write your bounty description here`}
                        className="input"
                        value={this.state.title}
                        onChange={(e) => this.setState({ title: e.target.value })} />
                    </div>
                    {titleError}
                  </div>

                  <br />
                  <p>
                    <button
                      disabled={this.state.price == 0}
                      className={classnames('button is-success is-medium')}
                      onClick={(e) => this.onClickSave()}>
                      Create Bounty
                    </button>
                  </p>
                  {errorMessage}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToken: (token) => {
      dispatch(addTokenAction(token))
    }
  }
}

export default connect(null, mapDispatchToProps)(CreateBounty)
