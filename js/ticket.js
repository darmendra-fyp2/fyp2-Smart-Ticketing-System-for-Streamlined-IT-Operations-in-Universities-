// Reference to Firestore and Auth
const db = firebase.firestore();
const auth = firebase.auth();

// Convert image file to Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// Submit ticket function
async function submitTicket() {
    const title = document.getElementById('ticketTitle').value;
    const category = document.getElementById('ticketCategory').value;
    const description = document.getElementById('ticketDesc').value;
    const imageInput = document.getElementById('ticketImage');

    if (!title || !category || !description) {
        alert("Please fill all fields");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        alert("User not logged in");
        return;
    }

    let imageBase64 = "";
    if (imageInput.files.length > 0) {
        try {
            imageBase64 = await getBase64(imageInput.files[0]);
        } catch (err) {
            console.error(err);
            alert("Failed to read image");
            return;
        }
    }

    db.collection("tickets").add({
        userId: user.uid,
        title,
        category,
        description,
        status: "Pending", // default status
        imageBase64: imageBase64,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert("Ticket submitted successfully!");
        loadTickets(); // reload tickets

        // Clear form
        document.getElementById('ticketTitle').value = '';
        document.getElementById('ticketCategory').value = '';
        document.getElementById('ticketDesc').value = '';
        document.getElementById('ticketImage').value = '';
    })
    .catch(err => {
        console.error(err);
        alert("Error submitting ticket");
    });
}

// Load tickets for current user
function loadTickets() {
    const user = auth.currentUser;
    if (!user) return;

    db.collection("tickets")
      .where("userId", "==", user.uid)
      .orderBy("timestamp", "desc")
      .get()
      .then(snapshot => {
          const tbody = document.getElementById('ticketsTableBody');
          tbody.innerHTML = ""; // clear table
          snapshot.forEach(doc => {
              const data = doc.data();
              const row = document.createElement('tr');

              // Title
              const titleCell = document.createElement('td');
              titleCell.innerText = data.title;
              row.appendChild(titleCell);

              // Status dropdown
              const statusCell = document.createElement('td');
              const select = document.createElement('select');
              ['Pending', 'In Progress', 'Resolved'].forEach(s => {
                  const option = document.createElement('option');
                  option.value = s;
                  option.text = s;
                  if (data.status === s) option.selected = true;
                  select.appendChild(option);
              });
              select.onchange = () => updateStatus(doc.id, select.value);
              statusCell.appendChild(select);
              row.appendChild(statusCell);

              // Category
              const categoryCell = document.createElement('td');
              categoryCell.innerText = data.category;
              row.appendChild(categoryCell);

              // Description
              const descCell = document.createElement('td');
              descCell.innerText = data.description;
              row.appendChild(descCell);

              // Image
              const imgCell = document.createElement('td');
              if (data.imageBase64) {
                  const img = document.createElement('img');
                  img.src = data.imageBase64;
                  img.className = "ticket-img";
                  imgCell.appendChild(img);
              } else {
                  imgCell.innerText = "No image";
              }
              row.appendChild(imgCell);

              // Created At
              const timeCell = document.createElement('td');
              timeCell.innerText = data.timestamp ? data.timestamp.toDate().toLocaleString() : '';
              row.appendChild(timeCell);

              tbody.appendChild(row);
          });
      })
      .catch(err => console.error(err));
}

// Update ticket status in Firestore
function updateStatus(ticketId, newStatus) {
    db.collection("tickets").doc(ticketId).update({
        status: newStatus
    }).then(() => {
        console.log(`Ticket ${ticketId} status updated to ${newStatus}`);
    }).catch(err => console.error("Failed to update status:", err));
}

// Load tickets when user logs in
auth.onAuthStateChanged(user => {
    if (user) {
        loadTickets();
    } else {
        // Not logged in
        window.location = "index.html";
    }
});
