document.addEventListener('DOMContentLoaded', ()=>{
    const currnetMoment = new Date();
    const body = document.getElementsByTagName('body')[0];
    const outlineLogo = document.getElementById("outline-logo");
    const originalLogo = document.getElementById('original-logo')
    const nav = document.getElementsByTagName('nav')[0];
    const copyrightYear = document.getElementById('copyright-year');

    const burgerMenu = document.getElementsByClassName('burger-menu')[0];
    const closedBurger = document.getElementById('closed-burger');
    const openedBurger = document.getElementById('opened-burger');
    const openedMenu = document.getElementById('menu-opened');

    const menuItems = document.getElementsByClassName('menu-item');
    const menuDetailsBox = document.getElementById('menu-details');

    copyrightYear.innerText = currnetMoment.getFullYear();

    renderMenuContent('exterior');

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
            console.log(selectedElement[service]);

            menuDetailsBox.innerHTML = `
                <h2>${selectedElement[service].title.toUpperCase()}</h2>
                <h3>${selectedElement[service].subTitle}</h3>
                <div class="service-steps"> ` + 

                `<div class="stepsBox">` + 
                
                selectedElement[service].steps.map(step => {
                    return ` <div id="tab${step.step}" class="menu-tab">
                     <span>${step.step}</span>
                     <p>${step.stepTitle}</p>
                     <div class="ticker"></div>
                    </div>
                    `
                    }).join('') + 

                    `</div>` + 

                    `<div class="tabContentBox">` + 

                    selectedElement[service].steps.map(step => {
                        return ` <div id="tab${step.step}-content" class="tabContent">
                        ${step.stepDescription}
                        </div>
                        `
                        }).join('')  + 

                    `</div>
                    </div>
                    <button>FREE QUOTE</button>
                    <div class="menu-img-container">
                        <img src="${selectedElement[service].image}" alt="">
                    </div>`

                    const tabsContent = Array.from(document.getElementsByClassName('tabContent'));
                    const menuTabs = Array.from(document.getElementsByClassName('menu-tab'));
                    menuTabs[0].classList.add('current-step');
                    tabsContent[0].classList.add('show');
                    menuTabs.forEach(tab => {
                        tab.addEventListener('click', ()=>{
                            menuTabs.forEach(tab => tab.classList.remove('current-step'));
                            tabsContent.forEach(element => element.classList.remove('show'));
                            tab.classList.add('current-step');
                            tabsContent[menuTabs.indexOf(tab)].classList.add('show');

                        })
                    })

                    // tabsContent.forEach(tab => tab.classList.remove('show'))

        } catch (error) {
            console.error(error)
        }
        

    
        // <div id="tab1" class="menu-tab current-step">
        //             <span>1</span>
        //             <p>Cover the area</p>
        //         </div>
        //         <div id="tab2" class="menu-tab">
        //             <span>2</span>
        //             <p>Prep the Walls</p>
        //         </div>
        //         <div id="tab3" class="menu-tab">
        //             <span>3</span>
        //             <p>Apply new paint</p>
        //         </div>
        //         <div id="tab4" class="menu-tab">
        //             <span>4</span>
        //             <p>Clean-Up</p>
        //         </div>
        //         <div id="tab1-content" class="tabcontent">
        //             We don’t want dust or paint getting where it doesn’t need to be. Our house painters’ first step is to lay drop cloths and plastic over the floors and furniture in the space we are painting.
        //         </div>
        //         <!-- <div id="tab1-content" class="tabcontent">
        //             Our expert house painters will next apply your quality paint. The time of this step depends on the surface and the paint, but our painters will make sure to work quickly and efficiently.
        //         </div> -->
        //         <!-- <div id="tab1-content" class="tabcontent">
        //             Since a smooth wall surface makes for better paint adhesion, our house painters will then prep the surfaces before painting.
        //         </div> -->
        //         <!-- <div id="tab1-content" class="tabcontent">
        //             We want to make sure your house looks like new and that includes our house painters cleaning up after our paint job.
        //         </div> -->
    }

    

    burgerMenu.addEventListener('click', () => {
        triggerMenu();
        if(window.scrollY < 1){
            triggerNavbarStyle(openedMenu.classList.contains('visible'));
        }
    })

    const menuLiItems = Array.from(menuItems).map(element => element.parentElement);
    menuLiItems.forEach(element => element.addEventListener('mouseenter', (event)=>{
        // console.log(element.firstChild.innerText.replace(element.firstChild.innerText[0], element.firstChild.innerText[0].toLowerCase()).split(" ").join(''));
        menuLiItems.forEach(element => element.classList.remove('selected'))
        element.classList.add('selected');
        renderMenuContent(element.firstChild.innerText.replace(element.firstChild.innerText[0], element.firstChild.innerText[0].toLowerCase()).split(" ").join(''))
    }))
    


    window.addEventListener('scroll', function() {
        triggerNavbarStyle(window.scrollY > 0);
    });
})



