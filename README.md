# BountySapphire

`Version 1.0.0`

1. [Introduction](#1-introduction)
2. [How to Run the DApp](#2-steps)
3. [Tests](#3-tests)


## 1. Introduction

BountySapphire is a bounty DApp. It supports very basic bounty management as follows:

If you are a job poster, you can create a new bounty, set a bounty description and include the amount to be paid (in wei) for a successful submission. You can view a list of bounties that you have already posted. By clicking on a bounty, you can review submissions that have been proposed. You can accept the submitted work. Accepting proposed work will pay the submitter the deposited amount. At maximum you can accept at most 3 submissions. The balance deposited to a bounty is initialized to be 3 times of the amount to be paid for each accepted submission.

Each bounty, when created, is in the Activated stage. In this stage, submitters can submit work to the bounty. A bounty will move to the Closed stage, either when the bounty balance becomes zero (e.g. after bounty issuer accepts 3 submissions), or the bounty issuer calls `closeBounty()`.

If you are a bounty hunter, you can submit work to a bounty for review.


## 2. How to Run the DApp

In order to run the user interace of the DApp (which is default to http://localhost:8080), follow the steps outlined below:

Pre-requisite:
browser with MetaMask installed
git
node.js, npm
truffle (you can install it with: `npm install -g truffle`)
ganache-cli (you can install it with: `npm install -g ganache-cli`)

1. unzip all content of the zip file into a project folder:
```
mkdir bountysapphire
cd bountysapphire
(unzip all files in the project zip file to this folder) 
```

2. Start the ganachi-cli local blockchain in another terminal
```
cd bountysapphire
source .envrc
./ganachi-cli
```

3. In the project folder, run npm insall, then start the local lite-server: 
```
npm install
npm run dev
```

4. Compile and migrate the smart contract in the project folder in another terminal:
```
truffle compile
truffle migrate
```

5. Open a browser with MetaMask installed. Make sure MetaMask connects to local blockchain started by ganachi-cli. Connect to `http://localhost:8080`

Actions supported in the user interface: 
- Create Bounty
- List My Bounties
- List All Bounties
- View a Bounty
- Submit work for a Bounty
- View the list of submissions for a Bounty You Own
- Accept a submission to a Bounty You Own

6. To simplify the use cases, when a new bounty is created, it is initialized with its deadline set to 1 year from now, and the bounty balance is set to 3 times of the amount to be paid to an accepted submission (meaning that each bounty at maximum can accept 3 submissions).


## 3. Tests

To run the tests, execute truffle test inside the project directory
truffle test

7 tests are created and they should all pass.

Contract: BountiesSapphire
- Tests the BountiesSapphire registry works
- Tests new bounty can be created
- Tests sending a date in the past will fail to create a bounty
- Tests we cannot create a bounty with zero payout
- Tests a simple bounty submission acceptance flow works
- Tests changing a submission works
- Tests changing an accepted submission fails


