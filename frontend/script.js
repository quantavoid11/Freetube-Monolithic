document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const avatar = document.getElementById("avatar").files[0];

  // You can perform validation here

  // You can handle form submission (e.g., AJAX request) here
  // Example:

  const formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("avatar", avatar);
  fetch('http://localhost:8080/api/v1/users/register', {
    method: 'POST',
    body: formData,
    redirect: 'follow' // Follow redirects automatically
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Signup successful:', data);
    // Optionally, you can handle redirect here
    if (response.redirected) {
      window.location.href = response.url; // Redirect to the specified URL
    } else {
      // Redirect not required, handle success
      // window.location.href = '/success.html';
    }
  })
  .catch(error => {
    console.error('Error signing up:', error);
  });

});
