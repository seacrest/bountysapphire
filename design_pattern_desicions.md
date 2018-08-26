# Design Pattern Decisions

Besides the **Emergency Stop** design pattern, the following design patterns are used in the **BountiesSapphire** smart contract:

## 1. Fail early and fail loud

```javascript
  function createBounty(
      address _issuer,
      uint _deadline,
      string _data,
      uint256 _submissionAmount,
      uint256 _value
  )
      public
      payable
      validateDeadline(_deadline)
      amountIsNotZero(_submissionAmount)
      validateNotTooManyBounties
      stopInEmergency
      returns (uint)
  {
      require (_value >= _submissionAmount);
      require((_value * 1 wei) == msg.value);
      bounties.push(Bounty(_issuer,
                            _deadline,
                            _data,
                            _submissionAmount,
                            BountyStages.Activated,
                            _value));
      emit BountyActivated(bounties.length - 1, msg.sender);
      return (bounties.length - 1);
  }
```

The `createBounty()` function in **BountiesSapphire** smart contract checks the condition required for execution as early as possible in the function body and throws an exception if the condition is not met. This is a good practice to reduce unnecessary code execution in the event that an exception will be thrown.


## 2. Restricting Access

This design pattern is wildly used in the **BountiesSapphire** contract to restrict access to functionality only to specific addresses.

For instance, while implementing the **Emergency Stop** pattern, access to the `toggleContractActive()` function is restricted to the admin (which is the owner of the **BountiesSapphire** contract)

```javascript
  modifier isAdmin() {
    require(msg.sender == owner);
    _;
  }

  function toggleContractActive() isAdmin public {
    stopped = !stopped;
  }
```

## 3. State Machine

Bounty is implemented as state machine. Each bounty can be in one of 2 states:

```javascript
  enum BountyStages {
      Activated,
      Closed
  }
```

When the balance of a bounty becomes zero, the bounty will be automatically transition to the Closed state. Issuer of a bounty can close the bounty by calling the `closeBounty(bountyId)` function.


