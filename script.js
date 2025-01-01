const currnetMoment = new Date();

const outlineLogo = document.getElementById("outline-logo");
const originalLogo = document.getElementById('original-logo')
const nav = document.getElementsByTagName('nav')[0];
const copyrightYear = document.getElementById('copyright-year');

document.addEventListener('DOMContentLoaded', ()=>{
    copyrightYear.innerText = currnetMoment.getFullYear();
})

window.addEventListener('scroll', function() {
    if (window.scrollY > 0){
        nav.classList.add("nav-scrolled");
        outlineLogo.classList.remove('visible');
        originalLogo.classList.add('visible');
    } else{
        nav.classList.remove("nav-scrolled");
        outlineLogo.classList.add('visible');
        originalLogo.classList.remove('visible');
    }
});