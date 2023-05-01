//instanciate Pop Up Modals
document.addEventListener('DOMContentLoaded', function () {
    // get all modals
    var elems = document.querySelectorAll('.modal');
    //init them
    M.Modal.init(elems)
});

// Sidebar toggle function
const sidebarToggle = () => {
	document.body.classList.toggle('sidebar-open')
}

// Sidebar trigger
const sidebarTrigger = document.getElementById('main-header__sidebar-toggle')

// Add the event listener for the sidebar toggle
sidebarTrigger.addEventListener('click', sidebarToggle)



// Sidebar collapse function
const sidebarCollapse = () => {
	document.body.classList.toggle('sidebar-collapsed')
}

// Sidebar trigger
const sidebarCollapseTrigger = document.getElementById('sidebar__collapse')

// Add the event listener for the sidebar toggle
sidebarCollapseTrigger.addEventListener('click', sidebarCollapse)



// Theme switcher function
const switchTheme = () => {
	// Get root element and data-theme value
	const rootElem = document.documentElement
	let dataTheme = rootElem.getAttribute('data-theme'),
		newTheme

	newTheme = (dataTheme === 'light') ? 'dark' : 'light'

	// Set the new HTML attribute
	rootElem.setAttribute('data-theme', newTheme)

	// Set the new local storage item
	localStorage.setItem("theme", newTheme)
}

// Add the event listener for the theme switcher
document.querySelector('#sidebar__theme-switcher').addEventListener('click', switchTheme)


const dashboardLink = document.getElementById('dashboard-link');
const ticketLink = document.getElementById('ticket-link');
const teamsLink = document.getElementById('teams-link');
const userLink = document.getElementById('user-link');
const activityLink = document.getElementById('activity-link');
var mainContent = document.getElementById('main-content');



dashboardLink.addEventListener('click', showDashboardContent);
ticketLink.addEventListener('click', showTicketContent);
teamsLink.addEventListener('click', showTeamsContent);
userLink.addEventListener('click', showUserContent);
activityLink.addEventListener('click', showActivityContent);



function showDashboardContent() {
 
  mainContent.innerHTML = '<iframe style="height: 100%; width: 100% " src="storyboard.html"></iframe>';
}





function showTicketContent() {

  mainContent.innerHTML = '<h1>Tickets</h1><p>This is Ticket content.</p>';
}






function showTeamsContent() {
 
  mainContent.innerHTML = '<h1>Manage Teams</h1><p>This is the Manage Teams content.</p>';
}





function showUserContent() {
  
  mainContent.innerHTML = '<h1>user management</h1><p>This is the user management content.</p>';
}


function showActivityContent() {
 
  mainContent.innerHTML = '<h1>User Activity</h1><p>This is the User Activity content.</p>';
}






