import bountiesSapphire from '@/contracts/bountiesSapphireFactory'

export default function (bountyId, web3) {
  var contract = bountiesSapphire(web3)

  return new Promise((resolve, reject) => {
    contract.then((instance) => {
      instance.getBountyData(bountyId).then((response) => {
        resolve([
          response.toString()
        ])
      }).catch((error) => reject)
    })
  })
}
