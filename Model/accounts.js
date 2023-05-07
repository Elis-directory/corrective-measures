let account = {
	email: "",
	teamID: "" ,
	userID: "",
	username: "", 
	usersDocIdForPath: "",
	usersTeamIdForPath: "",
	
	createAccount: function(email, teamID, userID, username, usersDocIdForPath, usersTeamIdForPath) {
    	this.email = email
		this.teamID = teamID
		this.userID = userID
		this.username = username
		this.usersDocIdForPath = usersDocIdForPath
		this.usersTeamIdForPath = usersTeamIdForPath
		console.log("Account created successfully");
  	},
}
  
// 	addAccount: function(account) {
//     	// implementation for adding a new account to the system
//   	},

//   	updateAccount: function(id, updatedAccountInfo) {
//     	// implementation for updating an existing account
//  	},
  	
// 	getAccount: function(account) {
//     	// implementation for getting an account by its properties
//   	},
  	
// 	deleteAccount: function(account) {
//     	// implementation for deleting an account from the system
//   	},

//   	retrieveTicketList: function(account) {
//     	// implementation for retrieving a list of tickets associated with an account
//   	}
// };
