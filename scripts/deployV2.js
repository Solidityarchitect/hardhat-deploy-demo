const hre = require("hardhat");
const { run } = require("hardhat");

const OWNER_ADDRESS = "0x02738c6539b9f7898895Da2264EeA296835979E4";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy logic contract
  const HelloworldV2Logic = await ethers.getContractFactory(
    "contracts/HelloWorldV2.sol:HelloWorldV2"
  );
  const helloWorldV2Logic = await HelloworldV2Logic.deploy();
  await helloWorldV2Logic.waitForDeployment();
  console.log("helloWorldLogic deployed to:", helloWorldV2Logic.target);

  // Deploy proxy contract
  const HelloworldProxy = await ethers.getContractFactory(
    "TransparentUpgradeableProxy"
  );
  const helloWorldProxy = await HelloworldProxy.deploy(
    helloWorldV2Logic.target,
    OWNER_ADDRESS,
    helloWorldV2Logic.interface.encodeFunctionData("initialize", [
      OWNER_ADDRESS,
    ])
  );
  await helloWorldProxy.waitForDeployment();
  console.log("helloWorldProxy deployed to:", helloWorldProxy.target);

  // Get proxyAdmin address from the deployment transaction
  const receipt = await helloWorldProxy.deploymentTransaction().wait();
  const logs = receipt.logs;
  const proxyAdminLog = logs.find(
    (log) => helloWorldProxy.interface.parseLog(log)?.name === "AdminChanged"
  );
  const proxyAdminAddress = proxyAdminLog.args[1];
  console.log("ProxyAdmin address:", proxyAdminAddress);

  // Get marketplace contract from proxy
  const helloworld = HelloworldV2Logic.attach(helloWorldProxy.target);
  console.log("helloworld address:", helloworld.target);

  console.log("Contract deployed successfully!");

  // Verify contracts on Etherscan

  console.log("Verifying contracts on Etherscan...");

  await run("verify:verify", {
    address: helloWorldV2Logic.target,
    constructorArguments: [],
  });

  await run("verify:verify", {
    address: helloWorldProxy.target,
    constructorArguments: [
      helloWorldV2Logic.target,
      OWNER_ADDRESS,
      helloWorldV2Logic.interface.encodeFunctionData("initialize", [
        OWNER_ADDRESS,
      ]),
    ],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
