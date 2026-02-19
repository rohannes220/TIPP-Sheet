const loginForm = document.getElementById('loginForm')
const signupForm = document.getElementById('signupForm')
const errorMessageP = document.getElementById('errorMessage')

if(loginForm) {

loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })

        const data = await response.json();

        console.log(data);

        if(response.ok) {
            localStorage.setItem('token', data.token);
            
            window.location.href = '/index.html';
        } else {
            errorMessageP.innerHTML = `Error logging in: ${data.message}`
        }
    } catch(error) {
        console.error("Network error: ", error);
        errorMessageP.innerHTML = `Error logging in: ${data.message}`

    }
})
}

if(signupForm) {
signupForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const firstName = document.getElementById('firstName').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    if(passwordConfirm !== password) {
        errorMessageP.innerHTML = `Error signing up: Passwords do not match`
        return;
    }
    
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, firstName, password})
        })

        const data = await response.json();

        console.log(data);

        if(response.ok) {
            localStorage.setItem('token', data.token);
            
            window.location.href = '/index.html';
        } else {
            errorMessageP.innerHTML = `Error signing up: ${data.message}`
        }
    } catch(error) {
        console.error("Network error: ", error);
        errorMessageP.innerHTML = `Error signing up: ${data.message}`

    }
})
}