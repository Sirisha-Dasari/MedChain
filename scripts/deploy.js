const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying MediChainUserRegistry smart contract...");

  // Get deployer signer
  const [deployer] = await hre.ethers.getSigners();

  // Get deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("📋 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Get Contract Factory
  const MediChainUserRegistry = await hre.ethers.getContractFactory("MediChainUserRegistry");

  console.log("📦 Deploying MediChainUserRegistry...");
  const mediChainUserRegistry = await MediChainUserRegistry.deploy(deployer.address);

  await mediChainUserRegistry.waitForDeployment();

  console.log("✅ MediChainUserRegistry deployed to:", await mediChainUserRegistry.getAddress());
  console.log("🔗 Transaction hash:", mediChainUserRegistry.deploymentTransaction().hash);

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: await mediChainUserRegistry.getAddress(),
    deployerAddress: deployer.address,
    transactionHash: mediChainUserRegistry.deploymentTransaction().hash,
    blockNumber: mediChainUserRegistry.deploymentTransaction().blockNumber,
    gasUsed: mediChainUserRegistry.deploymentTransaction().gasLimit?.toString(),
    deploymentTime: new Date().toISOString(),
    constructorArgs: [deployer.address],
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployments/" + hre.network.name + ".json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
