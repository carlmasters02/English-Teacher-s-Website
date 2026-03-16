document.addEventListener('DOMContentLoaded', () => {
	setupLanguageSwitch();
	setupActiveNavLink();
	setupScrollProgressBar();
	setupBackToTopButton();
	setupRevealAnimations();
	setupEnrollForm();
});

function setupActiveNavLink() {
	const navLinks = Array.from(document.querySelectorAll('.nav-links a[href]')).filter((link) => {
		const href = link.getAttribute('href');
		return href && href !== '#' && !link.hasAttribute('data-lang');
	});
	if (!navLinks.length) return;

	const current = window.location.pathname.split('/').pop() || 'index.html';

	navLinks.forEach((link) => {
		link.classList.remove('active');
		const href = link.getAttribute('href');
		if (href === current) {
			link.classList.add('active');
		}
	});
}

function setupLanguageSwitch() {
	const langLinks = Array.from(document.querySelectorAll('.lang-switch a[data-lang]'));
	if (!langLinks.length) return;

	const key = 'siteLanguage';
	const currentPage = window.location.pathname.split('/').pop() || 'index.html';
	const currentLang = currentPage.startsWith('en_') ? 'en' : 'vi';
	localStorage.setItem(key, currentLang);

	langLinks.forEach((link) => {
		const lang = link.getAttribute('data-lang');
		if (!lang) return;

		const targetPage = mapPageForLanguage(currentPage, lang);
		link.setAttribute('href', targetPage);

		if (lang === currentLang) {
			link.classList.add('active');
			link.setAttribute('aria-current', 'page');
		} else {
			link.classList.remove('active');
			link.removeAttribute('aria-current');
		}

		link.addEventListener('click', (event) => {
			event.preventDefault();
			if (lang !== 'en' && lang !== 'vi') return;
			localStorage.setItem(key, lang);
			window.location.href = targetPage;
		});
	});
}

function mapPageForLanguage(currentPage, lang) {
	if (lang === 'en') {
		if (currentPage.startsWith('en_')) return currentPage;
		return `en_${currentPage}`;
	}

	if (currentPage.startsWith('en_')) {
		return currentPage.slice(3);
	}

	return currentPage;
}

function setupScrollProgressBar() {
	const bar = document.createElement('div');
	bar.className = 'scroll-progress';
	bar.setAttribute('aria-hidden', 'true');
	document.body.prepend(bar);

	const updateProgress = () => {
		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
		bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
	};

	updateProgress();
	window.addEventListener('scroll', updateProgress, { passive: true });
	window.addEventListener('resize', updateProgress);
}

function setupBackToTopButton() {
	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = 'back-to-top';
	btn.setAttribute('aria-label', 'Back to top');
	btn.textContent = 'â†‘';
	document.body.appendChild(btn);

	const toggleVisibility = () => {
		if (window.scrollY > 420) {
			btn.classList.add('is-visible');
		} else {
			btn.classList.remove('is-visible');
		}
	};

	toggleVisibility();
	window.addEventListener('scroll', toggleVisibility, { passive: true });

	btn.addEventListener('click', () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});
}

function setupRevealAnimations() {
	const selectors = [
		'.card',
		'.pricing-card',
		'.testimonial',
		'.credential-item',
		'.payment-method',
		'.policy-box',
		'.stat-item'
	];

	const items = Array.from(document.querySelectorAll(selectors.join(',')));
	if (!items.length) return;

	items.forEach((item, index) => {
		item.classList.add('reveal-item');
		item.style.setProperty('--reveal-delay', `${(index % 6) * 70}ms`);
	});

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-visible');
				obs.unobserve(entry.target);
			});
		},
		{ threshold: 0.16, rootMargin: '0px 0px -30px 0px' }
	);

	items.forEach((item) => observer.observe(item));
}

function setupEnrollForm() {
	const form = document.getElementById('enrollForm');
	const success = document.getElementById('successMsg');
	if (!form || !success) return;

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}

		form.style.display = 'none';
		success.style.display = 'block';
		const scrollTarget = success.getBoundingClientRect().top + window.scrollY - 100;
		window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
	});
}

