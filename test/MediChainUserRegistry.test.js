const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MediChainUserRegistry", function () {
  let MediChainUserRegistry;
  let mediChainUserRegistry;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the contract
    MediChainUserRegistry = await ethers.getContractFactory("MediChainUserRegistry");
    mediChainUserRegistry = await MediChainUserRegistry.deploy(owner.address);
    await mediChainUserRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await mediChainUserRegistry.owner()).to.equal(owner.address);
    });
  });

  describe("User Registration", function () {
    it("Should register a new user successfully", async function () {
      const userId = "user123";
      const profileHash = "0x1234567890abcdef";
      const email = "user@example.com";

      const tx = await mediChainUserRegistry.registerUser(userId, profileHash, email);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(mediChainUserRegistry, "UserRegistered")
        .withArgs(userId, profileHash, email, block.timestamp);

      const isRegistered = await mediChainUserRegistry.isUserRegistered(userId);
      expect(isRegistered).to.be.true;
    });

    it("Should not allow registering the same user twice", async function () {
      const userId = "user123";
      const profileHash = "0x1234567890abcdef";
      const email = "user@example.com";

      // Register user first time
      await mediChainUserRegistry.registerUser(userId, profileHash, email);

      // Try to register same user again
      await expect(
        mediChainUserRegistry.registerUser(userId, profileHash, email)
      ).to.be.revertedWith("User already registered");
    });

    it("Should initialize consent with default values", async function () {
      const userId = "user123";
      const profileHash = "0x1234567890abcdef";
      const email = "user@example.com";

      await mediChainUserRegistry.registerUser(userId, profileHash, email);

      const consent = await mediChainUserRegistry.getUserConsent(userId);
      expect(consent.analytics).to.be.false;
      expect(consent.marketing).to.be.false;
      expect(consent.research).to.be.false;
      expect(consent.sharing).to.be.false;
    });
  });

  describe("Profile Updates", function () {
    beforeEach(async function () {
      const userId = "user123";
      const profileHash = "0x1234567890abcdef";
      const email = "user@example.com";
      await mediChainUserRegistry.registerUser(userId, profileHash, email);
    });

    it("Should update user profile hash", async function () {
      const userId = "user123";
      const newProfileHash = "0xfedcba0987654321";

      const tx = await mediChainUserRegistry.updateUserProfile(userId, newProfileHash);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(mediChainUserRegistry, "ProfileUpdated")
        .withArgs(userId, newProfileHash, block.timestamp);

      const userProfile = await mediChainUserRegistry.getUserProfile(userId);
      expect(userProfile.profileHash).to.equal(newProfileHash);
    });

    it("Should not allow updating non-existent user", async function () {
      const nonExistentUserId = "nonexistent";
      const newProfileHash = "0xfedcba0987654321";

      await expect(
        mediChainUserRegistry.updateUserProfile(nonExistentUserId, newProfileHash)
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("Consent Management", function () {
    beforeEach(async function () {
      const userId = "user123";
      const profileHash = "0x1234567890abcdef";
      const email = "user@example.com";
      await mediChainUserRegistry.registerUser(userId, profileHash, email);
    });

    it("Should update user consent preferences", async function () {
      const userId = "user123";
      const consentHash = "0xconsenthash123";

      const tx = await mediChainUserRegistry.updateConsent(
        userId,
        consentHash,
        true,  // analytics
        false, // marketing
        true,  // research
        false  // sharing
      );
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(mediChainUserRegistry, "ConsentUpdated")
        .withArgs(
          userId,
          consentHash,
          true,
          false,
          true,
          false,
          block.timestamp
        );

      const consent = await mediChainUserRegistry.getUserConsent(userId);
      expect(consent.analytics).to.be.true;
      expect(consent.marketing).to.be.false;
      expect(consent.research).to.be.true;
      expect(consent.sharing).to.be.false;
      expect(consent.consentHash).to.equal(consentHash);
    });

    it("Should not allow updating consent for non-existent user", async function () {
      const nonExistentUserId = "nonexistent";
      const consentHash = "0xconsenthash123";

      await expect(
        mediChainUserRegistry.updateConsent(
          nonExistentUserId,
          consentHash,
          true,
          false,
          true,
          false
        )
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("User Verification", function () {
    beforeEach(async function () {
      const userId = "user123";
      const profileHash = "0x1234567890abcdef";
      const email = "user@example.com";
      await mediChainUserRegistry.registerUser(userId, profileHash, email);
    });

    it("Should allow owner to verify users", async function () {
      const userId = "user123";

      const tx = await mediChainUserRegistry.verifyUser(userId, true);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);
      
      await expect(tx)
        .to.emit(mediChainUserRegistry, "UserVerified")
        .withArgs(userId, true, block.timestamp);

      const isVerified = await mediChainUserRegistry.isUserVerified(userId);
      expect(isVerified).to.be.true;
    });

    it("Should not allow non-owner to verify users", async function () {
      const userId = "user123";

      await expect(
        mediChainUserRegistry.connect(user1).verifyUser(userId, true)
      ).to.be.revertedWithCustomError(mediChainUserRegistry, "OwnableUnauthorizedAccount");
    });

    it("Should not allow verifying non-existent user", async function () {
      const nonExistentUserId = "nonexistent";

      await expect(
        mediChainUserRegistry.verifyUser(nonExistentUserId, true)
      ).to.be.revertedWith("User not registered");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      const userId = "user123";
      const profileHash = "0x1234567890abcdef";
      const email = "user@example.com";
      await mediChainUserRegistry.registerUser(userId, profileHash, email);
    });

    it("Should return user verification details", async function () {
      const userId = "user123";
      
      const verification = await mediChainUserRegistry.getUserVerification(userId);
      expect(verification.isRegistered).to.be.true;
      expect(verification.profileHash).to.equal("0x1234567890abcdef");
    });

    it("Should return user profile", async function () {
      const userId = "user123";
      
      const profile = await mediChainUserRegistry.getUserProfile(userId);
      expect(profile.email).to.equal("user@example.com");
      expect(profile.isRegistered).to.be.true;
    });

    it("Should check if user is registered", async function () {
      const userId = "user123";
      const nonExistentUserId = "nonexistent";
      
      expect(await mediChainUserRegistry.isUserRegistered(userId)).to.be.true;
      expect(await mediChainUserRegistry.isUserRegistered(nonExistentUserId)).to.be.false;
    });

    it("Should check if user is verified", async function () {
      const userId = "user123";
      
      // Initially not verified
      expect(await mediChainUserRegistry.isUserVerified(userId)).to.be.false;
      
      // Verify user
      await mediChainUserRegistry.verifyUser(userId, true);
      expect(await mediChainUserRegistry.isUserVerified(userId)).to.be.true;
    });
  });

  // Helper function to get current block timestamp
  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});