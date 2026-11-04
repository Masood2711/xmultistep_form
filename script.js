//step1:store the current progress

let currentStep=1;

let selectedPlan=null;

let isYearly=false;

const selectedAddons = new Set();

//step 2: store subcription plan prices

const plans={
    Arcade:{
        monthly:9,
        yearly:90
    },

    Advance:{
        monthly:12,
        yearly:120
    },

    Pro:{
        monthly:15,
        yearly:150
    }
};


//step3: Store  add-on prices

const addons={
    online:{
        name: "Online Services",
        monthly:1,
        yearly:10
    },
    storage:{
        name: "Larger Storage",
        monthly:2,
        yearly:20
    },
    profile:{
        name: "Customizable Prices",
        monthly:2,
        yearly:20
    }
}

//Get HTML elements

const steps= document.querySelectorAll(".form-step");

const indicators= document.querySelectorAll(".step-indicator");

const backButton= document.getElementById("back-button");

const nextButton=document.getElementById("next-button");

const confirmButton= document.getElementById("confirm-button");

const nameInput =document.querySelector('input[name="userName"]');

const emailInput =document.querySelector('input[name="email"]');

const phoneInput =document.querySelector('input[name="phone"]');

const billingToggle=document.getElementById("billing-toggle");


//Show the current form step

function showStep(stepNumber){
    currentStep=stepNumber;

    steps.forEach(function(step){
        step.classList.toggle(
            "active",
            Number(step.dataset.step)=== stepNumber
        )
    });

    //highlight the current sidebar step
    indicators.forEach(function(indicator){
        indicator.classList.toggle(
            "active",
            Number(indicator.dataset.step)=== Math.min(stepNumber,4)
        )
    });

    //Hide Go Back on the first and final screens
    backButton.style.visibility= stepNumber === 1 || stepNumber === 5 ?"hidden":"visible";

    // Show Next Step until the summary screen
    nextButton.style.display = stepNumber <= 4 ? "block" : "none";

     // Change button text on the summary screen
    nextButton.textContent = stepNumber === 4 ? "Confirm" : "Next Step";

    // Use Next Step as the Confirm button
    confirmButton.style.display = "none";

    // Highlight the button on the summary screen
    nextButton.classList.toggle("confirm-state", stepNumber === 4);

     // Update summary whenever Step 4 is displayed
     if (stepNumber === 4) {
        updateSummary();
    }
}

// Step6: display validation error

function showError(input, errorElement, message){
    //Display the error message
    errorElement.textContent=message;
    //add red border to input
    input.classList.add("invalid");
    //mark the input as invalid
    input.setAttribute("aria-invalid","true");
}

//Step7 : Remove validation error

function clearError(input,errorElement){
    //Remove the error message
    errorElement.textContent="";
    //remove red border
    input.classList.remove("invalid");
    //Remove invalid status
    input.removeAttribute("aria-invalid");
}

//step8:Validate personal info 

// Validate personal information

function validatePersonalInfo() {

    let isValid = true;

    // Get error elements
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const phoneError = document.getElementById("phone-error");

    // Get user input values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Clear previous errors
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
    clearError(phoneInput, phoneError);


    // Validate name
    if (name === "") {

        showError(nameInput, nameError, "Enter your name");

        isValid = false;
    }


    // Validate email
    if (email === "") {

        showError(emailInput, emailError, "Enter email");

        isValid = false;

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        showError(
            emailInput,
            emailError,
            "Enter a valid email address"
        );

        isValid = false;
    }


    // Validate phone number
    if (phone === "") {

        showError(
            phoneInput,
            phoneError,
            "Enter your mobile number"
        );

        isValid = false;

    } else if (!/^[0-9+()\s-]{7,20}$/.test(phone)) {

        showError(
            phoneInput,
            phoneError,
            "Enter a valid phone number"
        );

        isValid = false;
    }


    // Return validation result
    return isValid;
}

//step9:Validate plan selection

function validatePlan(){
    //get the plan error message element
    const planError=document.getElementById("plan-error");

    //check whether the user selected a plan
    if(selectedPlan ===null){
        //display error message
        planError.textContent="Please select a plan";

        return false;
    }
    //if a plan is selected , remove error
    planError.textContent="";
    return true;
}

//step10: get correct price

function getPrice(item){
    return isYearly? item.yearly : item.monthly;
}

//sstep11: get billing duration
function getDuration(){
    return isYearly? "yr" : "mo";
}

//step12: format the price

function formatPrice(price){
    return "$"+price+"/"+getDuration();
}

//step13: update plan card prices

function updatePlanPrices(){
    document.querySelectorAll(".plan_card").forEach(function (card){
        //get planname from html
        const planName=card.dataset.plan;

        //get price details of that plan
        const plan=plans[planName];

        //display the correct monthly or yearly price
        card.querySelector(".plan-price").textContent=formatPrice(getPrice(plan));

        //display yearly benefit
        card.querySelector(".yearly-benefit").textContent=isYearly?"2 months free":"";
        
        //highlight the selected plan
        card.classList.toggle("selected",selectedPlan===planName);

        //update selected status
        card.setAttribute("aria-pressed",selectedPlan===planName?"true":"false");
    });

    //highlight monthly or yearly label
    document.getElementById("monthly-label").classList.toggle("active",!isYearly);

    document.getElementById("yearly-label").classList.toggle("active",isYearly);
}


//step14: update add on prices

function updateAddonPrices(){
    // find all add-on cards
    document.querySelectorAll(".addon_card").forEach(function (card){
        //find the checkbox 
        const input=card.querySelector('input[name="addons"]');

        //get add-on details
        const addon=addons[input.value];

        //display the correct price
        card.querySelector(".addon-price").textContent="+"+formatPrice(getPrice(addon));
    })
}

//step15: update the order summary

function updateSummary(){
    //check whether a plan has been selected
    if(!selectedPlan){
        return;
    }

    //get the selected plan details
    const plan=plans[selectedPlan];

    //get the selected plan price
    const planPrice=getPrice(plan);

    //display selected plan name 
    document.getElementById("summary-plan-name").textContent=selectedPlan+"("+(isYearly?"Yearly":"Monthly")+")";

    //display selected plan price
    document.getElementById("summary-plan-price").textContent=formatPrice(planPrice);

    //find the summary add-on container
    const summaryAddons=document.getElementById("summary-addons");

    //clear previous add-on rows
    summaryAddons.innerHTML="";

    //initially , the total is the plan price
    let total=planPrice;

    //go through every selected add on
    selectedAddons.forEach(function(addonKey){
        //get selected add-on details
        const addon=addons[addonKey];
        //get its price
        const addonPrice=getPrice(addon);

        //add the add-on price to the total
        total=total+addonPrice;

        //create a new summary row
        const row=document.createElement("div");

        row.className="summary-addon";
        //create the add-on name

        const name=document.createElement("span");

        name.textContent=addon.name;

        //create the add-on price
        const price=document.createElement("span");

        price.textContent = "+" +formatPrice(addonPrice);

        //put the name and price inside the row

        row.appendChild(name);

        row.appendChild(price);

        //put the rows inside summary container
        summaryAddons.appendChild(row);
    })

    //display the total label
    document.getElementById("summary-total-label").textContent="Total (per "+(isYearly?"year":"month")+")";

    //display the final total
    document.getElementById("summary-total").textContent=formatPrice(total);
}

//handle plan selection

document.querySelectorAll(".plan_card").forEach(function (card){

    //listen for clicks on each plan card
    card.addEventListener("click",function(){

        //store the selected plan name
        selectedPlan=card.dataset.plan;

        //remove plan selecion error
        document.getElementById("plan-error").textContent="";

        //update plan card designs
        updatePlanPrices();

    });
})

//step17: handle monthly and yearly billing

billingToggle.addEventListener("change",function(){

    //check whether the switch is turned on
    isYearly=billingToggle.checked; 

    //update three plan prices
    updatePlanPrices();

    //update the three add-on prices
    updateAddonPrices();
})

// Step 18: Handle add-on selection

document.querySelectorAll('input[name="addons"]').forEach(function (input) {

    // Listen for changes to each checkbox
    input.addEventListener("change", function () {

        // Check whether the checkbox is selected
        if (input.checked) {

            // Add the selected add-on
            selectedAddons.add(input.value);

        } else {

            // Remove the add-on if it is unchecked
            selectedAddons.delete(input.value);

        }

    });

});

// Step 19: Handle Next Step button

// Handle Next Step button

nextButton.addEventListener("click", function () {

    // Validate personal information
    if (currentStep === 1 && !validatePersonalInfo()) {
        return;
    }

    // Validate plan selection
    if (currentStep === 2 && !validatePlan()) {
        return;
    }

    // If the user is on Summary, show Thank You
    if (currentStep === 4) {
        showStep(5);
        return;
    }

    // Move to the next step
    if (currentStep < 4) {
        showStep(currentStep + 1);
    }

});


// Step 20: Handle Go Back button

backButton.addEventListener("click", function () {

    // Check whether the user can go back
    if (currentStep > 1 && currentStep <= 4) {

        // Display the previous step
        showStep(currentStep - 1);

    }

});


// Step 21: Handle Change Plan button

document.getElementById("change-plan").addEventListener("click", function () {

    // Take the user back to Step 2
    showStep(2);

});

// Step 22: Handle Confirm button

confirmButton.addEventListener("click", function () {

    // Display the Thank You screen
    showStep(5);

});

// Step 23: Clear validation errors while typing

nameInput.addEventListener("input", function () {

    clearError(
        nameInput,
        document.getElementById("name-error")
    );

});


emailInput.addEventListener("input", function () {

    clearError(
        emailInput,
        document.getElementById("email-error")
    );

});


phoneInput.addEventListener("input", function () {

    clearError(
        phoneInput,
        document.getElementById("phone-error")
    );

});


// Step 24: Initialize the application

// Display monthly plan prices
updatePlanPrices();

// Display monthly add-on prices
updateAddonPrices();

// Show the first step
showStep(1);