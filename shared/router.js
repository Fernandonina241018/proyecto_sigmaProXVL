// Router ES Module - StatAnalyzer Pro
export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.dataset.link);
            }
        });
        this.handleRoute();
    }

    handleRoute() {
        const path = location.pathname || '/';
        const route = this.routes[path] || this.routes['/'];
        if (route) route();
    }

    navigate(path) {
        history.pushState(null, '', path);
        this.handleRoute();
    }

    async lazyLoad(modulePath) {
        return import(modulePath);
    }
}

// Navigation state
export const Nav = {
    current: 'trabajo',
    
    setActive(page) {
        this.current = page;
        document.querySelectorAll('[data-page]').forEach(el => {
            el.classList.toggle('active', el.dataset.page === page);
        });
    }
};

export default { Router, Nav };
