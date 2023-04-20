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
    deleteDoc,
    onSnapshot,
    setDoc
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
// as soon as page loads get data from database and create boards


let numOfBoards = 0;
let BoardsInDatabase = 0;


window.onload = function () {
    createBoardsFromDB()

};



function createBoardsFromDB() {

    const colRef = collection(db, 'Boards')
    const q = query(colRef, orderBy("bTitle"));

    onSnapshot(q, (querySnapshot) => {
        BoardsInDatabase = querySnapshot.size;
        console.log(BoardsInDatabase)
        querySnapshot.forEach((doc) => {
            addBoard(doc.id)
            console.log('Board loaded, board ID =>', doc.id)

        })

    })

}


const addBoardBtn = document.getElementById("add-board-btn")
if (addBoardBtn){
    addBoardBtn.addEventListener("click", function (e) {
        console.log('click add board')
        e.preventDefault(); // stops default action
        addNewBoard()
    })
}



function addNewBoard() {

    const boardRef = collection(db, "Boards");
    addDoc(boardRef, {
        bTitle: `Board ${numOfBoards}`,
    })
        .then((docRef) => {
            console.log("Board created with ID: ", docRef.id);
            addBoard(docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}



function addBoard(id) {
    console.log('Boards in Database', BoardsInDatabase)
    console.log('Boards Created in Window', numOfBoards)
    numOfBoards++
    if (numOfBoards <= BoardsInDatabase) {
        // Create a new board element
        

        const newBoard = document.createElement('div');
        newBoard.classList.add('board');



        // Add the buttons to the new board
        let HTML = `
    <div class="container" style="margin: auto;">
      <ul class="collapsible z-depth-0 tickets" style="border: none;" id="TicketList" data-collapsible="accordion">
        <!-- TICKETS FROM DATABASE GET PUT IN MODULE AND STORED HERE -->
      </ul>
      <!-- Add Ticket Button -->
      <button class="btn btn-sm btn-outline-secondary modal-trigger modal-btn"
        data-target="modal-addTicket">Add Ticket</button>
      <!-- Delete Ticket Button -->
      <!--<button class="btn btn-sm btn-outline-secondary modal-trigger modal-btn" 
        data-target="modal-deleteTicket">Delete Ticket</button>-->
      <!-- Delete Board Button -->
        <button class="btn btn-sm btn-outline-secondary delete-board-btn" 
        id="delete-board-btn">DELETE BOARD</button>
    </div>
  `;
        newBoard.innerHTML = HTML
        // Add the new board element to the board container
        const boardContainer = document.getElementById('board-container');
        boardContainer.appendChild(newBoard);
        newBoard.dataset.boardId = id;


        // Add event listeners to the new buttons
        const addTicketBtn = newBoard.querySelector('.modal-btn[data-target="modal-addTicket"]');
        const deleteTicketBtn = newBoard.querySelector('.modal-btn[data-target="modal-deleteTicket"]');
        const deleteBoardBtn = newBoard.querySelector('.delete-board-btn');

        // Add an event listener to the delete button that removes the board from the DOM
        deleteBoardBtn.addEventListener('click', function (event) {
            event.preventDefault(); // stops default action
            const boardElement = event.target.closest('.board');
            const boardId = boardElement.dataset.boardId;
            const boardRef = doc(db, 'Boards', boardId);
            console.log('board id', boardRef);
            deleteBoard(boardRef, boardElement);
        });

        addTicketBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const boardElement = event.target.closest('.board');
            const boardId = boardElement.dataset.boardId;
            const boardRef = doc(db, 'Boards', boardId);
            console.log('board id', boardRef);
            const getInfo = document.getElementById('addTicket-form');
            createNewTicket(getInfo, boardId);
        });

        // deleteTicketBtn.addEventListener('click', function (event) {
        //     event.preventDefault();
        //     // get the modal element by its id
        //     const addTicketModal = document.getElementById("modal-deleteTicket");
        //     // set the display property to block to show the modal
        //     addTicketModal.style.display = "block";
        // });



        const ticketList = newBoard.querySelector('#TicketList')
        viewTicketList(ticketList, id)
        M.Collapsible.init(ticketList);
        


    }


}

function deleteBoard(board, elem) {
    elem.remove();
    deleteDoc(board);
}

//===========================================Create Ticket========================================
function createNewTicket(getInfo, boardId) {

    const boardRef = doc(db, "Boards", boardId);

    getInfo.addEventListener('submit', (e) => {
        e.preventDefault()
        // Create a new ticket object
        const newTicket = {
            title: getInfo.title.value,
            priority: getInfo.priority.value,
            description: getInfo.description.value,
        }
        console.log(newTicket)
        // Add the new ticket to the tickets collection under the board document in Firestore
        addDoc(collection(boardRef, "Tickets"), newTicket)
            .then(() => {
                console.log("Ticket added to Firestore!");
                getInfo.reset()
                const modal = getInfo
                M.Modal.getInstance(modal).close(); // close the modal
            })
            .catch((error) => {
                console.error("Error adding ticket to Firestore: ", error);
            });
    });
}





//================================================================================================





//=======================ADD NEW USER AFTER SUBMIT BUTTON IS PRESSED==============================
//####function creatNewAccount(username, password, email)####

const signupForm = document.querySelector('#signup-form'); // get entire signup form and its contents
if (signupForm) {
    signupForm.addEventListener('submit', (e) => { // once form is sumbited with button press
        e.preventDefault(); // prevents default action

        //get user info
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        console.log(email, password);

        createUserWithEmailAndPassword(auth, email, password).then(cred => {
            console.log('user just signed up: ', cred); // console will display user that just signed in if worked correctly
            signupForm.reset(); // reset signup form delared above

           // window.location.href = "dashboard.html";

           // window.location.href = "dashboard.html";


            
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
onAuthStateChanged(auth, user => {
    if (user) { // If there is a user currently logged in
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
if (logout) {
    logout.addEventListener('click', (e) => {
        e.preventDefault(); // stops default action

        signOut(auth).then(() => {

        })
    })
}


//================================================================================================

//===========================================SIGN IN==============================================
// function authenticateCredentials(username, password);
//signin
const loginForm = document.querySelector('#login-form')
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();


        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        console.log(email, password);

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

function viewTicketList(placeToAdd, id) {
    // create refrence to collection
    const colRef = collection(db, 'Boards/' + id + '/Tickets')
    const q = query(colRef, orderBy("priority"));
    // get collection data
    getDocs(q) // getDocs returns a snapshot
        .then((snapshot) => { // when a snapshot is recived
            let tickets = []
            snapshot.docs.forEach(doc => {
                tickets.push({ ...doc.data(), id: doc.id })
            });
            setupTickets(tickets);
        })
        .catch(err => {
            console.log(err.message)
            setupTickets([]);
        })

    //setup tickets
    const setupTickets = (data) => { // get snapshot
        if (data.length != 0) {
            let html = ""; // plank template to append html
            data.forEach(doc => { // go through snapshot. return each doc as a element
                const tickets = doc // det data from doc
                // create html code with elements from data base
                const li = `              
        <li>
            <div class="center-align collapsible-header grey lighten-4 ">Priority: ${tickets.priority} ${tickets.title}</div>
            <div class="collapsible-body white">${tickets.description}</div>
        </li>
        `;
                html += li // append each data
            });
            placeToAdd.innerHTML = html; // add to Html file from abve defined place


        } else {
            placeToAdd.innerHTML = '<h5 class ="center-align">THERE ARE NO TICKETS</h5>'
        }
    }
}



//================================================================================================
// function viewTicketDetails(ticket);



// function editTicketDetails(ticket, newDetails);

//===========================================Delete Ticket========================================
// function deleteTicket(ticket);
const DTicketForm = document.querySelector('#deleteTicket-form')
const DTicketModal = document.querySelector('#modal-deleteTicket')

DTicketForm.addEventListener('submit', (e) => {
    e.preventDefault() // stops page from refreshing

    const docRef = doc(db, 'Tickets', DTicketForm.id.value)
    deleteDoc(docRef)
        .then(() => {
            DTicketForm.reset()
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

