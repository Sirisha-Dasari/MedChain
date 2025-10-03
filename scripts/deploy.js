const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying MediChainUserRegistry smart contract...");

  // Get the ContractFactory and Signers
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("📋 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy the contract
  const MediChainUserRegistry = await hre.ethers.getContractFactory("MediChainUserRegistry");
  
  console.log("📦 Deploying MediChainUserRegistry...");
  const mediChainUserRegistry = await MediChainUserRegistry.deploy(deployer.address);

  await mediChainUserRegistry.waitForDeployment();

  console.log("✅ MediChainUserRegistry deployed to:", await mediChainUserRegistry.getAddress());
  console.log("🔗 Transaction hash:", mediChainUserRegistry.deploymentTransaction().hash);

  // Verify the contract on Etherscan/Polygonscan (if not on localhost)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await mediChainUserRegistry.deploymentTransaction().wait(6);
    
    console.log("🔍 Verifying contract on Etherscan/Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: await mediChainUserRegistry.getAddress(),
        constructorArguments: [deployer.address],
      });
      console.log("✅ Contract verified successfully");
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message);
    }
  }

  // Save deployment information
  const contractAddress = await mediChainUserRegistry.getAddress();
  const deploymentTx = mediChainUserRegistry.deploymentTransaction();
  
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    transactionHash: deploymentTx.hash,
    blockNumber: deploymentTx.blockNumber,
    gasUsed: deploymentTx.gasLimit?.toString(),
    deploymentTime: new Date().toISOString(),
    constructorArgs: [deployer.address]
  };

  const fs = require('fs');
  const path = require('path');
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployments/" + hre.network.name + ".json");
  
  return {
    contract: mediChainUserRegistry,
    address: contractAddress,
    deploymentInfo
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

module.exports = main;