class ParisParallax {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('background-canvas'),
            alpha: true,
            antialias: true
        });

        this.clock = new THREE.Clock();
        this.buildings = new THREE.Group();
        this.clouds = new THREE.Group();
        this.stars = new THREE.Group();

        this.init();
        this.animate();
    }

    init() {
        // レンダラーの設定
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x001B3D); // パリの夜空の色

        // カメラの位置設定
        this.camera.position.set(0, 5, 15);
        
        // エッフェル塔の作成
        this.createEiffelTower();
        
        // パリの建物群の作成
        this.createBuildings();
        
        // 雲の作成
        this.createClouds();
        
        // 星空の作成
        this.createStars();
        
        // 環境光の追加
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // スポットライトの追加（月明かりのような効果）
        const moonLight = new THREE.DirectionalLight(0x90A4FF, 0.8);
        moonLight.position.set(5, 10, 5);
        this.scene.add(moonLight);

        // フォグの追加
        this.scene.fog = new THREE.Fog(0x001B3D, 1, 50);

        // イベントリスナーの追加
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('scroll', this.onScroll.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    createEiffelTower() {
        const geometry = new THREE.ConeGeometry(0.5, 8, 4);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        
        const tower = new THREE.Mesh(geometry, material);
        tower.position.set(0, 0, -10);
        this.scene.add(tower);
    }

    createBuildings() {
        for (let i = 0; i < 50; i++) {
            const height = Math.random() * 3 + 1;
            const geometry = new THREE.BoxGeometry(1, height, 1);
            const material = new THREE.MeshPhongMaterial({
                color: 0x222222,
                transparent: true,
                opacity: 0.8
            });
            
            const building = new THREE.Mesh(geometry, material);
            building.position.x = Math.random() * 40 - 20;
            building.position.y = height / 2 - 2;
            building.position.z = Math.random() * 20 - 25;
            
            this.buildings.add(building);
        }
        
        this.scene.add(this.buildings);
    }

    createClouds() {
        const cloudParticles = [];
        const texture = new THREE.TextureLoader().load('/assets/cloud.png');
        
        for (let i = 0; i < 50; i++) {
            const cloud = new THREE.Sprite(new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0.4
            }));
            
            cloud.position.set(
                Math.random() * 40 - 20,
                Math.random() * 10 + 5,
                Math.random() * 20 - 25
            );
            cloud.scale.set(5, 5, 1);
            
            cloudParticles.push({
                mesh: cloud,
                speed: Math.random() * 0.2 + 0.1
            });
            this.clouds.add(cloud);
        }
        
        this.cloudParticles = cloudParticles;
        this.scene.add(this.clouds);
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const starVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 100 - 50;
            const y = Math.random() * 50;
            const z = Math.random() * 50 - 50;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();

        // 雲のアニメーション
        this.cloudParticles.forEach(particle => {
            particle.mesh.position.x += particle.speed * delta;
            if (particle.mesh.position.x > 20) {
                particle.mesh.position.x = -20;
            }
        });

        // 建物のパララックス効果
        const scrollY = window.scrollY;
        this.buildings.position.z = scrollY * 0.005;
        this.clouds.position.z = scrollY * 0.002;
        this.stars.position.z = scrollY * 0.001;

        // カメラの揺れアニメーション
        this.camera.position.y = 5 + Math.sin(this.clock.getElapsedTime() * 0.5) * 0.1;

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onScroll() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        this.camera.position.y = 5 + scrollPercent * 2;
        this.camera.lookAt(0, 0, 0);
    }

    onMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        gsap.to(this.camera.position, {
            x: mouseX * 2,
            y: 5 + mouseY,
            duration: 1,
            ease: 'power2.out'
        });
    }
}

// パリのパララックス背景の初期化
window.addEventListener('DOMContentLoaded', () => {
    new ParisParallax();
});
