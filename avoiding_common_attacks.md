# Avoiding Common Attacks

## 1. Integer Overflow and Underflow

Guards are implemented to prevent integer overflow in the array indexes of the bounties and submissions

## 2. Use Emergency Stop to Prevent Funds in Bounties from being Drained

With the implementation of **Emergency Stop**, funds held in bounties are also frozen before the owner resume the contract.

## 3. Reentrancy Attacks

Reentrancy attacks are avoided altogether in the **BountiesSapphire** smart contract. External call is avoided altogether and internal work is completed before making fund transfer.

## 4. Avoid Gas Limits Attacks

We mitigated against this risk with no looping logic in the smart contract code. 
