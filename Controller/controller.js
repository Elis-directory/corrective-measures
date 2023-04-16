//=======================FIREBASE IMPORTS AND INITIALIZATION======================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { 
    getFirestore,
    collection,
    doc,
    getDoc,
    query,
    getDocs, 
    orderBy,
    addDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBxM_vt4dG48Wmf6t3FmcKNReYmgtjjDxU",
//     authDomain: "correctivemeasures-7fd32.firebaseapp.com",
//     projectId: "correctivemeasures-7fd32",
//     storageBucket: "correctivemeasures-7fd32.appspot.com",
//     messagingSenderId: "732418944057",
//     appId: "1:732418944057:web:e1846d05b462557ce331e8",
//     measurementId: "G-8M80GCH78F"
//   };

const firebaseConfig = {

  apiKey: "AIzaSyBxM_vt4dG48Wmf6t3FmcKNReYmgtjjDxU",

  authDomain: "correctivemeasures-7fd32.firebaseapp.com",

  databaseURL: "https://correctivemeasures-7fd32-default-rtdb.firebaseio.com",

  projectId: "correctivemeasures-7fd32",

  storageBucket: "correctivemeasures-7fd32.appspot.com",

  messagingSenderId: "732418944057",

  appId: "1:732418944057:web:e1846d05b462557ce331e8",

  measurementId: "G-8M80GCH78F"

};

  


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
//================================================================================================

//=======================ADD NEW USER AFTER SUBMIT BUTTON IS PRESSED==============================
//####function creatNewAccount(username, password, email)####

const signupForm = document.querySelector('#signup-form'); // get entire signup form and its contents
if(signupForm){
    signupForm.addEventListener('submit', (e) => { // once form is sumbited with button press
        e.preventDefault(); // prevents default action
        
        //get user info
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        console.log(email , password);

        createUserWithEmailAndPassword(auth, email, password).then(cred => {
            console.log('user just signed up: ', cred); // console will display user that just signed in if worked correctly
        
            
            signupForm.reset(); // reset signup form delared above
        }).catch((error) => {

            // display errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)

            signupForm.reset(); // reset signup form delared above
            // ..
        });

    })
}

//================================================================================================

//=======================CHECK TO SEE IF USER IS SIGNED INTO SITE OR NOT==========================
// listen for auth status changes
onAuthStateChanged(auth, user =>{
    if(user){ // If there is a user currently logged in
        console.log('user logged in: ', user);
        
        
    } else { // if user is not currently logged in
        console.log('user logged out');
    }
})
//================================================================================================

//=======================CHECK TO SEE IF USER IS SIGNED INTO SITE OR NOT==========================
// function logoutUser(message);
//logout
const logout = document.querySelector('#logout'); // get logout button from nav bar
if(logout){
    logout.addEventListener('click', (e) => {
        e.preventDefault(); // stops default action

        signOut(auth).then(()=>{
        
    })
})
}


//================================================================================================

//===========================================SIGN IN==============================================
// function authenticateCredentials(username, password);
//signin
const loginForm = document.querySelector('#login-form')
if(loginForm){
    loginForm.addEventListener('submit', (e) =>{
        e.preventDefault();


        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        console.log(email , password);

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            window.location.href = "dashboard.html"; // function directToDashboard();
            console.log('user login: ', user);
            loginForm.reset(); // reset signup form delared above
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            loginForm.reset(); // reset signup form delared above
        });

    })
}

//================================================================================================

// function creatNewAccount(username, password, email)

// function logoutUser(message);

// function authenticateCredentials(username, password);

// function directToDashboard();

// function getUserDetails();

//===========================================Show Tickets On Site===================================

// function viewTicketList();
//setup tickets
const ticketList = document.querySelector('#TicketList')
const setupTickets = (data) => { // get snapshot
    if(data.length != 0){
      let html = ""; // plank template to append html
      data.forEach(doc => { // go through snapshot. return each doc as a element
      const tickets = doc // det data from doc
      // create html code with elements from data base
      const li = `              
      <li>
        <div class="center-align collapsible-header grey lighten-4 ">Priority: ${tickets.Priority} ${tickets.Title}</div>
        <div class="collapsible-body white">${tickets.TDescription}</div>
      </li>
      `;
      html += li // append each data
      });
      ticketList.innerHTML = html; // add to Html file from abve defined place
    
    }else{
        ticketList.innerHTML = '<h5 class ="center-align">THERE ARE NO TICKETS</h5>'
    }
    
}
// create refrence to collection
const colRef = collection(db, 'Tickets')
const q = query(colRef, orderBy("Priority"));
// get collection data
getDocs(q) // getDocs returns a snapshot
    .then((snapshot) => { // when a snapshot is recived
        let tickets = []
        snapshot.docs.forEach(doc => {
            tickets.push({...doc.data(), id: doc.id })
        });
        console.log(tickets)
        setupTickets(tickets);
    })
    .catch(err => {
        console.log(err.message)
        setupTickets([]);
    })

//================================================================================================
// function viewTicketDetails(ticket);


//===========================================Create Ticket========================================
// function createNewTicket(ticket);
//const collection = colRef(db, 'Tickets')
const addTicketForm = document.querySelector('#addTicket-form')
addTicketForm.addEventListener('submit', (e) => {
    e.preventDefault() // stops page from refreshing
    addDoc(colRef, {
        Title: addTicketForm.title.value,
        Priority: addTicketForm.priority.value,
        TDescription: addTicketForm.description.value,
        
    }).then(()=> {
        addTicketForm.reset() // clear form
    })
    
})
//================================================================================================
// function editTicketDetails(ticket, newDetails);

//===========================================Delete Ticket========================================
// function deleteTicket(ticket);
const DTicketForm = document.querySelector('#deleteTicket-form')
DTicketForm.addEventListener('submit', (e) => {
    e.preventDefault() // stops page from refreshing

    const docRef = doc(db, 'Tickets', DTicketForm.id.value)
    deleteDoc(docRef)
        .then(() => {
            DTicketForm.reset()
            DTicketForm.modal('hide')
        
        })
      
})
//================================================================================================
// function changePassword(oldPassword, newPassword);

// function viewProjectList(accountId);

// function viewProjectDetails(projectId);

// function getTicketList(accountId);

// function getTicketDetails(ticketId);

// function updateTicketStatus(ticketId, newStatus);

// function updateTicketPriority(ticketId, newPriority);

// function assignTicketDeveloper(ticketId, accountId);

// function deleteTicket(ticketID);

// function filterTicketListByStatus(ticketList, status);

// filterTicketListByPriority(ticketList, priority);

// function sortTicketListByDate(ticketList, date);

// function getTotalTimeSpent(ticket);

// function registerUser();

// function sendActivationEmail(); 

// function activateAccount();


