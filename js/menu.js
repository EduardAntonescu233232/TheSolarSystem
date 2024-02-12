const navigation = () => {
    const burger = document.querySelector('.burger-menu');
    const menu = document.querySelector('.navbar-ul');

    burger.addEventListener('click', () => {
        burger.classList.toggle('burger-menu-active');
        menu.classList.toggle('navbar-ul-active');
    });

}

navigation();


