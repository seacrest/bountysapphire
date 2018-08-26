import React, {
  Component
} from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import getBounty from '@/services/get-bounty'
import getBountyData from '@/services/get-bounty-data'


const MyBountyRow = class extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    getBounty(this.props.bountyId, window.web3).then((values) => {

      this.setState({
        bountyId: this.props.bountyId,
        issuer: values[0],
        deadline: values[1],
        fulfillmentAmount: values[2],
        bountyStage: values[3],
        balance: values[4]
      })

    }).catch((error) => {
      console.log('getBounty ' + values[0])
      console.error(error)
    });
    getBountyData(this.props.bountyId, window.web3).then((values) => {
      this.setState({
        data: values
      })  
    }).catch((error) => {
      console.log('getBountyData ' + values[0])
      console.error(error)
    });
  }

  render () {
    var bountyStage = ['Active','Closed']

    let bountyLinkUrl = `/bounties/${this.props.bountyId}`
    if (this.state.issuer != window.web3.eth.defaultAccount)
      return null
    else
    return (
      <tr className='bounty-row'>
        <td>
          {this.props.bountyId}
        </td>
        <td>
          <Link to={bountyLinkUrl}>{this.state.data}</Link>
        </td>
        <td>
          {this.state.fulfillmentAmount}
        </td>
        <td>
          {bountyStage[Number(this.state.bountyStage)]}
        </td>
      </tr>
    )
  }
}

MyBountyRow.propTypes = {
  bountyId: PropTypes.number.isRequired
}

export default MyBountyRow;
