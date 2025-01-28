// カスタムカーソル
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
});

// Locomotive Scroll初期化
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    lerp: 0.1,
    multiplier: 0.5,
    smartphone: {
        smooth: true
    },
    tablet: {
        smooth: true
    }
});

// GSAPアニメーション
gsap.registerPlugin(ScrollTrigger);

// ヒーローセクションのアニメーション
const splitTypes = document.querySelectorAll('.line');
const tl = gsap.timeline();

splitTypes.forEach((char, i) => {
    const text = new SplitType(char, { types: 'chars' });
    tl.from(text.chars, {
        opacity: 0,
        yPercent: 100,
        rotateX: -90,
        stagger: 0.02,
        duration: 1,
        ease: 'power4.out'
    }, i * 0.1);
});

// スクロールアニメーション
const workItems = gsap.utils.toArray('.work-item');
workItems.forEach((item) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'top center',
            scrub: 1
        },
        y: 100,
        opacity: 0
    });
});

// ナビゲーションリンクのホバーエフェクト
const navLinks = document.querySelectorAll('.nav-link, .logo');
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            scale: 3,
            duration: 0.3
        });
    });
    
    link.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            scale: 1,
            duration: 0.3
        });
    });
});

// Locomotive ScrollとScrollTriggerの連携
scroll.on('scroll', ScrollTrigger.update);

ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
        return arguments.length ? scroll.scrollTo(value, {duration: 0}) : scroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight
        };
    },
    pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
});

ScrollTrigger.addEventListener('refresh', () => scroll.update());
ScrollTrigger.refresh();

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            scroll.scrollTo(target, {
                offset: 0,
                duration: 1000,
                easing: [0.25, 0.00, 0.35, 1.00]
            });
        }
    });
});
