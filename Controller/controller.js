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
    where,
    getDocs,
    orderBy,
    addDoc,
    deleteDoc,
    onSnapshot,
    setDoc,
    updateDoc, 
    FieldValue,
    arrayUnion,
    arrayRemove
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";



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
class User {
    constructor(email = '', teamID = '', userID = '', username = '') {
      this.email = email;
      this.teamID = teamID;
      this.userID = userID;
      this.username = username;
    }
  
    getEmail() {
      return this.email;
    }
  
    setEmail(email) {
      this.email = email;
    }
  
    getTeamID() {
      return this.teamID;
    }
  
    setTeamID(teamID) {
      this.teamID = teamID;
    }
  
    getUserID() {
      return this.userID;
    }
  
    setUserID(userID) {
      this.userID = userID;
    }
  
    getUsername() {
      return this.username;
    }
  
    setUsername(username) {
      this.username = username;
    }

    displayAll() {
        console.log("cUser Contents: ", this.getUserID(), this.getEmail(), this.getUsername(), this.getTeamID())
    }
}
const cUser = new User();


//     if (user) {
//       // User is signed in
//       const userDocRef = doc(db, 'Users', user.uid);
//       const userDocSnapshot = getDoc(userDocRef);
//       if (userDocSnapshot.exists()) {
//         const userData = userDocSnapshot.data();
//         cUser.setEmail(userData.email);
//         cUser.setTeamID(userData.teamID);
//         cUser.setUserID(userData.userID);
//         cUser.setUsername(userData.username);
//         cUser.displayAll();
//       } else {
//         console.log('User document does not exist');
//       }
//     }
// });

// as soon as page loads get data from database and create boards
let numOfBoards = 1;
let BoardsInDatabase = 0;
document.addEventListener('DOMContentLoaded', async function() {
    let teamID;
    
    // Wait for cUser to have a non-null TeamID value
    while (!(teamID = cUser.getTeamID())) {
        await new Promise((resolve) => setTimeout(resolve, 100));

    }
    
    //When a board gets updated
    const colRef = collection(db, `Teams/${cUser.getTeamID()}/Boards/`)
    const q = query(colRef, orderBy("bTitle"));
    onSnapshot(q, (querySnapshot) => {
        BoardsInDatabase = querySnapshot.size;
        
        createBoardsFromDB(querySnapshot)
    })
});


async function createBoardsFromDB(qSH) {
    let teamID;
    
    // Wait for cUser to have a non-null TeamID value
    while (!(teamID = cUser.getTeamID())) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    qSH.forEach((doc) => {
        const data = doc.data(); // retrieve plain JavaScript object representing the document
       
        addBoard(doc.id, data.bTitle)
        
    })
}


const addBoardBtn = document.getElementById("add-board-btn")
if (addBoardBtn) {
    addBoardBtn.addEventListener("click", async function (e) {
        e.preventDefault(); // stops default action
        await addNewBoard()
        location.reload()
        
    })
}



async function addNewBoard() {
    let teamID;
    
    // Wait for cUser to have a non-null TeamID value
    while (!(teamID = cUser.getTeamID())) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    // get refrence to all boards on database
    const boardRef = collection(db, `Teams/${cUser.getTeamID()}/Boards/`);
    // add board to database
    await addDoc(boardRef, {
        // make the board title 'Board' and current number of bords
        bTitle: `New Board`,
    }).then((docRef) => {
       
        // create new boad on site with id created from firestore
        const newBoardRef = doc(db, `Teams/${cUser.getTeamID()}/Boards/${docRef.id}`);
        getDoc(newBoardRef).then((doc) => {
            const boardTitle = doc.data().bTitle;
           
            // create new board on site with id created from Firestore
            addBoard(docRef.id, boardTitle);
        });
        //location.reload()
    }).catch((error) => {
        console.error("Error adding Board to database: ", error);
    });
    
   
}



async function addBoard(id, boardTitle) {
    let teamID;
    // Wait for cUser to have a non-null TeamID value
        while (!(teamID = cUser.getTeamID())) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    if(numOfBoards <= BoardsInDatabase){
        numOfBoards++
        
    
        // Create a new board element

        //create new board div
        const newBoard = document.createElement('div');
        //give it class of board
        newBoard.classList.add('board');

        // Add the buttons to the new board
        let HTML = `
                <div class="container" style="margin: auto;">
                <textarea id="board-title" class="board-title" rows="5" cols="40" maxlength="10">${boardTitle}</textarea>
                <ul id="TicketList" class="ticket-list">
                    <!-- TICKETS FROM DATABASE GET PUT IN MODULE AND STORED HERE -->
                </ul>
                <!-- Add Ticket Button -->
                <button class="btn btn-sm btn-outline-secondary modal-trigger modal-btn"
                    data-target="modal-addTicket">Add Ticket</button>
                <!-- Delete Board Button -->
                    <button class="btn btn-sm btn-outline-secondary delete-board-btn" 
                    id="delete-board-btn">DELETE BOARD</button>
                </div>
            `;
        // place html inside of new board
        newBoard.innerHTML = HTML
        // Add the new board element to the board container
        const boardContainer = document.getElementById('board-container');

        // place new board at the end of board container
        if (boardContainer) {
            boardContainer.appendChild(newBoard);
        }

        // board id gets stored as the id inputted to fuction
        newBoard.dataset.boardId = id;


        // Add event listeners to the new buttons
        const addTicketBtn = newBoard.querySelector('.modal-btn[data-target="modal-addTicket"]');
        const boardT = newBoard.querySelector('#board-title');
        const deleteBoardBtn = newBoard.querySelector('.delete-board-btn');

        // Add an event listener to the delete button that removes the board from the DOM
        deleteBoardBtn.addEventListener('click', function (event) {
            event.preventDefault(); // stops default action
            const boardElement = event.target.closest('.board');
            const boardId = boardElement.dataset.boardId;
            const boardRef = doc(db, `Teams/${cUser.getTeamID()}/Boards/${boardId}`);
            
            deleteBoard(boardRef, boardElement);
        });

        addTicketBtn.addEventListener('click', async function (event) {
            event.preventDefault();
            const boardElement = event.target.closest('.board');
            const boardId = boardElement.dataset.boardId;
            const boardRef = doc(db, `Teams/${cUser.getTeamID()}/Boards/${boardId}`);
            
            const getInfo = document.getElementById('addTicket-form');
            const modal = document.getElementById('modal-addTicket')

            createNewTicket(modal, getInfo, boardId);
        });

        //if there is a board with a title on the page
        if (boardT) {
            //if input feild is changed
            boardT.addEventListener("input", async function () {
                //get refence to the board on firebase to update title
                const titleRef = doc(db, `Teams/${cUser.getTeamID()}/Boards/${id}`);
                
                // get the board document
                await getDoc(titleRef).then((docSnap) => {
                    // if sucessful
                    if (docSnap.exists()) {
                        // change board title to what is in textbox 
                        setDoc(titleRef, {
                            bTitle: boardT.value
                        }).then(() => {
                            
                            console.log('Document successfully updated! new title is', boardT.value );
                        })
                            .catch((error) => {
                                console.error('Error updating document: ', error);
                            });
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.error("Error getting document:", error);
                });
            });
        }
        // get ticket list from new created board
        const ticketList = newBoard.querySelector('#TicketList')
        // call fucntion to display tickets on screen
        viewTicketList(ticketList, id)
        
    }
    
    
}

async function deleteBoard(board, elem) {
    // remove board from html
    await elem.remove();
    // remove board from firebase
    await deleteDoc(board);
    await numOfBoards--
    await location.reload()
}

//===========================================Show Tickets On Site===================================
//placeToAdd: html in board to display ticket list in
//Board ID: ID of board in firebase to get tickets from

async function viewTicketList(placeToAdd, BoardId) {
    // Wait for cUser to have a non-null TeamID value
    let teamID;
    while (!(teamID = cUser.getTeamID())) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // create reference to ticket list associated with the board
    const colRef = collection(db, `Teams/${cUser.getTeamID()}/Boards/${BoardId}/Tickets`);

    // order tickets by priority
    const q  = query(colRef, orderBy("priority"));

    try {
        // get collection data
        const snapshot = await getDocs(q);

        // set tickets to be an empty list
        let tickets = [];

        // for each ticket, push it into the ticket list
        snapshot.docs.forEach(doc => {
            tickets.push({ ...doc.data(), id: doc.id });
        });

        // call setupTickets function with created list of sorted tickets
        setupTickets(tickets);
    } catch (err) {
        // else display error
        setupTickets([]);
        console.log(err.message);
    }
    
    async function setupTickets(data) {
        // create an empty div to store created modals for each ticket HTML
        const modals = document.createElement('div');
        if (data.length !== 0) {
            // placeholder for html code
            let html = "";
            let uname = "";
            // go through each ticket
            data.forEach(async(ticket) => {
                
                // make modal id to link to current ticket
                const modalId = "modal-" + ticket.id;


                // ticket items holds what is in the modal
                const ticketItems = `
                    <div class="modal-content">
                        <h4 class="ticket-modal-title">Ticket Info</h4>
                        <br/>
                        <form id="ticket-form${ticket.id}" class="ticket-form" data-ticket-id="${ticket.id}">
                            <div class="ticket-field" id="ticket-field">
                                <label for="modal-ticket-title${ticket.id}">Title:</label>
                                <textarea id="modal-ticket-title${ticket.id}" name="title" class="ticket-modal-components 
                                modal-ticket-title">${ticket.title}</textarea>
                                <br />

                                <label for="modal-ticket-priority${ticket.id}">Priority:</label>
                                <textarea id="modal-ticket-priority${ticket.id}" name="priority" class="ticket-modal-components 
                                modal-ticket-priority">${ticket.priority}</textarea>

                                <br />
                                <label for="modal-ticket-description${ticket.id}">Description:</label>
                                <textarea id="modal-ticket-description${ticket.id}" name="description" class="ticket-modal-components 
                                modal-ticket-description">${ticket.description}</textarea>

                                <br />
                                <label for="modal-ticket-created${ticket.id}">User Who Created Ticket</label>
                                <textarea id="modal-ticket-created${ticket.id}" name="created" class="ticket-modal-components 
                                modal-ticket-created" disabled >${ticket.createdBy}</textarea>

                                <!-- Delete Ticket Button -->
                                <button class="ticket-modal-btn btn btn-sm btn-outline-secondary delete-ticket" 
                                data-ticket-id="${ticket.id}" id="delete-ticket">Delete Ticket</button>
                                
                                <!-- Save Changes Button -->
                                <button class="ticket-modal-btn btn btn-sm btn-outline-secondary save-changes" 
                                data-ticket-id="${ticket.id}" id="save-changes" style="display:none;">Save Changes</button>
                            </div>
                        </form>
                    </div>
                `;

                // li holds the ticket title and displays them as buttons in dashboard
                const li = `              
                  <li>
                    <div>
                      <button class="modalBtnStyle modal-trigger modal-btn" id="ticketToClick${ticket.id}"
                        data-target="${modalId}">${ticket.title}
                      </button>
                    </div>
                  </li>
                `;

                // append ticket list into html
                html += li;
                
                // create modal and place ticket info in modal code with associated id
                modals.innerHTML += `<div id="${modalId}" class="modal myModalStyling">${ticketItems}</div>`;
                document.body.appendChild(modals);
                M.Modal.init(document.querySelectorAll('.modal'), {});
                // initialize modals after they are added to the DOM
                
                const deleteTicketBtns = document.querySelectorAll('.delete-ticket');
                const ticketTitle = document.querySelector('#modal-ticket-title' + ticket.id);
                const ticketPriority = document.querySelector('#modal-ticket-priority' + ticket.id);
                const ticketDescription = document.querySelector('#modal-ticket-description' + ticket.id);

                // const titleTextArea = document.querySelector(`#modal-ticket-title${ticket.id}`);
                // const priorityTextArea = document.querySelector(`#modal-ticket-priority${ticket.id}`);
                // const descriptionTextArea = document.querySelector(`#modal-ticket-description${ticket.id}`);
                // const saveChangesBtn = document.querySelector(`#save-changes[data-ticket-id="${ticket.id}"]`);
                // const ticketForm = document.querySelector('#ticket-form' + ticket.id);
                // let isChanged = false;
                
                 deleteTicketBtns.forEach((button) => {
                    button.addEventListener('click', async function (event) {
                        event.preventDefault();
                        const ticketId = button.dataset.ticketId;
                        const ticketItem = document.querySelector(`#ticketToClick${ticketId}`);

                        // get the ID of the ticket to delete
                        
                        // delete the ticket from the database
                       
                        const ticketRef = doc(db, `Teams/${cUser.getTeamID()}/Boards/${BoardId}/Tickets/${ticketId}`);
                        console.log(ticketItem)
                        ticketItem.remove()
                        await deleteDoc(ticketRef).then(() => {
                            console.log(`Ticket ${ticketId} deleted successfully`);
                            // remove the modal from the DOM
                            const modal = button.closest('.modal');
                            modal.remove();
                        }).catch((error) => {
                            console.error("Error deleting document: ", error);
                        });
                        // close the modal
                        const modal = button.closest('.modal');
                        const modalInstance = M.Modal.getInstance(modal);
                        modalInstance.close();
                    });
                });
                M.Modal.init(document.querySelectorAll('.modal'), {});
                
                if (ticketTitle) {
                    
                    //if input feild is changed
                    ticketTitle.addEventListener("input", async function () {
                        //get refence to the board on firebase to update title
                        console.log('Ticket title being changed with id of => ', ticket.id)
                        const ticketRef = await doc(db, `Teams/${cUser.getTeamID()}/Boards/${BoardId}/Tickets/${ticket.id}`);
                        
                        // get the board document
                        await getDoc(ticketRef).then((docSnap) => {
                            // if sucessful
                            if (docSnap.exists()) {
                                // change board title to what is in textbox 
                                setDoc(ticketRef, {
                                    title: ticketTitle.value,
                                    
                                }, { merge: true })
                                .then(() => {
                                    console.log('Document successfully updated! new title is', ticketTitle.value );
                                    const titleEl = document.querySelector('#ticketToClick' + ticket.id);
                                    titleEl.textContent = this.value;
                                })
                                    .catch((error) => {
                                        console.error('Error updating document: ', error);
                                    });
                            } else {
                                console.log("No such document!");
                            }
                        }).catch((error) => {
                            console.error("Error getting document:", error);
                        });
                        
                    });

                    
                }

                if (ticketPriority) {
                    //if input feild is changed
                    ticketPriority.addEventListener("input", function () {
                        //get refence to the board on firebase to update title
                        const ticketRef = doc(db, `Teams/${cUser.getTeamID()}/Boards/${BoardId}/Tickets/${ticket.id}`);

                        console.log('Ticket priority being changed with id of => ', ticket.id)
                        
                        
                   
                        // get the board document
                        getDoc(ticketRef).then((docSnap) => {
                            console.log(docSnap)
                            // if sucessful
                            if (docSnap.exists()) {
                                // change board title to what is in textbox 
                                setDoc(ticketRef, {
                                    priority: ticketPriority.value,
                                    
                                }, { merge: true })
                                .then(() => {
                                    console.log('Document successfully updated! new title is', ticketPriority.value );
                                })
                                    .catch((error) => {
                                        console.error('Error updating document: ', error);
                                    });
                            } else {
                                console.log("No such document!");
                            }
                        }).catch((error) => {
                            console.error("Error getting document:", error);
                        });
                        
                    });

                    
                }

                if (ticketDescription) {
                    //if input feild is changed
                    ticketDescription.addEventListener("input", function () {
                        //get refence to the board on firebase to update title
                        const ticketRef = doc(db, `Teams/${cUser.getTeamID()}/Boards/${BoardId}/Tickets/${ticket.id}`);

                        console.log('Ticket description being changed with id of => ', ticket.id)
                        
                        
                   
                        // get the board document
                        getDoc(ticketRef).then((docSnap) => {
                            console.log(docSnap)
                            // if sucessful
                            if (docSnap.exists()) {
                                // change board title to what is in textbox 
                                setDoc(ticketRef, {
                                    description: ticketDescription.value,
                                    
                                }, { merge: true })
                                .then(() => {
                                    console.log('Document successfully updated! new title is', ticketDescription.value );
                                })
                                    .catch((error) => {
                                        console.error('Error updating document: ', error);
                                    });
                            } else {
                                console.log("No such document!");
                            }
                        }).catch((error) => {
                            console.error("Error getting document:", error);
                        });
                        
                    });

                    
                }
             
            });
            
            // put list of ticket buttons in correct board
            placeToAdd.innerHTML = html;
        } else {
            placeToAdd.innerHTML = '<h5 class="center-align">THERE ARE NO TICKETS</h5>';
        }



    };
}

//================================================================================================


//================================================================================================


//===========================================User Class========================================


// Firestore data converter
const userConverter = {
    toFirestore: (user) => {
        return {
            name: user.userName,
            email: user.email,
            password: user.password,
            role: user.role
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(user.userName, user.email, user.password, user.role);
    }
};


//===========================================Create Ticket========================================
let isAdding = false;

async function createNewTicket(modal, getInfo, boardId) {
    if (isAdding) {
        return;
    }
    isAdding = true;
    let teamID;
    let gitI;
    // Wait for cUser to have a non-null TeamID value
    while (!(teamID = cUser.getTeamID()) && !(gitI = getInfo)) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const boardRef = doc(db, `Teams/${cUser.getTeamID()}/Boards/${boardId}`);

    const submitHandler = (e) => {
        e.preventDefault();
        // Create a new ticket object
        const newTicket = {
            createdBy: cUser.username,
            title: getInfo.title.value,
            priority: getInfo.priority.value,
            description: getInfo.description.value,
        };
        console.log(newTicket);
        // Add the new ticket to the tickets collection under the board document in Firestore
        addDoc(collection(boardRef, "Tickets"), newTicket)
            .then(() => {
                console.log("Ticket added to Firestore!");
                getInfo.reset();
                location.reload()
                M.Modal.getInstance(modal).close(); // close the modal
                getInfo.removeEventListener("submit", submitHandler); // remove the event listener
                isAdding = false;
            })
            .catch((error) => {
                console.error("Error adding ticket to Firestore: ", error);
            });
    };

    getInfo.addEventListener("submit", submitHandler);
}
//================================================================================================
const myButton = document.querySelector('#myButton');
const myModal = document.getElementById('myModal');
const close = document.querySelector('.close');
const createTeams = document.querySelector('#create-team');

if (myButton) {
  myButton.addEventListener('click', function() {
    myModal.style.display = 'block';
  });
}

if (createTeams) {
  createTeams.addEventListener('click', function(e) {
    e.preventDefault();
    createTeam();
    myModal.style.display = 'none';
  });
}

if (close) {
  close.addEventListener('click', function() {
    myModal.style.display = 'none';
  });
}


async function createTeam() {
    const teamsRef = collection(db, 'Teams');
    const newTeamRef = doc(teamsRef); // create a reference to a new Firestore document
    const newTeamId = newTeamRef.id; // get the ID of the new document
  
    try {
      await setDoc(newTeamRef, {
        docID: newTeamId,
        admin: auth.currentUser.uid, 
        chat:[],
        tickets: []
      });
      console.log('Team added to Firestore');
      console.log("THE NEW CREATED TEAM ID IS:",newTeamId);
      return newTeamId
    } catch (error) {
      console.error('Error adding team to Firestore: ', error);
    }
}

  
  
  // function createTeam() {
//   const teamsRef = collection(db, 'Teams');
//   addDoc(teamsRef, {
//     docID: teamsRef.document.id,
//     admin: auth.currentUser.uid, 
//     users:[],
//     tickets: []
//   })
//   .then(() => {
//     console.log('Team added to Firestore');
//   })
//   .catch((error) => {
//     console.error('Error adding team to Firestore: ', error);
//   });
// }
  

//=======================Create Account==============================
const signupForm = document.querySelector('#signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // get user info
        const username = signupForm['signup-username'].value;
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;

        // Create the user account in Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password).then((cred) => {
            console.log('user just signed up: ', cred);
            // Add the user's information to Firestore with a unique ID
            const usersRef = collection(db, 'Users');
            const currentUser = cred.user.uid;
            const userDocRef = doc(usersRef, currentUser);

            setDoc(userDocRef, {
                userID: currentUser,
                username: username,
                email: email,
                
            }).then(() => {
                cUser.setUserID(currentUser)
                cUser.setUsername(username)
                cUser.setEmail(email)
                console.log('User added to Firestore');
                // Add the team ID to the user's document
                //call create team function
                createTeam().then((teamID) => {
                    console.log('New team ID in addTeamID', teamID);
                    updateDoc(userDocRef, { 
                        teamID: teamID,
                    }).then(() => {
                        cUser.setTeamID(teamID)
                        console.log('Added team ID to user document');
                        // Redirect to the success page
                        //window.location.href = "dashboard.html";
                    }).catch((error) => {
                        console.error('Error updating document:', error);
                    });
                }).catch((error) => {
                    console.error('Error creating team:', error);
                });
            }).catch((error) => {
                console.error('Error adding user to Firestore: ', error);
            });
            cUser.displayAll()
            signupForm.reset();

        }).catch((error) => {

            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)

            signupForm.reset();
        });
    });
}


//================================================================================================

//=======================CHECK TO SEE IF USER IS SIGNED INTO SITE OR NOT==========================
// listen for auth status changes
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        const userDocRef = doc(db, 'Users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            cUser.setEmail(userData.email);
            cUser.setTeamID(userData.teamID);
            cUser.setUserID(userData.userID);
            cUser.setUsername(userData.username);
            cUser.displayAll();
            
        }
    } else {
        // User is signed out
        console.log('user logged out');
    }
});

//================================================================================================

//=======================CHECK TO SEE IF USER IS SIGNED INTO SITE OR NOT==========================
// function logoutUser(message);
//logout
const logout = document.querySelector('#logout'); // get logout button from nav bar
if (logout) {
    logout.addEventListener('click', (e) => {
        e.preventDefault(); // stops default action
        signOut(auth).then(() => {
            window.location.href = "index.html";
        })
    })
}
//================================================================================================


//===========================================SIGN IN==============================================
// function authenticateCredentials(username, password);
//signin
const loginForm = document.querySelector('#login-form') // refrence to login form
if (loginForm) { // if login form exists on current page
    loginForm.addEventListener('submit', (e) => { // when login form is submitted
        e.preventDefault();

        // get info from login form
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        console.log(email, password);
        
        authenticateCredentials(email, password)
    })
}

function authenticateCredentials(email, password) {
    // sign person in with inputted credentials
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

}
//================================================================================================



// function logoutUser(message);



// function directToDashboard();

// function getUserDetails();


// function viewTicketDetails(ticket);



// function editTicketDetails(ticket, newDetails);

//===========================================Delete Ticket========================================
// function deleteTicket(ticket);
// const DTicketForm = document.querySelector('#deleteTicket-form')
// const DTicketModal = document.querySelector('#modal-deleteTicket')
// if (DTicketForm) {
//     DTicketForm.addEventListener('submit', (e) => {
//         e.preventDefault() // stops page from refreshing

//         const docRef = doc(db, 'Tickets', DTicketForm.id.value)
//         deleteDoc(docRef)
//             .then(() => {
//                 DTicketForm.reset()
//             })

//     })
// }

//================================================================================================

// const addToTeamButton = document.getElementById('addToTeam');

// if (addToTeamButton) {
//   addToTeamButton.addEventListener('click', async () => {
//     const teamId = document.getElementById('teamId').value;
//     const email = document.getElementById('email').value;

//     const userRef = doc(db, 'Users', email);

//     try {
//       await updateDoc(userRef, {
//         teamID: teamId
//       });

//       console.log('User added to team successfully!');
//     } catch (error) {
//       console.error('Error adding user to team: ', error);
//     }
//   });
// }

const addButton = document.getElementById('addToTeam');
if(addButton) {
    addButton.addEventListener('click', async () => {
        const userId = document.getElementById('userId').value;
       const currentUser = auth.currentUser;
    if (currentUser) {
      

      const userDocRef = doc(db, "Users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const teamID = userDoc.data().teamID;
      console.log("Team ID: " + teamID);




        // Get a reference to the user document with the provided id
        const userRef = doc(db, 'Users', userId);
        
        try {
          // Update the user document with an empty teamID field
          await updateDoc(userRef, { teamID: teamID});
          console.log(`User with id ${userId}'s teamID has been updated.`);
        } catch (error) {
          console.error(`Error updating user with id ${userId}:`, error);
        }
    }
      });
}

//p0CSj59jhl50bWYimZSl

const deleteButton = document.getElementById('deleteFromTeam');
if(deleteButton) {
    deleteButton.addEventListener('click', async () => {
        const userId = document.getElementById('userId').value;
      
        // Get a reference to the user document with the provided id
        const userRef = doc(db, 'Users', userId);
      
        try {
          // Update the user document with an empty teamID field
          await updateDoc(userRef, { teamID: '' });
          console.log(`User with id ${userId}'s teamID has been updated.`);
        } catch (error) {
          console.error(`Error updating user with id ${userId}:`, error);
        }
      });
}


// search for ticket tab on dashboard


const searchTicketButton = document.getElementById('search-ticket');
const ticketContainer = document.getElementById('ticket-container');
if(searchTicketButton) {
searchTicketButton.addEventListener('click', async () => {
  const ticketId = document.getElementById('ticketId').value;

  const ticketRef = doc(db, 'Boards', '0AcIeQxJqAMrAnLX93K4', 'Tickets', '4ozVcjY6UmIsRqXAO4pl');


  try {
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      console.log('No such document!');
      return;
    }

    const ticketData = ticketDoc.data();

    // Clear previous ticket information in container
ticketContainer.innerHTML = '';

// Create container element for ticket information
const ticketInfo = document.createElement('div');
ticketInfo.classList.add('ticket-info');
ticketContainer.appendChild(ticketInfo);

// Create and append elements to display ticket information
const ticketTitle = document.createElement('h2');
ticketTitle.classList.add('ticket-title');
ticketTitle.textContent = ticketData.title;
ticketInfo.appendChild(ticketTitle);

const ticketPriority = document.createElement('h3');
ticketPriority.classList.add('ticket-priority');
ticketPriority.textContent = `Priority: ${ticketData.priority}`;
ticketInfo.appendChild(ticketPriority);

const ticketDescription = document.createElement('p');
ticketDescription.classList.add('ticket-description');
ticketDescription.textContent = ticketData.description;
ticketInfo.appendChild(ticketDescription);


    console.log('Ticket retrieved successfully!');
  } catch (error) {
    console.error('Error retrieving ticket: ', error);
  }
});

}

const teamsLinks = document.getElementById('search-team');
const memberContainer = document.getElementById('member-container');

if (teamsLinks) {
  teamsLinks.addEventListener("click", async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      

      const userDocRef = doc(db, "Users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const teamID = userDoc.data().teamID;
      console.log("Team ID: " + teamID);

      // create a query for all users with the same teamID
      const usersCollection = collection(db, "Users");
      const querySnapshot = await getDocs(query(usersCollection, where("teamID", "==", teamID)));
      const users = [];
      querySnapshot.forEach((doc) => {
        // push the user document data to the users array
        users.push(doc.data().email + ", " + doc.data().userID);
      });

      if (users.length != 0) {
        const ul = document.createElement('ul');
        users.forEach((user) => {
          const li = document.createElement('li');
          li.classList.add('member-2');
          li.textContent = user;
          ul.appendChild(li);
        });
        memberContainer.innerHTML = '';
        memberContainer.appendChild(ul);
        
        // add team ID to the bottom of the list
        const teamLi = document.createElement('li');
        teamLi.classList.add('team-id');
        teamLi.textContent = 'Team ID: ' + teamID;
        ul.appendChild(teamLi);
      }


    } else {
      console.error("Current user not found");
    }
  });
}

const chatbox = document.querySelector('.chatbox');
const collapseButton = document.querySelector('.collapse-button');

if(collapseButton) {
    collapseButton.addEventListener('click', () => {
        chatbox.classList.toggle('collapsed');
      });
}




const form = document.querySelector('.message-form');
const messages = document.querySelector('.messages');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const currentUser = auth.currentUser;
    if (currentUser) {
      if (input.value.trim() !== '') {
        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const teamId = userDocSnap.data().teamID;
        const message = input.value.trim();
        input.value = '';
        try {
          // Get a reference to the team document with the provided id
          const teamRef = doc(db, 'Teams', teamId);

          // Update the chat array in the team document

         
          
          await updateDoc(teamRef, {
            chat: arrayUnion({
              message: message,
              senderId: currentUser.uid
            })
          });

          console.log(`Message "${message}" has been added to the chat.`);

          // Display the entire chat array in the chat box
          const teamSnapshot = await getDoc(teamRef);
          const chat = teamSnapshot.data().chat;
          messages.innerHTML = '';
          chat.forEach((chatMessage) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (chatMessage.senderId === currentUser.uid) {
              messageElement.classList.add('sent');
            } else {
              messageElement.classList.add('received');
            }
            messageElement.innerHTML = `<p>${chatMessage.message}</p>`;
            messages.appendChild(messageElement);
          });
          messages.scrollTop = messages.scrollHeight;

        } catch (error) {
          console.error(`Error adding message "${message}" to the chat:`, error);
        }
      }
    }
  });
}




// create a query for all users with the same teamID as the current user
// 




  

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



// function sendActivationEmail(); 

// function activateAccount();

// const searchTicketButton = document.getElementById('search-ticket');
// const ticketContainer = document.getElementById('ticket-container');
// if(searchTicketButton) {
//   searchTicketButton.addEventListener('click', async () => {
//     const ticketId = document.getElementById('ticketId').value;

//     try {
//       // Query the database for the ticket with the given ID
//       const ticketQuery = query(collection(db, 'Boards'), where('Tickets.'+ticketId, '==', true));
//       const querySnapshot = await getDocs(ticketQuery);
//       if (querySnapshot.empty) {
//         console.log('No such document!');
//         return;
//       }

//       // Get the boardId that holds the ticket
//       const boardId = querySnapshot.docs[0].id;

//       // Construct the ticketRef variable using the boardId and ticketId
//       const ticketRef = doc(db, 'Boards', boardId, 'Tickets', ticketId);

//       // Retrieve the ticket data from the corresponding document
//       const ticketDoc = await getDoc(ticketRef);
//       if (!ticketDoc.exists()) {
//         console.log('No such document!');
//         return;
//       }

//       const ticketData = ticketDoc.data();

//       // Clear previous ticket information in container
//       ticketContainer.innerHTML = '';

//       // Create container element for ticket information
//       const ticketInfo = document.createElement('div');
//       ticketInfo.classList.add('ticket-info');
//       ticketContainer.appendChild(ticketInfo);

//       // Create and append elements to display ticket information
//       const ticketTitle = document.createElement('h2');}