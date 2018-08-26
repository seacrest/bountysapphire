import bountiesSapphire from '@/contracts/bountiesSapphireFactory'

export default function (bountyId, web3) {
  var contract = bountiesSapphire(web3)

  return new Promise((resolve, reject) => {
    contract.then((instance) => {
      instance.getBounty(bountyId).then((response) => {
        resolve([
          response[0].toString(),
          response[1].toString(),
          response[2].toString(),
          parseInt(response[3].toString()),
          response[4].toString()
        ])
      }).catch((error) => reject)
    })
  })
}
