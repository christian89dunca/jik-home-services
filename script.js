let currentQuoteStep = 0;

const currentQuote = {
    serviceTitle: [],
    timeline: "",
    personalDetails:{}
};

document.addEventListener('DOMContentLoaded', async ()=>{
    const currnetMoment = new Date();
    const body = document.getElementsByTagName('body')[0];
    const logoContainer = document.getElementById('logo-container');
    const outlineLogo = document.getElementById("outline-logo");
    const originalLogo = document.getElementById('original-logo')
    const nav = document.getElementsByTagName('nav')[0];
    const copyrightYear = document.getElementById('copyright-year');

    const modal = document.getElementById('modal');
    const modalFilter = document.getElementById('modal-filter');
    const modalCloseBtn = document.getElementById('close-btn');
    const modalQuoteContent = document.getElementById('quoting-current-step-content');
    const modalBtns = document.getElementsByClassName('modal-btn');
    const quoteSteps = document.getElementsByClassName('quote-step');
    const shoppingCart = document.getElementById('shopping-cart');
    const shoppingCartIcon = document.getElementById('shopping-cart-icon');
    const shoppingCartDetails = document.getElementById('shopping-cart-details');
    const burgerMenu = document.getElementsByClassName('burger-menu')[0];
    const closedBurger = document.getElementById('closed-burger');
    const openedBurger = document.getElementById('opened-burger');
    const openedMenu = document.getElementById('menu-opened');

    const menuItems = document.getElementsByClassName('menu-item');
    const menuDetailsBox = document.getElementById('menu-details');

    const services = await fetchServices();

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
    async function fetchServices() {
        try {
            const response = await fetch("./services.json");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error)
        }   
    }
    
    function renderMenuContent(service) {
        const allServices = [];
        services.forEach(categ => {
            Object.values(categ).forEach(el=> allServices.push(el));
        });
        const allServicesFlat = allServices.flat();
        // console.log(allServicesFlat);

        const serviceFlat = allServicesFlat.find(element => element[service]);
        
        // console.log(allServicesFlat[service]);
        
        if(serviceFlat[service].quote){
            menuDetailsBox.innerHTML = `<div>
            <h2>${serviceFlat[service].title.toUpperCase()}</h2>
            <h3>${serviceFlat[service].subTitle}</h3>
            <div class="service-steps"> ` + 

            `<div class="stepsBox">` + 
            
            serviceFlat[service].steps.map(step => {
                return ` <div id="tab${step.step}" class="menu-tab">
                    <span>${step.step}</span>
                    <p>${step.stepTitle}</p>
                    <div class="ticker light-grey"></div>
                </div>
                `
                }).join('') + 

                `</div>` + 

                `<div class="tabContentBox light-grey">` + 

                serviceFlat[service].steps.map(step => {
                    return ` <div id="tab${step.step}-content" class="tabContent">
                    ${step.stepDescription}
                    </div>
                    `
                    }).join('')  + 

                `</div>
                </div>
                <div class="imageBtnBox">
                <button class="menu-btn btn-dark">FREE QUOTE</button>
                <div class="menu-img-container">
                    <img src="${serviceFlat[service].image}" alt="">
                </div>
                </div>
                </div>`
        } else{
            menuDetailsBox.innerHTML = `<div class=contactBox>
            <h2>${serviceFlat[service].title.toUpperCase()}</h2>
            <h2>${serviceFlat[service].subTitle.toUpperCase()}</h2>
            <h3>${serviceFlat[service].description}</h3>
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
    }

    function showModal(){
        modal.classList.add('visible');
        updateModalBtns();
        renderQuoteSteps();
        modal.addEventListener('click', (e)=>{
            if (e.target.contains(modalFilter) ) {
                modal.classList.remove('visible');
            }
        })
        modalCloseBtn.addEventListener('click', ()=>{
            modal.classList.remove('visible');
        })
    }

    function updateSteps(e){
        currentQuoteStep = e.target.id === "next" ? ++currentQuoteStep : --currentQuoteStep;
        document.getElementById('indicator').style.width = (100/3) * currentQuoteStep + '%';
        updateModalBtns();
        renderQuoteSteps();
        Array.from(quoteSteps).forEach((step, index) => {
            step.classList[`${(index <= currentQuoteStep ? 'add' : 'remove')}`]('active');
        })
    }

    function updateModalBtns(){

        if(currentQuoteStep <= 0) {
            currentQuoteStep = 0;
            document.getElementById('back').style.visibility = "hidden";
            document.getElementById('next').style.display = "block";
        } else if(currentQuoteStep >= 3)  {
            document.getElementById('next').style.display = "none";
            document.getElementById('send').style.display = "block";
            document.getElementById('back').style.visibility = "visible";
        } else { 
            document.getElementById('next').style.display = "block";
            document.getElementById('send').style.display = "none";
            document.getElementById('back').style.visibility = "visible";
        }
    }

    function selectForQuote(className){
        const options = Array.from(document.getElementsByClassName(className));
        if(className === "service-option"){
            options.forEach((option) => option.addEventListener('click', (e)=>{
                if(e.target === option && !option.classList.contains('selected')){
                    option.classList.add('selected');
                    currentQuote.serviceTitle.push(e.target.innerText)
    
                } else{
                    option.classList.remove('selected')
                    currentQuote.serviceTitle.splice(currentQuote.serviceTitle.indexOf(e.target.innerText), 1)
                }
            }));
        }
        if(className === "timeline-option"){
            options.forEach((option) => option.addEventListener('click', (e)=>{
                if(e.target === option && !option.classList.contains('selected')){
                    options.forEach(option => option.classList.remove('selected'));
                    option.classList.add('selected');
                    currentQuote.timeline = e.target.innerText;
                } else{
                    option.classList.remove('selected')
                    currentQuote.timeline = '';
                }
            }));
        } 
        if(className = 'quote-input'){
            options.forEach('change', () => {
                console.log('asdasd');
            })
        }
    }

    function renderQuoteSteps(){
        switch (currentQuoteStep) {
            case 0: 
                modalQuoteContent.innerHTML = `
                <h2>Select all the services you need</h2>
                <div class="modal-main-content">
                    <div class="all-services">` +

                    services.map((service, index) => {
                        if(index < (services.length - 1)){
                            return `
                            <h3>${Object.keys(service).join('').split(/(?=[A-Z])/).map(el => el[0].toUpperCase() + el.slice(1)).join(' ')}</h3>
                            <div class="service-options-group">
                                ` + 
                                Array.from(service[Object.keys(service).join('')]).map(el => {
                                    return `
                                        <div class="service-option">${el[Object.keys(el)].title}</div>
                                        `
                                }).join('')
                                +
                                `
                            </div>
                        `
                        }
                    }).join('');
                    +
                `</div>`
    
                selectForQuote('service-option');
                
                break;
            case 1: 
                modalQuoteContent.innerHTML = `
                    <h2>When do you want us to start?</h2>
                    <div class="modal-main-content">
                        <div class="timeline-options-group">
                            <div class="timeline-option">Urgent</div>
                            <div class="timeline-option">In the next 2-3 days</div>
                            <div class="timeline-option">Sometimes this week or the next</div>
                            <div class="timeline-option">Over a week</div>
                        </div>
                    </div>
                `
                
                selectForQuote('timeline-option');
                break;
            case 2: 
                modalQuoteContent.innerHTML = `
                    <h2>How can we contact you?</h2>
                    <div class="modal-main-content">
                        <div class="contact-form">                       
                            <div class="form-container">
                                <input
                                id="fullName"
                                class="quote-input"
                                type="text"
                                placeholder="Full Name"
                                required
                                />
                                <div>
                                    <input id="email" class="quote-input" type="email" placeholder="e-mail" required />
                                    <input
                                        id="phone"
                                        class="quote-input"
                                        type="phone"
                                        placeholder="Phone Number"
                                        required
                                    />
                                </div>
                                <input
                                    id="address"
                                    class="quote-input"
                                    type="text"
                                    placeholder="Address"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                `
                selectForQuote('quote-input');
                break;
              case 3: 
                modalQuoteContent.innerHTML = `
                    <h2>One last check</h2>
                `;
          }
    }
    
    document.getElementById('quote-from-scratch').addEventListener('click', ()=>{
        showModal();
    })

    Array.from(modalBtns).forEach(btn => {
        btn.addEventListener('click', updateSteps);
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



