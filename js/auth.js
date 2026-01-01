// REGISTER
function registerUser() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!email || !password) {
      alert("Please enter both email and password");
      return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Save user info in Firestore
      db.collection("users").doc(user.uid).set({
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
          alert("Registration successful!");
          window.location = "index.html"; // redirect to login
      })
      .catch((error) => {
          console.error("Error saving user to Firestore:", error);
          alert("Registration succeeded but failed to save user info.");
      });
    })
    .catch((error) => {
      alert(error.message);
    });
}

// LOGIN
function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Redirect to dashboard
      window.location = "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

// LOGOUT
function logoutUser() {
  auth.signOut().then(() => {
    window.location = "index.html";
  });
}
