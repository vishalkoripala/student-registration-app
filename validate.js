document.getElementById("registrationForm").addEventListener("submit", function (event) {
  let valid = true;

  // Full name validation
  const name = document.getElementById("fullname").value.trim();
  if (name.length < 3) {
    document.getElementById("nameError").style.display = "block";
    valid = false;
  } else {
    document.getElementById("nameError").style.display = "none";
  }

  // Email validation
  const email = document.getElementById("email").value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    document.getElementById("emailError").style.display = "block";
    valid = false;
  } else {
    document.getElementById("emailError").style.display = "none";
  }

  // Password validation
  const password = document.getElementById("password").value;
  if (password.length < 6) {
    document.getElementById("passwordError").style.display = "block";
    valid = false;
  } else {
    document.getElementById("passwordError").style.display = "none";
  }

  // Age validation
  const age = document.getElementById("age").value;
  if (age < 10 || age > 100) {
    document.getElementById("ageError").style.display = "block";
    valid = false;
  } else {
    document.getElementById("ageError").style.display = "none";
  }

  // Phone validation
  const phone = document.getElementById("phone").value;
  if (!/^[0-9]{10}$/.test(phone)) {
    document.getElementById("phoneError").style.display = "block";
    valid = false;
  } else {
    document.getElementById("phoneError").style.display = "none";
  }

  if (!valid) {
    event.preventDefault(); // Prevent form submission
  }
});
