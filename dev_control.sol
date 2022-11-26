// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract DevEnv{
    
    address public project_owner;
    uint public dev_count; 
    uint public update_id; 

    string live_server;
    string test_server; 

    // List of updates to come
    string[] pending_updates; 

    struct Dev{
        uint weight; // weight is accumulated by delegation
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    struct Update{
        string title; 
        string server; 
        address author;

        //keep track of votes  
        uint count_pos; 
        uint count_neg; 
        uint id; 
    } 

    mapping(address => Dev) public devsM;
    mapping(address => Dev) public devsS;
    mapping(uint => mapping(address => bool)) public voted_devs; 
    mapping(address => bool) public has_pending_update; 

    Update[] public update_list; 

    constructor  (address[] memory initial_devs) {
        project_owner = msg.sender;
        devsM[project_owner].weight = 1;
        dev_count = 1; 
        update_id = 0; 
        // initial 404 values 
        live_server = "https://ipfs.io/ipfs/QmbPfrJJtF5EggL7U3DmG4mWM2DCMehDbwqpXZkM1b4BSQ?filename=404.html"; 
        test_server = "https://ipfs.io/ipfs/QmbPfrJJtF5EggL7U3DmG4mWM2DCMehDbwqpXZkM1b4BSQ?filename=404.html";

        for(uint i = 0; i < initial_devs.length; i++){
            devsM[initial_devs[i]].weight = 1;
            dev_count += 1; 
        }
    }

    function getLiveSite() public view returns(string memory) {
        return live_server;
    }

    function getTestSite() public view returns(string memory) {
        return test_server;
    }

    ///FUNCTION TO CREATE UPDATE 
    function createUpdate (string memory _title, string memory _server) public {
        //todo: add constraint for regular dev
        require( devsM[msg.sender].weight >= 1 , "update failed, insufficent access"); 
        require(!has_pending_update[msg.sender], "update from node already in pipeline"); 
        has_pending_update[msg.sender] = true; 
        update_list.push(Update({
            author : msg.sender,
            server : _server,
            title :_title, 
            count_pos : 0, 
            count_neg : 0,
            id: update_id
        }));
        updateTestServer(); 
        update_id+=1; 
    } 

    //Get update values 
    function getUpdate() public view returns(string memory title, string memory server, address author) {
        require(update_list.length > 0, "sorry no updates right now"); 
        Update memory u = update_list[0]; 
        return(u.title, u.server, u.author); 

    }

    function vote(bool val) public {
        require(devsM[msg.sender].weight >= 1 , "vote failed, insufficent access"); 
        require(update_list.length > 0, "no site to vote for");  
        require(!voted_devs[update_list[0].id][msg.sender], "vote failed, already voted"); 

        voted_devs[update_list[0].id][msg.sender] = true; 

        if(val){
            update_list[0].count_pos += 1;  
            if (update_list[0].count_pos > (uint(dev_count)/2)){
                live_server = update_list[0].server; 
                deleteUpdate();   
                updateTestServer(); 
            }
        }
        else{
            update_list[0].count_neg += 1;
            if (update_list[0].count_neg > (uint(dev_count)/2)){
                live_server = update_list[0].server; 
                deleteUpdate();
                updateTestServer(); 
            }
        }
          
    }

    function updateTestServer() private {
        if(update_list.length > 0)
            test_server = update_list[0].server;
        else 
            test_server = "https://ipfs.io/ipfs/QmbPfrJJtF5EggL7U3DmG4mWM2DCMehDbwqpXZkM1b4BSQ?filename=404.html"; 
    }

    function deleteUpdate() private {
        has_pending_update[update_list[0].author] = false; 
        for (uint i = 0; i < update_list.length - 1; i++) {
            update_list[i] = update_list[i + 1];
        }
        update_list.pop();
    }

    function hasUpdate() public view returns (uint) {
        return update_list.length; 
    }

}