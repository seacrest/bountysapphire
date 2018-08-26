const BountiesSapphire = artifacts.require("../contracts/BountiesSapphire");

function ensureException(error) {
    let strErr = error.toString();
    let isException = strErr.includes('invalid opcode') || strErr.includes('invalid JUMP') || strErr.includes('out of gas') || strErr.includes('revert');
    assert(isException, error.toString());
}


contract('BountiesSapphire', function(accounts) {


  it("Tests the BountiesSapphire registry works", async () => {

    let registry = await BountiesSapphire.new();

    let owner = await registry.owner();

    assert(owner == accounts[0])

  });

  it("Tests new bounty can be created", async () => {

    let registry = await BountiesSapphire.new();

    await registry.createBounty(accounts[0],
                                1566536822,
                                "data",
                                1000,
                                1000,
                                {from: accounts[0],value: 1000});

    let bounty = await registry.getBounty(0);

    assert(bounty[3] == 0);
  });

  it("Tests sending a date in the past will fail to create a bounty", async () => {
    let registry = await BountiesSapphire.new();

    try {

      await registry.createBounty(accounts[0],
                                  0,
                                  "data",
                                  1000,
                                  1000,
                                  {from: accounts[0],value: 1000});
    } catch (error){
      return ensureException(error);
    }
    assert(false, "did not error as was expected");
  });

  it("Tests we cannot create a bounty with zero payout", async () => {
    let registry = await BountiesSapphire.new();

    try {

      await registry.createBounty(accounts[0],
                                  1566536822,
                                  "data",
                                  0,
                                  1000,
                                  {from: accounts[0],value: 1000});
    } catch (error){
      return ensureException(error);
    }
    assert(false, "did not error as was expected");
  });

  it("Tests a simple bounty submission acceptance flow works", async () => {
    let registry = await BountiesSapphire.new();

    await registry.createBounty(accounts[0],
                                1566536822,
                                "data",
                                1000,
                                1000,
                                {from: accounts[0],value: 1000});

    await registry.submitBounty(0, "submitted work", {from: accounts[1]});
    let submission = await registry.getSubmission(0,0);
    assert(submission[0] === false);
    await registry.acceptSubmission(0,0,{from: accounts[0]});
    submission = await registry.getSubmission(0,0);
    assert(submission[0] === true);
  });

  it("Tests changing a submission works", async () => {
    let registry = await BountiesSapphire.new();

    await registry.createBounty(accounts[0],
                                1566536822,
                                "data",
                                1000,
                                1000,
                                {from: accounts[0],value: 1000});

    await registry.submitBounty(0, "submitted work", {from: accounts[1]});
    let submission = await registry.getSubmission(0,0);
    assert(submission[2] === "submitted work");
    await registry.updateSubmission(0,0,"revised work", {from: accounts[1]});
    submission = await registry.getSubmission(0,0);
    assert(submission[2] === "revised work");
  });

  it("Tests changing an accepted submission fails", async () => {
    let registry = await BountiesSapphire.new();

    await registry.createBounty(accounts[0],
                                1566536822,
                                "data",
                                1000,
                                1000,
                                {from: accounts[0],value: 1000});

    await registry.submitBounty(0, "submitted work", {from: accounts[1]});
    await registry.acceptSubmission(0,0,{from: accounts[0]});

    try {
      await registry.updateSubmission(0,0,"revised work", {from: accounts[1]});
    } catch (error){
      return ensureException(error);
    }
    assert(false, "did not error as was expected");
  });


});
