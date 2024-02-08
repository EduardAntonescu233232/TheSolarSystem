const navigation = () => {
    const burger = document.querySelector('.burger-menu');
    const menu = document.querySelector('.navbar-ul');

    burger.addEventListener('click', () => {
        burger.classList.toggle('burger-menu-active');
        menu.classList.toggle('navbar-ul-active');
    });

    const explore = document.querySelector('.explore-button');
    explore.addEventListener('click', ()=> {
       window.location.href = "SolarSystem.html";
    });
}

navigation();


