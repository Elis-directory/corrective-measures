let account = {
	UserID: 0,
	Role: "",
	Email: "",
	Password: "",
	
	createAccount: function(role, email, password) {
    		this.UserID++;
		this.Role = role;
		this.Email = email;
		this.Password = password;
		console.log("Account created successfully");
  	},
}
  
	addAccount: function(account) {
    	// implementation for adding a new account to the system
  	},

  	updateAccount: function(id, updatedAccountInfo) {
    	// implementation for updating an existing account
 	},
  	
	getAccount: function(account) {
    	// implementation for getting an account by its properties
  	},
  	
	deleteAccount: function(account) {
    	// implementation for deleting an account from the system
  	},

  	retrieveTicketList: function(account) {
    	// implementation for retrieving a list of tickets associated with an account
  	}
};
