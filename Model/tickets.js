let ticket = {
	TicketID: 0,
	UserID: 0,
	Priority: 0,
	Severity: 0,
	Title: "",
	Summary: "",
	Details: "",
	Comments: [],
  	Responsibility: "",
  	Date: "",
  

	createTicket: function(title, priority, severity, summary, details, comments, responsibility, date) {
   	 // implementation for creating a new ticket
  	},
  	
	retrieveTicket: function(id) {
   	// implementation for retrieving a ticket by ID
  	},

  	deleteTicket: function(id) {
    	// implementation for deleting a ticket by ID
  	},

  	addComment: function(id, comment) {
    	// implementation for adding a comment to a ticket
  	},

  	updateSummary: function(id, updatedInformation) {
    	// implementation for updating the summary of a ticket
  	},

  	updateDetails: function(id, updatedDetails) {
    	// implementation for updating the details of a ticket
  	},

  	setPriority: function(id, priority) {
    	// implementation for setting the priority of a ticket
  	},

  	assignTasks: function(accountId) {
    	// implementation for assigning tasks to a user account
  	}
};

