const hre = require("hardhat");
const { run } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy logic contract
  const HelloWorldV1 = await ethers.getContractFactory(
    "contracts/HelloWorldV1.sol:HelloWorldV1"
  );
  const helloWorldV1 = await HelloWorldV1.deploy();
  await helloWorldV1.waitForDeployment();
  console.log("helloWorld deployed to:", helloWorldV1.target);

  console.log("Contract deployed successfully!");

  // Verify contracts on Etherscan

  console.log("Verifying contracts on Etherscan...");

  try {
    await run("verify:verify", {
      address: helloWorldV1.target,
      constructorArguments: [],
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
