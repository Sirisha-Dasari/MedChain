// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MediChainUserRegistry
 * @dev Smart contract for managing user profiles and consent on the blockchain
 */
contract MediChainUserRegistry is Ownable, ReentrancyGuard {
    
    constructor(address initialOwner) Ownable(initialOwner) {
        // Constructor body can be empty as initialization is handled by parent contracts
    }
    
    struct UserProfile {
        string profileHash;
        string email;
        uint256 registrationTime;
        bool isRegistered;
    }
    
    struct UserConsent {
        bool analytics;
        bool marketing;
        bool research;
        bool sharing;
        string consentHash;
        uint256 lastUpdated;
    }
    
    // Mappings
    mapping(string => UserProfile) public users;
    mapping(string => UserConsent) public userConsent;
    mapping(string => bool) public verifiedUsers;
    
    // Events
    event UserRegistered(
        string indexed userId,
        string profileHash,
        string email,
        uint256 timestamp
    );
    
    event ProfileUpdated(
        string indexed userId,
        string newProfileHash,
        uint256 timestamp
    );
    
    event ConsentUpdated(
        string indexed userId,
        string consentHash,
        bool analytics,
        bool marketing,
        bool research,
        bool sharing,
        uint256 timestamp
    );
    
    event UserVerified(
        string indexed userId,
        bool verified,
        uint256 timestamp
    );
    
    // Modifiers
    modifier userExists(string memory userId) {
        require(users[userId].isRegistered, "User not registered");
        _;
    }
    
    modifier userNotExists(string memory userId) {
        require(!users[userId].isRegistered, "User already registered");
        _;
    }
    
    /**
     * @dev Register a new user on the blockchain
     * @param userId Unique identifier for the user
     * @param profileHash Hash of the user's profile data
     * @param email User's email address
     */
    function registerUser(
        string memory userId,
        string memory profileHash,
        string memory email
    ) external userNotExists(userId) returns (bool) {
        users[userId] = UserProfile({
            profileHash: profileHash,
            email: email,
            registrationTime: block.timestamp,
            isRegistered: true
        });
        
        // Initialize consent with default values (all false)
        userConsent[userId] = UserConsent({
            analytics: false,
            marketing: false,
            research: false,
            sharing: false,
            consentHash: "",
            lastUpdated: block.timestamp
        });
        
        emit UserRegistered(userId, profileHash, email, block.timestamp);
        return true;
    }
    
    /**
     * @dev Update user profile hash
     * @param userId User's unique identifier
     * @param newProfileHash New hash of the user's profile data
     */
    function updateUserProfile(
        string memory userId,
        string memory newProfileHash
    ) external userExists(userId) returns (bool) {
        users[userId].profileHash = newProfileHash;
        
        emit ProfileUpdated(userId, newProfileHash, block.timestamp);
        return true;
    }
    
    /**
     * @dev Update user consent preferences
     * @param userId User's unique identifier
     * @param consentHash Hash of the consent data
     * @param analytics Consent for analytics
     * @param marketing Consent for marketing
     * @param research Consent for research
     * @param sharing Consent for data sharing
     */
    function updateConsent(
        string memory userId,
        string memory consentHash,
        bool analytics,
        bool marketing,
        bool research,
        bool sharing
    ) external userExists(userId) returns (bool) {
        userConsent[userId] = UserConsent({
            analytics: analytics,
            marketing: marketing,
            research: research,
            sharing: sharing,
            consentHash: consentHash,
            lastUpdated: block.timestamp
        });
        
        emit ConsentUpdated(
            userId,
            consentHash,
            analytics,
            marketing,
            research,
            sharing,
            block.timestamp
        );
        return true;
    }
    
    /**
     * @dev Verify a user (Admin only)
     * @param userId User's unique identifier
     * @param verified Verification status
     */
    function verifyUser(
        string memory userId,
        bool verified
    ) external onlyOwner userExists(userId) returns (bool) {
        verifiedUsers[userId] = verified;
        
        emit UserVerified(userId, verified, block.timestamp);
        return true;
    }
    
    /**
     * @dev Get user verification details
     * @param userId User's unique identifier
     * @return isRegistered Whether user is registered
     * @return profileHash User's profile hash
     * @return registrationTime When the user was registered
     */
    function getUserVerification(
        string memory userId
    ) external view returns (bool isRegistered, string memory profileHash, uint256 registrationTime) {
        UserProfile memory user = users[userId];
        return (user.isRegistered, user.profileHash, user.registrationTime);
    }
    
    /**
     * @dev Get user consent preferences
     * @param userId User's unique identifier
     * @return analytics Consent for analytics
     * @return marketing Consent for marketing  
     * @return research Consent for research
     * @return sharing Consent for data sharing
     * @return consentHash Hash of consent data
     */
    function getUserConsent(
        string memory userId
    ) external view userExists(userId) returns (
        bool analytics,
        bool marketing,
        bool research,
        bool sharing,
        string memory consentHash
    ) {
        UserConsent memory consent = userConsent[userId];
        return (
            consent.analytics,
            consent.marketing,
            consent.research,
            consent.sharing,
            consent.consentHash
        );
    }
    
    /**
     * @dev Check if user is registered
     * @param userId User's unique identifier
     * @return Whether the user is registered
     */
    function isUserRegistered(string memory userId) external view returns (bool) {
        return users[userId].isRegistered;
    }
    
    /**
     * @dev Check if user is verified
     * @param userId User's unique identifier
     * @return Whether the user is verified
     */
    function isUserVerified(string memory userId) external view returns (bool) {
        return verifiedUsers[userId];
    }
    
    /**
     * @dev Get user profile details
     * @param userId User's unique identifier
     * @return profile UserProfile struct
     */
    function getUserProfile(
        string memory userId
    ) external view userExists(userId) returns (UserProfile memory profile) {
        return users[userId];
    }
    
    /**
     * @dev Emergency function to update contract owner
     */
    function transferOwnership(address newOwner) public override onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        super.transferOwnership(newOwner);
    }
}