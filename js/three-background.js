class ThreeBackground {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.particles = [];
        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        // レンダラーの設定
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // カメラの位置設定
        this.camera.position.z = 30;

        // パーティクルの生成
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // パーティクルのマテリアル
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: '#007AFF',
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        // パーティクルシステムの作成
        this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particlesMesh);

        // 環境光の追加
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // パーティクルの回転
        this.particlesMesh.rotation.x += 0.0005;
        this.particlesMesh.rotation.y += 0.0005;

        // マウス位置に応じたパーティクルの動き
        if (this.mouseX) {
            this.particlesMesh.rotation.x += (this.mouseY * 0.00001);
            this.particlesMesh.rotation.y += (this.mouseX * 0.00001);
        }

        this.renderer.render(this.scene, this.camera);
    }

    addEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        this.mouseX = event.clientX - window.innerWidth / 2;
        this.mouseY = event.clientY - window.innerHeight / 2;
    }
}

// 背景の初期化
window.addEventListener('DOMContentLoaded', () => {
    new ThreeBackground();
});
