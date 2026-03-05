document.addEventListener('DOMContentLoaded', () => {
    const homeContent = document.getElementById('homeContent');
    const projectsContent = document.getElementById('projectsContent');
    const menuHome = document.getElementById('menu-home');
    const menuProjects = document.getElementById('menu-projects');
    const allMenuItems = document.querySelectorAll('.menu-item');

    function navigateTo(section) {
        if (section === 'projects') {
            homeContent.style.opacity = "0";
            homeContent.style.transform = "scale(0.95)";
            
            setTimeout(() => {
                homeContent.style.display = "none";
                projectsContent.style.display = "block";
                
                // Sidebar highlight sync
                allMenuItems.forEach(item => item.classList.remove('active-page'));
                menuProjects.classList.add('active-page');

                setTimeout(() => {
                    projectsContent.style.opacity = "1";
                    projectsContent.style.transform = "translateY(0)";
                }, 50);
            }, 600);
        } else if (section === 'home') {
            projectsContent.style.opacity = "0";
            projectsContent.style.transform = "translateY(30px)";

            setTimeout(() => {
                projectsContent.style.display = "none";
                homeContent.style.display = "block";

                // Sidebar highlight sync
                allMenuItems.forEach(item => item.classList.remove('active-page'));
                menuHome.classList.add('active-page');

                setTimeout(() => {
                    homeContent.style.opacity = "1";
                    homeContent.style.transform = "scale(1)";
                }, 50);
            }, 600);
        }
    }

    // Bind listeners
    homeContent.addEventListener('click', () => navigateTo('projects'));
    menuProjects.addEventListener('click', () => navigateTo('projects'));
    menuHome.addEventListener('click', () => navigateTo('home'));
});