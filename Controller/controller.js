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

//When a board gets updated
const colRef = collection(db, 'Boards')
const q = query(colRef, orderBy("bTitle"));
onSnapshot(q, (querySnapshot) => {
    BoardsInDatabase = querySnapshot.size;
    
    createBoardsFromDB(querySnapshot)
})

function createBoardsFromDB(qSH) {
    qSH.forEach((doc) => {
        const data = doc.data(); // retrieve plain JavaScript object representing the document
       
        addBoard(doc.id, data.bTitle)
        
    })
}


const addBoardBtn = document.getElementById("add-board-btn")
if (addBoardBtn) {
    addBoardBtn.addEventListener("click", function (e) {
        e.preventDefault(); // stops default action
        addNewBoard()
    })
}



function addNewBoard() {
    // get refrence to all boards on database
    const boardRef = collection(db, "Boards");
    // add board to database
    addDoc(boardRef, {
        // make the board title 'Board' and current number of bords
        bTitle: `Board ${numOfBoards}`,
    }).then((docRef) => {
       
        // create new boad on site with id created from firestore
        const newBoardRef = doc(db, `Boards/${docRef.id}`);
        getDoc(newBoardRef).then((doc) => {
            const boardTitle = doc.data().bTitle;
           
            // create new board on site with id created from Firestore
            addBoard(docRef.id, boardTitle);
        });
    }).catch((error) => {
        console.error("Error adding Board to database: ", error);
    });
}



function addBoard(id, boardTitle) {

    numOfBoards++
    if (numOfBoards <= BoardsInDatabase) {
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
            const boardRef = doc(db, 'Boards', boardId);
            
            deleteBoard(boardRef, boardElement);
        });

        addTicketBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const boardElement = event.target.closest('.board');
            const boardId = boardElement.dataset.boardId;
            const boardRef = doc(db, 'Boards', boardId);
            
            const getInfo = document.getElementById('addTicket-form');
            const modal = document.getElementById('modal-addTicket')

            createNewTicket(modal, getInfo, boardId);
        });

        //if there is a board with a title on the page
        if (boardT) {
            //if input feild is changed
            boardT.addEventListener("input", function () {
                //get refence to the board on firebase to update title
                const titleRef = doc(db, 'Boards', id);
                
                // get the board document
                getDoc(titleRef).then((docSnap) => {
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

function deleteBoard(board, elem) {
    // remove board from html
    elem.remove();
    // remove board from firebase
    deleteDoc(board);
}
//===========================================Show Tickets On Site===================================
//placeToAdd: html in board to display ticket list in
//Board ID: ID of board in firebase to get tickets from
function viewTicketList(placeToAdd, BoardId) {
    // create reference to ticket list associated with the board
    const colRef = collection(db, 'Boards/' + BoardId + '/Tickets')

    // order tickets by priority
    const q = query(colRef, orderBy("priority"));

    // get collection data
    getDocs(q)
        .then((snapshot) => {
            // set tickets to be an empty list
            let tickets = []
            //for eatch ticket pus it into ticket list
            snapshot.docs.forEach(doc => {
                tickets.push({ ...doc.data(), id: doc.id })
            });
            // call setupTickets function with created list of sorted tickets
            setupTickets(tickets);
        }).catch(err => {
            // else diaplay error
            setupTickets([]);
            console.log(err.message)
            
        })

    const setupTickets = (data) => {
        // create an empty div to store created modals for each ticket HTML
        const modals = document.createElement('div');

        // if there are tickets in the list
        if (data.length != 0) {
            // placeholder for html code
            let html = "";

            // go through each ticket
            data.forEach(ticket => {
                // make modal id to link to current ticket
                const modalId = "modal-" + ticket.id;
                const ticketRef = doc(db, 'Boards/' + BoardId + '/Tickets/', ticket.id);

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
                    button.addEventListener('click', function (event) {
                        event.preventDefault();
                        // get the ID of the ticket to delete
                        const ticketId = button.dataset.ticketId;
                        // delete the ticket from the database
                        const ticketRef = doc(db, `Boards/${BoardId}/Tickets/${ticketId}`);
                        deleteDoc(ticketRef).then(() => {
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
                    ticketTitle.addEventListener("input", function () {
                        //get refence to the board on firebase to update title
                        console.log('Ticket title being changed with id of => ', ticket.id)
                        
                        
                   
                        // get the board document
                        getDoc(ticketRef).then((docSnap) => {
                            console.log(docSnap)
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
                        console.log('Ticket title being changed with id of => ', ticket.id)
                        
                        
                   
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
                        console.log('Ticket title being changed with id of => ', ticket.id)
                        
                        
                   
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

            //     titleTextArea.addEventListener('input', () => {
            //         isChanged = true;
            //         saveChangesBtn.style.display = 'inline';
            //     });
                
            //     priorityTextArea.addEventListener('input', () => {
            //         isChanged = true;
            //         saveChangesBtn.style.display = 'inline';
            //     });
                
            //     descriptionTextArea.addEventListener('input', () => {
            //         isChanged = true;
            //         saveChangesBtn.style.display = 'inline';
            //     });
                
            //     saveChangesBtn.addEventListener('click', () => {
            //         if(isChanged){
            //             const ticketRef = doc(db, 'Boards/' + BoardId + '/Tickets/', ticket.id);
            //             // Save changes to database
            //             const updatedTitle = titleTextArea.value;
            //             const updatedPriority = priorityTextArea.value;
            //             const updatedDescription = descriptionTextArea.value;


            //             // Get the reference to the ticket document in Firebase
            //             console.log(ticket.id)
            //             console.log('Boards/' + BoardId + '/Tickets/' + ticket.id)
            //             console.log('TICKET REF', ticketRef.path)
                        
                   
            //             // get the board document
            //             //console.log(ticketRef)
            //             getDoc(ticketRef).then((docSnap) => {
            //                 // if sucessful
            //                 console.log(docSnap)
            //                 if (docSnap.exists()) {
            //                     // change board title to what is in textbox 
            //                     setDoc(ticketRef, {
            //                         title: updatedTitle,
            //                         priority: updatedPriority,
            //                         description: updatedDescription
            //                     }, { merge: true })
            //                     .then(() => {
            //                         console.log('Document successfully updated! new title is', updatedTitle);
            //                         console.log('Document successfully updated! new priority is', updatedPriority);
            //                         console.log('Document successfully updated! new description is', updatedDescription);
                                    
            //                         // Update the ticket information in the UI
            //                         const ticketTitle = document.querySelector('#modal-ticket-title' + ticket.id);
            //                         const ticketPriority = document.querySelector('#modal-ticket-priority' + ticket.id);
            //                         const ticketDescription = document.querySelector('#modal-ticket-description' + ticket.id);
            //                         const titleEl = document.querySelector('#ticketToClick' + ticket.id);
            //                         titleEl.textContent = updatedTitle;
                                    
            //                         ticketTitle.value = updatedTitle;
            //                         ticketPriority.value = updatedPriority;
            //                         ticketDescription.value = updatedDescription;
            //                     })
            //                     .catch((error) => {
            //                         console.error('Error updating document: ', error);
            //                     });
            //                 }
            //             }).catch((error) => {
            //                 console.error("Error getting document:", error);
            //             });

            //           isChanged = false;
            //           saveChangesBtn.style.display = 'none';
            //         }
            //     });

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


class User {
    constructor(userName, email, password, role) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    toString() {
        return this.name;
    }
}

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
function createNewTicket(modal, getInfo, boardId) {

    const boardRef = doc(db, "Boards", boardId);

    getInfo.addEventListener('submit', (e) => {
        e.preventDefault()
        // Create a new ticket object
        const newTicket = {
            createdBy: auth.currentUser.uid,
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
                M.Modal.getInstance(modal).close(); // close the modal
            })
            .catch((error) => {
                console.error("Error adding ticket to Firestore: ", error);
            });
    });
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
function createTeam() {
    const teamsRef = collection(db, 'Teams');
    const newTeamRef = doc(teamsRef); // create a reference to a new Firestore document
    const newTeamId = newTeamRef.id; // get the ID of the new document
  
    setDoc(newTeamRef, {
      docID: newTeamId,
      admin: auth.currentUser.uid, 
      users:[],
      tickets: []
    })
    .then(() => {
      console.log('Team added to Firestore');
    })
    .catch((error) => {
      console.error('Error adding team to Firestore: ', error);
    });
  }
  
  
  

//=======================Create Account==============================
const signupForm = document.querySelector('#signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // get user info
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;

        // Create the user account in Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password).then((cred) => {
            console.log('user just signed up: ', cred);

            // Add the user's information to Firestore with a unique ID
            const usersRef = collection(db, 'Users');

            addDoc(usersRef, {
                owner: cred.user.uid,
                email: email,
                password: password
            }).then(() => {
                console.log('User added to Firestore');

                // Redirect to the success page
                window.location.href = "signup-success.html";

                // After 2 seconds, redirect to the login page
                setTimeout(function() {
                    window.location.href = "login.html";
                }, 2000);
            }).catch((error) => {
                console.error('Error adding user to Firestore: ', error);
            });

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
const DTicketForm = document.querySelector('#deleteTicket-form')
const DTicketModal = document.querySelector('#modal-deleteTicket')
if (DTicketForm) {
    DTicketForm.addEventListener('submit', (e) => {
        e.preventDefault() // stops page from refreshing

        const docRef = doc(db, 'Tickets', DTicketForm.id.value)
        deleteDoc(docRef)
            .then(() => {
                DTicketForm.reset()
            })

    })
}

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



// function sendActivationEmail(); 

// function activateAccount();

