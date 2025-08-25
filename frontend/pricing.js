console.log("Pricing.js loaded ✅");

// Define pricing values
const pricingData = {
  pricingPersonal: {
    weekly: "<strong>$2.00</strong> per week",
    yearly: "<strong>$83.20</strong> per year"
  },
  pricingPM: {
    weekly: "<strong>$6.00</strong> per week",
    yearly: "<strong>$249.60</strong> per year"
  },
  pricingSmallBusiness: {
    weekly: "<strong>$12.00</strong> per week",
    yearly: "<strong>$499.20</strong> per year"
  },
  pricingCorporate: {
    weekly: "<strong>$20.00</strong> per week and an additional $2.00 for each user over 20",
    yearly: "<strong>$832.00</strong> per year and an additional $80.00 for each user over 20"
  }
};


// Function to update pricing
function setPricing(id, isYearly) {
  const el = document.getElementById(id);
  if (el) {
    el.innerHTML = isYearly ? pricingData[id].yearly : pricingData[id].weekly;
  }
}


// Attach event listeners to switches

function initPricingToggles() {
  Object.keys(pricingData).forEach(pricingId => {
    // "pricingPersonal" → "switchPersonal"
    const switchId = "switch" + pricingId.replace("pricing", "");
    const switchEl = document.getElementById(switchId);

     const labelEl = document.querySelector(`label[for="${switchId}"]`);


    if (switchEl) {
      switchEl.addEventListener("change", function () {
        setPricing(pricingId, this.checked);
        // Update label text
        if (labelEl) {
          labelEl.textContent = this.checked
            ? "Switch to weekly pricing"
            : "Switch to annual pricing";
        }
      });
    }
  });
}



document.addEventListener("DOMContentLoaded", initPricingToggles);

// First version 
// document.getElementById("switchPersonal")?.addEventListener("change", function () {
//   if (this.checked) {
//     console.log("Switch Personal changed:", this.checked);
//     document.getElementById("pricingPersonal").innerHTML = "<strong>$83.20</strong> per year";
//   }
// });

// document.getElementById("switchPM")?.addEventListener("change", function () {
//   if (this.checked){
//     document.getElementById("pricingPM").innerHTML = "<strong>$249.60</strong> per year";
//   }
// });

// document.getElementById("switchSmallBusiness")?.addEventListener("change", function () {
//   if (this.checked){
//     document.getElementById("pricingSmallBusiness").innerHTML = "<strong>$499.20</strong> per year";
//   }
// });

// document.getElementById("switchCorporate")?.addEventListener("change", function () {
//   if (this.checked) {
//     document.getElementById("pricingCorporate").innerHTML = "<strong>$832.00</strong> per year and an additional $80.00 for each user over 20";
//   }
// });