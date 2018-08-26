import React, {
  Component
} from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { toastr } from 'react-redux-toastr'
import classnames from 'classnames'

import getSubmission from '@/services/get-submission'
import bountiesSapphire from '@/contracts/bountiesSapphireFactory'


const SubmissionRow = class extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    getSubmission(this.props.bountyId, this.props.submissionId, window.web3).then((values) => {

      this.setState({
        submissionId: this.props.submissionId,
        accepted: values[0],
        submitter: values[1],
        data: values[2]
      })

    }).catch((error) => {
      console.error(error)
    });
  }

  async onClickAccept () {
    // Reset the error handling
    this.setState({ titleError: '' })

    if (this.state.accepted === 'true') {
      this.setState({ titleError: 'Submission already accepted' })
    } else {
      try {
        let contractInstance = await bountiesSapphire(window.web3);

        const txHash = await contractInstance.acceptSubmission.sendTransaction(
            this.props.bountyId,
            this.state.submissionId
        )

//        this.setState({ redirectToMyBounties: true })
        this.setState({ accepted: 'true' })
        toastr.success('Success', 'The transaction has been broadcast.')
      } catch(err) {
        toastr.error('Error', 'The transaction was cancelled or rejected.')
        //toastr.error('Error', err.message)
      }
    }
  }

  render () {
    let bountyLinkUrl = `/bounties/${this.props.bountyId}`
//    if (this.state.issuer != window.web3.eth.defaultAccount)
//      return null
//    else
    return (
      <tr className='bounty-row'>
        <td>
          { this.props.submissionId }
        </td>
        <td>
          { this.state.accepted }
        </td>
        <td>
          { this.state.submitter }
        </td>
        <td>
          { this.state.data }
        </td>
        <td>
          <button
            disabled={this.state.accepted === 'true'}
            className={classnames('button is-success is-medium')}
            onClick={(e) => this.onClickAccept()}>
            Accept
          </button>
        </td>
      </tr>
    )
  }
}

SubmissionRow.propTypes = {
  bountyId: PropTypes.number.isRequired,
  submissionId: PropTypes.number.isRequired
}

export default SubmissionRow;
