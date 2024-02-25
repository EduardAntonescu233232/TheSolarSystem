const navigation = () => {
    const burger = document.querySelector('.burger-menu');
    const menu = document.querySelector('.navbar-ul');

    burger.addEventListener('click', () => {
        burger.classList.toggle('burger-menu-active');
        menu.classList.toggle('navbar-ul-active');
    });

    const back = document.querySelector('.back-button');

    back.addEventListener('click', () => {
        window.location.reload();
    });

    const planetsLink = document.querySelector('.planets-link');
    const planetsUl = document.querySelector('.planets-ul');
    const arrowPlanets = document.getElementById('arrow');

    planetsLink.addEventListener('click', (event) => {
        event.stopPropagation();
        planetsLink.classList.toggle('planets-link-pressed');
        planetsUl.classList.toggle('planets-ul-active');
        arrowPlanets.classList.toggle('arrow-pressed');
    });

    document.addEventListener('click', (event) => {
        if(!planetsLink.contains(event.target) && !planetsUl.contains(event.target)){
            if(planetsUl.classList.contains('planets-ul-active')){
                planetsLink.classList.remove('planets-link-pressed');
                planetsUl.classList.remove('planets-ul-active');
                arrowPlanets.classList.remove('arrow-pressed');
            }
        }
    });
}

navigation();


