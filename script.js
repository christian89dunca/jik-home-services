let currentQuoteStep = 0;

let currentQuote = {
    serviceTitle: [],
    timeline: [],
    personalDetails:{
        fullName: '',
        email: '',
        phone: '',
        address: '',
        state: '',
        zipcode: ''
    },
    result: 4
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
    const banner = document.getElementById('project-banner');

    const menuItems = document.getElementsByClassName('menu-item');
    const menuDetailsBox = document.getElementById('menu-details');

    const services = await fetchServices();

    copyrightYear.innerText = currnetMoment.getFullYear();
    shoppingCartDetails.style.display = 'none';



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
    
    function resetQuote(){
        
        currentQuoteStep = 0;
        currentQuote = {
            serviceTitle: [],
            timeline: [],
            personalDetails:{
                fullName: '',
                email: '',
                phone: '',
                address: '',
                state: '',
                zipcode: ''
            },
            result: 4
        };
        updateShoppingCart();
    }
    function renderMenuContent(service) {
        const allServices = [];
        services.forEach(categ => {
            Object.values(categ).forEach(el=> allServices.push(el));
        });
        const allServicesFlat = allServices.flat();

        const serviceFlat = allServicesFlat.find(element => element[service]);
        
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
                <button class="quote-from-scratch menu-btn btn-dark">FREE QUOTE</button>
                <div class="menu-img-container">
                    <img src="${serviceFlat[service].image}" alt="">
                </div>
                </div>
                </div>`
        } else{
            menuDetailsBox.innerHTML = `<div class=contactBox>
            <h2>${serviceFlat[service].title.toUpperCase()}</h2>
            <h2 class="pn">${serviceFlat[service].subTitle.toUpperCase()}</h2>
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
            Array.from(document.getElementsByClassName('quote-from-scratch')).forEach(element => {
                element.addEventListener('click', ()=>{
                    resetQuote();
                    showModal();
                })
            })
    }

    function showModal(valid){
        modal.classList.add('visible');
        updateModalBtns(valid);
        renderQuoteSteps();
        updateProgress()
        modal.addEventListener('click', (e)=>{
            if (e.target.contains(modalFilter) ) {
                modal.classList.remove('visible');
            }
        })
        modalCloseBtn.addEventListener('click', ()=>{
            modal.classList.remove('visible');
        })
    }

    function updateProgress(){
        document.getElementById('indicator').style.width = (100/3) * currentQuoteStep + '%';
        Array.from(quoteSteps).forEach((step, index) => {
            step.classList[`${(index <= currentQuoteStep ? 'add' : 'remove')}`]('active');
        })
    }

    function updateSteps(e){
        currentQuoteStep = e.target.id === "next" ? ++currentQuoteStep : --currentQuoteStep;
        updateProgress();
        e.target.id === 'back' ? updateModalBtns(true) : updateModalBtns();
        renderQuoteSteps();
        updateShoppingCart();
    }

    function updateModalBtns(valid){
        if(currentQuoteStep <= 0) {
            currentQuoteStep = 0;
            document.getElementById('back').style.visibility = "hidden";
            document.getElementById('next').style.display = "block";
        } else if(currentQuoteStep >= 3)  {
            document.getElementById('next').style.display = "none";
            document.getElementById('back').style = "visibility: visible; margin: 0 auto;";
            
        } else {
            document.getElementById('next').style.display = "block";
            document.getElementById('back').style.visibility = "visible";
        }
        if(valid){
            document.getElementById('next').removeAttribute("disabled");
        } else {
            document.getElementById('next')?.setAttribute('disabled', 'true');
        }
    }

    function updateSelection(key, options){
        if(options.every(el => el.localName === 'div') && currentQuote[key].length > 0){
            options.forEach(option => {
                if(currentQuote[key].some(el => el === option.innerText)){
                    option.classList.add('selected');
                }
            });
            };

            if(options.every(el => el.localName === 'input')){
                options.forEach(option => option.value = currentQuote.personalDetails[option.id] || '');
                };
    }

    function selectForQuote(className){
        const options = Array.from(document.getElementsByClassName(className));
        if(!options.some(el => el.classList.contains('selected') || el?.value?.length > 1)){
        }
        if(className === "service-option"){

            updateSelection('serviceTitle', options);

            options.forEach((option) => option.addEventListener('click', (e)=>{
                if(e.target === option && !option.classList.contains('selected')){
                    option.classList.add('selected');
                    currentQuote.serviceTitle.push(e.target.innerText);
                } else{
                    option.classList.remove('selected')
                    currentQuote.serviceTitle.splice(currentQuote.serviceTitle.indexOf(e.target.innerText), 1)
                }
                updateModalBtns(currentQuote.serviceTitle.length > 0);

            }));
        }
        if(className === "timeline-option"){

            updateSelection('timeline', options);

            options.forEach((option) => option.addEventListener('click', (e)=>{
                if(e.target === option && !option.classList.contains('selected')){
                    options.forEach(option => option.classList.remove('selected'));
                    option.classList.add('selected');
                    currentQuote.timeline = [];
                    currentQuote.timeline.push(e.target.innerText);
                }
                updateModalBtns(currentQuote.timeline.length > 0);
            }));
        } 
        if(className = 'quote-input'){

            updateSelection('personalDetails', options);

            options.forEach(option => option.addEventListener('input', () => {
                currentQuote.personalDetails[option.id] = option.value;
                if(options.every(option => option.value)){
                    updateModalBtns(true);
                } else{
                    updateModalBtns(false);
                }
            }))
        }
        if(className = 'result'){
            options.forEach(option => option.addEventListener('input', () => {
                if(option.value == currentQuote.result){
                    document.getElementById('send-quote').removeAttribute("disabled");
                    document.getElementById('send-quote').addEventListener('click', () => {
                        currentQuote = {
                            serviceTitle: [],
                            timeline: [],
                            personalDetails:{
                                fullName: '',
                                email: '',
                                phone: '',
                                address: '',
                                state: '',
                                zipcode: ''
                            },
                            result: 4
                        };
                    })
                } else {
                    document.getElementById('send-quote')?.setAttribute('disabled', 'true');
                }
            }))
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
                            <div>
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
                                />
                                <div>
                                    <input id="email" 
                                    class="quote-input" 
                                    type="email" 
                                    placeholder="e-mail" 
 />

                                    <input
                                        id="phone"
                                        class="quote-input"
                                        type="number"
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <input
                                    id="address"
                                    class="quote-input"
                                    type="text"
                                    placeholder="Address"

                                />
                                <div>
                                    <input 
                                        id="city" 
                                        class="quote-input" 
                                        type="text" 
                                        placeholder="City" 
     />
                                    <input 
                                        id="state" 
                                        class="quote-input" 
                                        type="text" 
                                        placeholder="State" 
     />
                                    <input 
                                        id="zipcode" 
                                        class="quote-input" 
                                        type="number" 
                                        placeholder="Zip Code" 
     />
                                </div>
                            </div>
                        </div>
                    </div>
                `
                selectForQuote('quote-input');
                break;
              case 3: 
                modalQuoteContent.innerHTML = `
                    <h2>Please check if all details are correct</h2>

                    <div class="modal-main-content last-check">
                    <form action="https://formsubmit.co/christianthehandyman89@gmail.com" method="POST">
                    <input type="text" name="_honey" value="" style="display:none;">
                    <input type="hidden" name="_captcha" value="false">                    
                    <input type="hidden" name="_next" value="http://127.0.0.1:5500/success.html" >
                    <div class="form-left">
                    ` 
                    + 
                    
                    Object.keys(currentQuote).map((key) => {
                        if(key === 'serviceTitle'){
                            return `
                                <h4>Service${currentQuote[key].length > 1 ? 's' : ''}</h4>
                                <div class=last-check-input-container>` +
                                currentQuote[key].map((service, index) => {
                                    return ` <input class="last-check-input" name="${'service ' + (index + 1)}" readonly value="${service}" size=${service.length + 2}/>`
                                }).join('')
                                +
                                `
                                </div>
                            `
                        }

                        if(key === 'timeline'){
                            return `
                                <h4>Timeline</h4>
                                <div class=last-check-input-container>
                                <input class="last-check-input" name="timeline" readonly value="${currentQuote[key]}" size=${currentQuote[key].join('').length + 2}/>
                                </div>
                            `
                        }
                        
                        if(key === 'personalDetails'){
                            return `
                                <h4>Personal Details</h4>
                                    <div class=last-check-input-container>
                                `
                                +
                                Object.keys(currentQuote[key]).map(el => {
                                    return `
                                    <input class="last-check-input" name="${el}" readonly value="${currentQuote[key][el]}" size=${currentQuote[key][el].length + 2}/>                                    
                                    `
                                }).join('');
                                
                        }
                    }).join('')

                    +
                    `
                    </div>
                    </div>
                    <div class="user-test">
                        <div>
                        <h4>What is two + two?</h4>                
                        <input id="user-test" class="quote-input result" type="number" name="result" placeholder="result"/>
                        </div>
                        <button type="submit" id="send-quote" class="btn-dark" disabled>Request Quote</button>
                    </div>
                    </form>
                        `;
                    selectForQuote('result');                    
          }
    }

    function updateShoppingCart(){
        if (currentQuote.serviceTitle.length > 0){
            const badge = document.createElement('div');
            badge.id = 'shopping-cart-badge';
            const badgeText = document.createElement('p');
            badgeText.innerText = currentQuote.serviceTitle.length;
            badgeText.style.paddingLeft = '2px';
            badge.append(badgeText);
            shoppingCart.append(badge);
            shoppingCartDetails.innerHTML = `
            <div class="shopping-cart-content">
                <p>${currentQuote.serviceTitle.join(' | ')}</p>
                <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">${currentQuote.timeline}</p>
            </div>
            <div class="shopping-cart-btn">
                <button id="shopping-cart-btn" class="btn-dark">See Project</button>
            </div>
            `

            document.getElementById('shopping-cart-btn').addEventListener('click', ()=>{
                currentQuoteStep--
                showModal(true);
            })
        } else{
            document.getElementById('shopping-cart-badge')?.remove();
            shoppingCartDetails.innerHTML = `
            <div class="shopping-cart-content">
                <p>you have no projects to submit a quote request for</p>
            </div>
            <div class="shopping-cart-btn">
                <button disabled class="btn-dark">See Project</button>
            </div>
            `
        }
    }
    
    Array.from(document.getElementsByClassName('quote-from-scratch')).forEach(element => {
        element.addEventListener('click', ()=>{
            resetQuote();
            showModal();
        })
    })

    Array.from(modalBtns).forEach(btn => {
        btn.addEventListener('click', updateSteps);
    })

    body.addEventListener('click', (e)=>{
        if (!shoppingCart.contains(e.target) ) {
            shoppingCartDetails.classList.remove('visible');
        setTimeout(()=> {
            shoppingCartDetails.style.display = 'none';
        }, 100)
        }
    })

    logoContainer.addEventListener('click', ()=>{
        window.location.href = 'index.html'
    })

    shoppingCartIcon.addEventListener('mouseenter', ()=>{
        shoppingCartDetails.style.display = 'flex';
        setTimeout(()=> {
            shoppingCartDetails.classList.add('visible');
        }, 100)
        
    })
    shoppingCartIcon.addEventListener('click', ()=>{
        shoppingCartDetails.style.display = 'flex';
        setTimeout(()=> {
            shoppingCartDetails.classList.add('visible');
        }, 100)
    })

    burgerMenu.addEventListener('click', () => {
        triggerMenu();
        if(window.scrollY < 1){
            triggerNavbarStyle(openedMenu.classList.contains('visible'));
        }
    })

    banner.addEventListener('click', () => {
        triggerMenu();
        if(window.scrollY < 1){
            triggerNavbarStyle(openedMenu.classList.contains('visible'));
        }
    })


    const contactInputs = Array.from(document.getElementsByClassName('contact-input'));
    contactInputs.forEach(input => input.addEventListener('input', () => {
        contactInputs.forEach(el => {
            console.log(el.value);
            console.log(document.getElementById('user-test').value);
            if(el.value && document.getElementById('user-test').value == currentQuote.result){
                document.getElementById('send-message').removeAttribute("disabled");
            } else {
                document.getElementById('send-message')?.setAttribute('disabled', 'true');
            }
        })
        
    }));
        
    
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



