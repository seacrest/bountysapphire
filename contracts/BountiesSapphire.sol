pragma solidity ^0.4.24;

/*
 * Use a library via EthPM
 */
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/// @title BountiesSapphire
/// @dev A bounty contract that pays job submitters for task submission 
/// @author Elvis Chan <elvis.chan@alumni.ust.hk>
contract BountiesSapphire is Ownable {

  /* 
   * Circuit breaker (emergency stop) design pattern implementation  
   * This will be useful when new errors are discovered.
   */
  bool private stopped = false;

  modifier onlyAdmin() {
    require(msg.sender == owner);
    _;
  }

  function toggleContractActive() onlyAdmin public {
    stopped = !stopped;
  }

  modifier stopInEmergency { if (!stopped) _; }
  modifier onlyInEmergency { if (stopped) _; }


  /*
   * Events
   */
  event BountyActivated(uint bountyId, address issuer);
  event BountySubmitted(uint bountyId, address submitter, uint256 _submissionId);
  event SubmissionUpdated(uint _bountyId, uint _submissionId);
  event SubmissionAccepted(uint bountyId, address submitter, uint256 _submissionId);
  event BountyClosed(uint bountyId, address issuer);
  

  /*
   * Storage
   */

  address public owner;

  Bounty[] public bounties;

  mapping(uint=>Submission[]) submissions;

  mapping(uint=>uint) numSubmissionAccepted;

  /*
   * Enums
   */

  enum BountyStages {
      Activated,
      Closed
  }

  /*
   * Structs
   */

  struct Bounty {
      address issuer;
      uint deadline;
      string bountyData;
      uint submissionAmount;
      BountyStages bountyStage;
      uint balance;
  }

  struct Submission {
      bool accepted;
      address submitter;
      string submissionData;
  }

  /*
   * Modifiers
   */

  modifier checkBountiesLength(){
    require((bounties.length + 1) > bounties.length);
    _;
  }

  modifier checkSubmissionsLength(uint _bountyId){
    require((submissions[_bountyId].length + 1) > submissions[_bountyId].length);
    _;
  }

  modifier checkBountyArrayIndex(uint _bountyId){
    require(_bountyId < bounties.length);
    _;
  }

  modifier checkSubmissionArrayIndex(uint _bountyId, uint _index) {
      require(_index < submissions[_bountyId].length);
      _;
  }

  modifier onlyIssuer(uint _bountyId) {
      require(msg.sender == bounties[_bountyId].issuer);
      _;
  }

  modifier onlySubmitter(uint _bountyId, uint _submissionId) {
      require(msg.sender == submissions[_bountyId][_submissionId].submitter);
      _;
  }

  modifier isNotClosed(uint _bountyId) {
      require(bounties[_bountyId].bountyStage != BountyStages.Closed);
      _;
  }

  modifier notIssuer(uint _bountyId) {
      require(msg.sender != bounties[_bountyId].issuer);
      _;
  }

  modifier amountIsNotZero(uint _amount) {
      require(_amount != 0);
      _;
  }

  modifier transferredAmountEqualsValue(uint _bountyId, uint _amount) {
      require((_amount * 1 wei) == msg.value);
      _;
  }

  modifier isBeforeDeadline(uint _bountyId) {
      require(now < bounties[_bountyId].deadline);
      _;
  }

  modifier validateDeadline(uint _newDeadline) {
      require(_newDeadline > now);
      _;
  }

  modifier isAtStage(uint _bountyId, BountyStages _atStage) {
      require(bounties[_bountyId].bountyStage == _atStage);
      _;
  }

  modifier notYetAccepted(uint _bountyId, uint _submissionId){
      require(submissions[_bountyId][_submissionId].accepted == false);
      _;
  }

  modifier enoughBalance(uint _bountyId) {
      require(bounties[_bountyId].balance >= bounties[_bountyId].submissionAmount);
      _;
  }

  /*
   * Public functions
   */


  /// @dev constructor(): instantiates
  // @param _owner the issuer of the BountiesSapphire contract, who has the
  /// ability to remove bounties and trigger emergency stop.
  constructor()
      public
  {
      owner = msg.sender;
  }


  /// @dev createBounty(): Creates a new bounty
  /// @param _issuer address of issuer of the bounty
  /// @param _deadline unix timestamp. No submission accepted after deadline
  /// @param _data the description of the bounty
  /// @param _submissionAmount amount of wei paid for accepted submission
  /// @param _value the total balance deposited by issuer for the bounty
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
      checkBountiesLength
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


  /// @dev submitBounty(): Submit work for a bounty
  /// @param _bountyId the index of the bounty
  /// @param _data describes what is beng submitted for the bounty
  function submitBounty(uint _bountyId, string _data)
      public
      checkBountyArrayIndex(_bountyId)
      checkSubmissionsLength(_bountyId)
      isAtStage(_bountyId, BountyStages.Activated)
      isBeforeDeadline(_bountyId)
      notIssuer(_bountyId)
      stopInEmergency
  {
      submissions[_bountyId].push(Submission(false, msg.sender, _data));

      emit BountySubmitted(_bountyId, msg.sender, (submissions[_bountyId].length - 1));
  }


  /// @dev updateSubmission(): Revise data for a submission
  /// @param _bountyId the index of the bounty
  /// @param _submissionId the index of the submission
  /// @param _data the new data being submitted
  function updateSubmission(uint _bountyId, uint _submissionId, string _data)
      public
      checkBountyArrayIndex(_bountyId)
      checkSubmissionArrayIndex(_bountyId, _submissionId)
      onlySubmitter(_bountyId, _submissionId)
      notYetAccepted(_bountyId, _submissionId)
      stopInEmergency
  {
      submissions[_bountyId][_submissionId].submissionData = _data;
      emit SubmissionUpdated(_bountyId, _submissionId);
  }


  /// @dev acceptSubmission(): Accept a given submission
  /// @param _bountyId the index of the bounty
  /// @param _submissionId the index of the submission being accepted
  function acceptSubmission(uint _bountyId, uint _submissionId)
      public
      checkBountyArrayIndex(_bountyId)
      checkSubmissionArrayIndex(_bountyId, _submissionId)
      onlyIssuer(_bountyId)
      isAtStage(_bountyId, BountyStages.Activated)
      notYetAccepted(_bountyId, _submissionId)
      enoughBalance(_bountyId)
      stopInEmergency
  {
      submissions[_bountyId][_submissionId].accepted = true;
      numSubmissionAccepted[_bountyId]++;
      bounties[_bountyId].balance -= bounties[_bountyId].submissionAmount;
      submissions[_bountyId][_submissionId].submitter.transfer(bounties[_bountyId].submissionAmount);
      emit SubmissionAccepted(_bountyId, msg.sender, _submissionId);
      if (bounties[_bountyId].balance == 0) {
        moveToState(_bountyId, BountyStages.Closed);
        emit BountyClosed(_bountyId, msg.sender);
      }
  }


  /// @dev closeBounty(): Returns remaining balance of bounty 
  /// and moves the bounty into the Closed stage 
  /// @param _bountyId the index of the bounty
  function closeBounty(uint _bountyId)
      public
      checkBountyArrayIndex(_bountyId)
      onlyIssuer(_bountyId)
      stopInEmergency
  {
      moveToState(_bountyId, BountyStages.Closed);
      uint oldBalance = bounties[_bountyId].balance;
      bounties[_bountyId].balance = 0;
      if (oldBalance > 0) {
        bounties[_bountyId].issuer.transfer(oldBalance);
      }
      emit BountyClosed(_bountyId, msg.sender);
  }


  /// @dev getSubmission(): Returns the submission at a given index
  /// @param _bountyId  index of the bounty
  /// @param _submissionId  index of the submission to return
  /// @return Returns a tuple for the submission
  function getSubmission(uint _bountyId, uint _submissionId)
      public
      constant
      checkBountyArrayIndex(_bountyId)
      checkSubmissionArrayIndex(_bountyId, _submissionId)
      returns (bool, address, string)
  {
      return (submissions[_bountyId][_submissionId].accepted,
              submissions[_bountyId][_submissionId].submitter,
              submissions[_bountyId][_submissionId].submissionData);
  }


  /// @dev getBounty(): Returns the information of the bounty
  /// @param _bountyId  index of the bounty
  /// @return Returns a tuple for the bounty
  function getBounty(uint _bountyId)
      public
      constant
      checkBountyArrayIndex(_bountyId)
      returns (address, uint, uint, uint, uint)
  {
      return (bounties[_bountyId].issuer,
              bounties[_bountyId].deadline,
              bounties[_bountyId].submissionAmount,
              uint(bounties[_bountyId].bountyStage),
              bounties[_bountyId].balance);
  }


  /// @dev getBountyData(): Returns the data field of the bounty
  /// @param _bountyId  index of the bounty
  /// @return Returns a string for the bounty data
  function getBountyData(uint _bountyId)
      public
      constant
      checkBountyArrayIndex(_bountyId)
      returns (string)
  {
      return (bounties[_bountyId].bountyData);
  }


  /// @dev getNumBounties(): Returns total number of bounties in the registry
  /// @return Returns the number of bounties
  function getNumBounties()
      public
      constant
      returns (uint)
  {
      return bounties.length;
  }


  /// @dev getNumSubmissions(): Returns number of submissions of a bounty
  /// @param _bountyId  index of the bounty
  /// @return Returns the number of submissions
  function getNumSubmissions(uint _bountyId)
      public
      constant
      checkBountyArrayIndex(_bountyId)
      returns (uint)
  {
      return submissions[_bountyId].length;
  }


  /// @dev moveToState(): Moves the contract to the new stage
  /// @param _bountyId the index of the bounty
  /// @param _newStage the new stage to move to
  function moveToState(uint _bountyId, BountyStages _newStage)
      internal
  {
      bounties[_bountyId].bountyStage = _newStage;
  }

}

