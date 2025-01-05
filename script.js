document.addEventListener('DOMContentLoaded', ()=>{
    const currnetMoment = new Date();
    const body = document.getElementsByTagName('body')[0];
    const logoContainer = document.getElementById('logo-container');
    const outlineLogo = document.getElementById("outline-logo");
    const originalLogo = document.getElementById('original-logo')
    const nav = document.getElementsByTagName('nav')[0];
    const copyrightYear = document.getElementById('copyright-year');

    const modal = document.getElementById('modal');
    const modalFilter = document.getElementById('modal-filter');
    const closeBtn = document.getElementById('close-btn');
    const shoppingCart = document.getElementById('shopping-cart');
    const shoppingCartIcon = document.getElementById('shopping-cart-icon');
    const shoppingCartDetails = document.getElementById('shopping-cart-details');
    const burgerMenu = document.getElementsByClassName('burger-menu')[0];
    const closedBurger = document.getElementById('closed-burger');
    const openedBurger = document.getElementById('opened-burger');
    const openedMenu = document.getElementById('menu-opened');

    const menuItems = document.getElementsByClassName('menu-item');
    const menuDetailsBox = document.getElementById('menu-details');

    copyrightYear.innerText = currnetMoment.getFullYear();


    function triggerMenu(){
        if(closedBurger.classList.contains('visible')){
            closedBurger.classList.remove('visible');
            openedBurger.classList.add('visible');
            openedMenu.classList.add('visible');
            body.classList.add('no-scroll');
        } else {
            openedBurger.classList.remove('visible');
            closedBurger.classList.add('visible');
            openedMenu.classList.remove('visible');
            body.classList.remove('no-scroll');
        }
    }
    
    function triggerNavbarStyle(condition){
        if (condition){
            nav.classList.add("nav-scrolled");
            outlineLogo.classList.remove('visible');
            originalLogo.classList.add('visible');
        } else{
            nav.classList.remove("nav-scrolled");
            outlineLogo.classList.add('visible');
            originalLogo.classList.remove('visible');
        }
    }
    
    async function renderMenuContent(service) {
        try {
            const response = await fetch("./services.json");
            const data = await response.json();
            const selectedElement = data.find(element => element[service])

            if(selectedElement[service].quote){
                menuDetailsBox.innerHTML = `<div>
                <h2>${selectedElement[service].title.toUpperCase()}</h2>
                <h3>${selectedElement[service].subTitle}</h3>
                <div class="service-steps"> ` + 

                `<div class="stepsBox">` + 
                
                selectedElement[service].steps.map(step => {
                    return ` <div id="tab${step.step}" class="menu-tab">
                     <span>${step.step}</span>
                     <p>${step.stepTitle}</p>
                     <div class="ticker light-grey"></div>
                    </div>
                    `
                    }).join('') + 

                    `</div>` + 

                    `<div class="tabContentBox light-grey">` + 

                    selectedElement[service].steps.map(step => {
                        return ` <div id="tab${step.step}-content" class="tabContent">
                        ${step.stepDescription}
                        </div>
                        `
                        }).join('')  + 

                    `</div>
                    </div>
                    <div class="imageBtnBox">
                    <button class="menu-btn">FREE QUOTE</button>
                    <div class="menu-img-container">
                        <img src="${selectedElement[service].image}" alt="">
                    </div>
                    </div>
                    </div>`
            } else{
                menuDetailsBox.innerHTML = `<div class=contactBox>
                <h2>${selectedElement[service].title.toUpperCase()}</h2>
                <h2>${selectedElement[service].subTitle.toUpperCase()}</h2>
                <h3>${selectedElement[service].description}</h3>
                </div>
                `
            }
            

                    const tabsContent = Array.from(document.getElementsByClassName('tabContent'));
                    const menuTabs = Array.from(document.getElementsByClassName('menu-tab'));
                    menuTabs[0].classList.add('current-step');
                    tabsContent[0].classList.add('show');
                    menuTabs.forEach(tab => {
                        tab.addEventListener('mouseenter', ()=>{
                            menuTabs.forEach(tab => tab.classList.remove('current-step'));
                            tabsContent.forEach(element => element.classList.remove('show'));
                            tab.classList.add('current-step');
                            tabsContent[menuTabs.indexOf(tab)].classList.add('show');

                        })
                    })

        } catch (error) {
            console.error(error)
        }
    }

    function showModal(){
        modal.classList.add('visible');
        modal.addEventListener('click', (e)=>{
            if (e.target.contains(modalFilter) ) {
                modal.classList.remove('visible');
            }
        })
        closeBtn.addEventListener('click', ()=>{
            modal.classList.remove('visible');
        })
    }

    document.getElementById('quote-from-scratch').addEventListener('click', ()=>{
        showModal();
    })

    body.addEventListener('click', (e)=>{
        if (!shoppingCart.contains(e.target) ) {
            shoppingCartDetails.classList.remove('visible');
        }
    })

    logoContainer.addEventListener('click', ()=>{
        window.location.href = 'index.html'
    })

    shoppingCartIcon.addEventListener('mouseenter', ()=>{
        shoppingCartDetails.classList.add('visible');
    })
    shoppingCartIcon.addEventListener('click', ()=>{
        shoppingCartDetails.classList.add('visible');
    })

    burgerMenu.addEventListener('click', () => {
        triggerMenu();
        if(window.scrollY < 1){
            triggerNavbarStyle(openedMenu.classList.contains('visible'));
        }
    })
    const menuLiItems = Array.from(menuItems).map(element => element.parentElement);
    renderMenuContent(menuLiItems[0].firstChild.innerText.replace(menuLiItems[0].firstChild.innerText[0], menuLiItems[0].firstChild.innerText[0].toLowerCase()).split(" ").join(''));
    menuLiItems.forEach(element => element.addEventListener('mouseenter', (event)=>{
        menuLiItems.forEach(element => element.classList.remove('selected'))
        element.classList.add('selected');
        renderMenuContent(element.firstChild.innerText.replace(element.firstChild.innerText[0], element.firstChild.innerText[0].toLowerCase()).split(" ").join(''));
    }))

    
    window.addEventListener('scroll', function() {
        triggerNavbarStyle(window.scrollY > 0);
    });
})



