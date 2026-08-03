function showError(id, show) {
  document.getElementById(id).style.display = show ? 'block' : 'none';
}

function validateForm() {
  let valid = true;
  const name = document.getElementById("fullname").value.trim();
  showError('nameError', name.length < 3);
  if (name.length < 3) valid = false;

  const email = document.getElementById("email").value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  showError('emailError', !emailPattern.test(email));
  if (!emailPattern.test(email)) valid = false;

  const password = document.getElementById("password").value;
  showError('passwordError', password.length < 6);
  if (password.length < 6) valid = false;

  const age = Number(document.getElementById("age").value);
  showError('ageError', Number.isNaN(age) || age < 10 || age > 100);
  if (Number.isNaN(age) || age < 10 || age > 100) valid = false;

  const phone = document.getElementById("phone").value;
  showError('phoneError', !/^[0-9]{10}$/.test(phone));
  if (!/^[0-9]{10}$/.test(phone)) valid = false;

  const dept = document.getElementById('department').value;
  if (!dept) valid = false;

  const gender = document.querySelector('input[name="gender"]:checked');
  if (!gender) valid = false;

  const dob = document.getElementById('dob').value;
  if (!dob) valid = false;

  return valid;
}

document.getElementById("registrationForm").addEventListener("submit", function (event) {
  if (!validateForm()) {
    event.preventDefault();
  }
});

// Image preview
const fileInput = document.getElementById('profilePic');
const previewContainer = document.getElementById('previewContainer');
const previewImg = document.getElementById('previewImg');
fileInput.addEventListener('change', function () {
  const file = this.files && this.files[0];
  if (!file) {
    previewContainer.style.display = 'none';
    previewImg.src = '';
    return;
  }
  if (!file.type.startsWith('image/')) {
    previewContainer.style.display = 'none';
    previewImg.src = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
    previewContainer.style.display = 'block';
  };
  reader.readAsDataURL(file);
});
