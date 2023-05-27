// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Betapp {
    uint public minimumBet;
    uint public totalBetsOne;
    uint public totalBetsTwo;
    address public owner;

    struct Player {
        uint amountBet;
        uint teamSelected;
        address playerAddress;
    }

    mapping(address => Player) public playerInfo;
    address[] public players;

    constructor() {
        owner = msg.sender;
        minimumBet = 0.01 ether;
    }

    function bet(uint _teamSelected) public payable {
        require(msg.value >= minimumBet);
        require(_teamSelected == 1 || _teamSelected == 2);

        Player storage player = playerInfo[msg.sender];
        player.amountBet += msg.value;
        player.teamSelected = _teamSelected;
        player.playerAddress = msg.sender;

        players.push(msg.sender);

        if (_teamSelected == 1) {
            totalBetsOne += msg.value;
        } else {
            totalBetsTwo += msg.value;
        }
    }

    function distributePrizes(uint _winningTeam) public {
        require(msg.sender == owner);
        require(_winningTeam == 1 || _winningTeam == 2);

        uint totalBets = totalBetsOne + totalBetsTwo;

        // Calculate the number of winning players
        uint numWinners = 0;
        for (uint i = 0; i < players.length; i++) {
            if (playerInfo[players[i]].teamSelected == _winningTeam) {
                numWinners++;
            }
        }

        // Calculate the prize amount per winner
        uint prizePerWinner = numWinners > 0 ? totalBets / numWinners * 2 : 0;

        // Loop through the players and transfer their winnings
        for (uint j = 0; j < players.length; j++) {
            address playerAddress = players[j];
            Player memory player = playerInfo[playerAddress];
            if (player.teamSelected == _winningTeam) {
                uint playerPrize = prizePerWinner > 0 ? player.amountBet * prizePerWinner / 2 / totalBetsOne * totalBets : player.amountBet;
                payable(playerAddress).transfer(playerPrize);
            }
            delete playerInfo[playerAddress];
        }

        // Reset the state variables
        delete players;
        totalBetsOne = 0;
        totalBetsTwo = 0;
    }
}
