//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract votingSystem{
    struct Voter{
        string mail;
        string dest;
    }

    struct Candidate{
        string name;
        uint total;
    }
    
    mapping(uint => Voter) public voters;
    mapping(uint => Candidate)public candidates;

    uint public voterId = 0;
    uint public candidateId= 0;

    constructor(){
        addCandidate("Tom");
        addCandidate("Alice");
        addCandidate("Bob");
    }

    function addCandidate(string memory _name) public {
        candidates[candidateId] = Candidate(_name, 0);
        candidateId++;
    }

    function vote(string memory _mail, string memory _dest) public {
        voters[voterId] = Voter(_mail,_dest);
        voterId ++;
    }

    function total()public{
        clear();
        for (uint i = 0; i<candidateId; i++){
            for(uint j = 0; j<voterId; j++){
                if(keccak256(bytes(voters[j].dest)) == keccak256(bytes(candidates[i].name))){
                    candidates[i].total ++;
                }
            }
        }
    }
    
    function clear() internal {
        for(uint i=0; i< candidateId; i++){
            candidates[i].total = 0;
        }
    }
}