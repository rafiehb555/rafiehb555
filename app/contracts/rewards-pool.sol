// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RewardsPool is Ownable {
    IERC20 public ehbgcToken;
    
    // SQL Level weights (multiplied by 100 for precision)
    mapping(string => uint256) public sqlWeights;
    
    // Franchise role modifiers (multiplied by 100 for precision)
    mapping(string => uint256) public franchiseModifiers;
    
    // Loyalty multipliers (multiplied by 100 for precision)
    mapping(uint256 => uint256) public loyaltyMultipliers;
    
    // Validator info
    struct Validator {
        uint256 stakedAmount;
        uint256 stakingStartTime;
        string sqlLevel;
        string franchiseRole;
        uint256 loyaltyYears;
        bool isActive;
    }
    
    mapping(address => Validator) public validators;
    
    // Events
    event ValidatorRegistered(address indexed validator, uint256 stakedAmount);
    event RewardDistributed(address indexed validator, uint256 amount);
    event ValidatorDeactivated(address indexed validator);
    
    constructor(address _ehbgcToken) {
        ehbgcToken = IERC20(_ehbgcToken);
        
        // Initialize SQL weights
        sqlWeights["Free"] = 0;
        sqlWeights["Basic"] = 30;
        sqlWeights["Normal"] = 60;
        sqlWeights["High"] = 90;
        sqlWeights["VIP"] = 100;
        
        // Initialize franchise modifiers
        franchiseModifiers["Sub"] = 2;
        franchiseModifiers["Master"] = 3;
        franchiseModifiers["Corporate"] = 5;
        
        // Initialize loyalty multipliers
        loyaltyMultipliers[1] = 5;  // 0.5%
        loyaltyMultipliers[2] = 10; // 1.0%
        loyaltyMultipliers[3] = 11; // 1.1%
    }
    
    function registerValidator(
        uint256 _stakedAmount,
        string memory _sqlLevel,
        string memory _franchiseRole
    ) external {
        require(_stakedAmount >= 1000 ether, "Insufficient stake amount");
        require(validators[msg.sender].stakedAmount == 0, "Already registered");
        
        validators[msg.sender] = Validator({
            stakedAmount: _stakedAmount,
            stakingStartTime: block.timestamp,
            sqlLevel: _sqlLevel,
            franchiseRole: _franchiseRole,
            loyaltyYears: 0,
            isActive: true
        });
        
        emit ValidatorRegistered(msg.sender, _stakedAmount);
    }
    
    function calculateReward(address _validator) public view returns (uint256) {
        Validator memory validator = validators[_validator];
        require(validator.isActive, "Validator not active");
        
        // Base reward calculation
        uint256 baseReward = validator.stakedAmount * 5 / 100; // 5% base reward
        
        // Apply SQL weight
        uint256 sqlWeight = sqlWeights[validator.sqlLevel];
        baseReward = baseReward * sqlWeight / 100;
        
        // Apply franchise modifier
        uint256 franchiseMod = franchiseModifiers[validator.franchiseRole];
        baseReward = baseReward * (100 + franchiseMod) / 100;
        
        // Apply loyalty multiplier
        uint256 loyaltyMult = loyaltyMultipliers[validator.loyaltyYears];
        baseReward = baseReward * (100 + loyaltyMult) / 100;
        
        return baseReward;
    }
    
    function distributeReward(address _validator) external onlyOwner {
        uint256 reward = calculateReward(_validator);
        require(reward > 0, "No reward available");
        
        require(
            ehbgcToken.transfer(_validator, reward),
            "Reward transfer failed"
        );
        
        emit RewardDistributed(_validator, reward);
    }
    
    function deactivateValidator(address _validator) external onlyOwner {
        require(validators[_validator].isActive, "Already inactive");
        validators[_validator].isActive = false;
        emit ValidatorDeactivated(_validator);
    }
    
    function updateLoyaltyYears(address _validator, uint256 _years) external onlyOwner {
        require(validators[_validator].isActive, "Validator not active");
        validators[_validator].loyaltyYears = _years;
    }
} 