import bountiesSapphire from '@/contracts/bountiesSapphireFactory'

export default function (bountyId, submissionId, web3) {
  var contract = bountiesSapphire(web3)

  return new Promise((resolve, reject) => {
    contract.then((instance) => {
      instance.getSubmission(bountyId,submissionId).then((response) => {
        resolve([
          response[0].toString(),
          response[1].toString(),
          response[2].toString()
        ])
      }).catch((error) => reject)
    })
  })
}
