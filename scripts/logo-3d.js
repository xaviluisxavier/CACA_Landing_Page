import * as THREE from 'three';

/**
 * Inicializa a animação 3D da logo utilizando a biblioteca Three.js.
 * Configura a câmara, cena, carregamento da textura SVG e loop de animação.
 * @returns {void}
 */
export function initAnimacao3D() {
    const container = document.getElementById('logo-3d-container');
    if (!container) return;

    const width = 60, height = 60;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
 
    const texture = loader.load('./assets/logo-caca.svg', function(loadedTexture) {
        loadedTexture.center.set(0.5, 0.5); 
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
    });

    const geometry = new THREE.CircleGeometry(2, 64);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const logoMesh = new THREE.Mesh(geometry, material);
    
    scene.add(logoMesh);
    camera.position.z = 4.5;

    function animate() {
        requestAnimationFrame(animate);
        logoMesh.rotation.y += 0.005; 
        renderer.render(scene, camera);
    }
    animate();
}
