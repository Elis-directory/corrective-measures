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

let mainContent = document.getElementById('main-content');




dashboardLink.addEventListener('click', showDashboardContent);
ticketLink.addEventListener('click', showTicketContent);
teamsLink.addEventListener('click', showTeamsContent);
userLink.addEventListener('click', showUserContent);
activityLink.addEventListener('click', showActivityContent);






function showDashboardContent() {
 
  mainContent.innerHTML = '<iframe style="height: 100%; width: 100% " src="tabs/storyboard.html""></iframe>';
}


function showTicketContent() {

  
  mainContent.innerHTML = '<iframe style="height: 100%; width: 100% " src="tabs/search-ticket.html"></iframe>';
}






function showTeamsContent() {
 
  mainContent.innerHTML = '<iframe style="height: 100%; width: 100% " src="tabs/manage-teams.html"></iframe>';
}





function showUserContent() {
  
    mainContent.innerHTML = '<iframe style="height: 100%; width: 100% " src="tabs/add-member.html"></iframe>';
}


function showActivityContent() {
 
    mainContent.innerHTML = '<iframe style="height: 100%; width: 100% " src="tabs/delete-member.html"></iframe>';
}


