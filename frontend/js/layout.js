const navbar = document.getElementById('nav-div')
const footer = document.getElementById('footer-div')

const navbarHTML = `<header class="mb-auto">
        <div>
          <a class="nav-link" href="./index.html">
            <h1 class="float-md-start mb-0">TIPP sheet</h1>
          </a>
          <nav class="nav nav-masthead justify-content-center float-md-end">
            <a class="nav-link" href="./select-practice.html">Practice</a>
            <a class="nav-link" href="./journey-month.html">My Journey</a>
            <a class="nav-link" href="./account.html">My Account</a>
          </nav>
        </div>
      </header>`

const footerHTML = ` <footer class="mt-auto">
        <a>&copy; 2026 TIPPSheet.com</a>
        <a>|</a>
        <a>All rights reserved</a>
        <!-- Aligned to end -->
        <ul class="list-inline">
          <li class="list-inline-item">
            call the national mental health hotline at
            <a href="tel:988">988</a>.
          </li>
          <li class="list-inline-item">
            text the crisis text line at <a href="sms:741741">741741</a>.
          </li>
        </ul>
      </footer>`

navbar.outerHTML = navbarHTML;
footer.outerHTML = footerHTML;