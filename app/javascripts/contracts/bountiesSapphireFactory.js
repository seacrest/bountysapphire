import TruffleContract from 'truffle-contract'
import BountiesSapphireABI from '../../../build/contracts/BountiesSapphire.json'

const bountiesSapphireContract = TruffleContract(BountiesSapphireABI)

export default function (web3) {
  bountiesSapphireContract.setProvider(web3.currentProvider)
  bountiesSapphireContract.web3.eth.defaultAccount = web3.eth.accounts[0]

  return bountiesSapphireContract.deployed()
}
