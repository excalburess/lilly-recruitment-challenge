
async function fetchMedicines() {
    try{
        //fetching logic held here
        const response = await fetch('http://localhost:8000/medicines');
        if(!response.ok) {
            throw new Error('Server error: ${response.status');
            }
            const data = await response.json();
            renderMedicineList(data.medicines)
        }catch(error) {
            console.error("Error fetching data ", error);
            alert("An error occured while fetching data")
        }

}
//multiple medicine elements
function renderMedicineList (medicines) {
    const medicineList = document.getElementById("medicine-list");
    if(!medicineList){
        console.error("Medicine list container not found");
        return;
    }
    //creates DOM beforehand for scalability to add to live DOM when needed
    const fragment = document.createDocumentFragment();

    medicines.forEach((medicine) => {
        const item = createMedicineElement(medicine);
        fragment.appendChild(item);
    });

    medicineList.innerHTML = ""; //clear already existing html
    medicineList.appendChild(fragment);
}

async function handleFormSubmit(event) {
    event.preventDefault(); 
    const form = event.target; //allows js to handle form submit
    const nameInput = form.querySelector("#medicine-name");
    const priceInput = form.querySelector("#medicine-price");
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    const nameRegex = /^[a-zA-Z\s]+$/;

    //error handling
    if (!name) {
        alert("Please enter a valid medicine name.");
        return;
    }
    if (!nameRegex.test(name)) {
        alert("Medicine name can only contain letters and spaces.");
        return;
    }
    if (isNaN(price) || price <= 0) {
        alert("Please enter a valid positive price.");
        return;
    }
    //sends data to backend
    try {
        const response = await fetch('http://localhost:8000/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                //indicates form encoded data
            },
            body: new URLSearchParams({ name, price }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.json();
        alert(result.message);
        fetchMedicines(); //refreshes entry
        form.reset(); //clean input field
    } catch (error) {
        console.error("Error submitting form: ", error);
        alert("An error occurred while adding the medicine.");
    }
}
// Attach event listener to the form
function setupFormListener() {
    const form = document.getElementById("medicine-form");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    } else {
        console.error("Medicine form not found!");
    }
}
//ensures setup function only runs after DOM fully loaded
document.addEventListener("DOMContentLoaded", () => {
    setupFormListener(); 
});

//creating single medicine element + error handling
function createMedicineElement(medicine){
    const item = document.createElement("div");
    item.classList.add('medicine-item');

    const name = medicine.name && medicine.name.trim() ? medicine.name : "Unknown Medicine";
    const price = medicine.price !== null && !isNaN(medicine.price) ? `$${medicine.price.toFixed(2)}` : "Unknown Price";

    //table logic
    item.innerHTML = `
        <h3>${name}</h3>
        <p>Price: ${price}</p>
    `;
    return item;
}
fetchMedicines();