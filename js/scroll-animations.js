class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // プロジェクトカードのアニメーション
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none reverse'
                },
                y: 100,
                opacity: 0,
                rotateX: -20,
                duration: 1,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        });

        // プロセスカードのアニメーション
        gsap.utils.toArray('.process-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom-=100',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                rotateY: -10,
                duration: 1,
                delay: i * 0.3,
                ease: 'back.out(1.7)'
            });
        });

        // スキルタグのアニメーション
        gsap.utils.toArray('.skill-tag').forEach((tag, i) => {
            gsap.from(tag, {
                scrollTrigger: {
                    trigger: tag,
                    start: 'top bottom-=50',
                    toggleActions: 'play none none reverse'
                },
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: i * 0.1,
                ease: 'elastic.out(1, 0.5)'
            });
        });

        // ヒーローセクションのパララックス
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 200,
            ease: 'none'
        });

        // 3D回転エフェクト
        this.initTiltEffect();
    }

    initTiltEffect() {
        const cards = document.querySelectorAll('.project-card, .process-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }
}

// スクロールアニメーションの初期化
window.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
});
