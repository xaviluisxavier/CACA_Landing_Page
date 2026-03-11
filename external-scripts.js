import * as THREE from 'three';

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    
    const navLinks = mainNav.querySelectorAll('a');
    const isOpened = mainNav.classList.contains('active');

    for (let link of navLinks) {
        link.style.display = isOpened ? "block" : "none";
    }
});

const saberMaisButton = document.getElementById('SaberMais');

saberMaisButton.addEventListener('click', (e) => {
    const areasDeInvestigacao = document.getElementById('investigacao');
    e.preventDefault();
    
    areasDeInvestigacao.classList.toggle('visible');

    if (areasDeInvestigacao.classList.contains('visible')) {
        setTimeout(() => {
            areasDeInvestigacao.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
});


const form = document.querySelector('.contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const campos = ['name', 'email','phone', 'address', 'subject', 'message']
    const email = document.getElementById('email').value;
    const nome = document.getElementById('name').value;
    const telemovel = document.getElementById('phone').value;

    if (!email.endsWith('@uac.pt') && !email.endsWith('@gmail.com') && !email.endsWith('@outlook.com')) {
        alert("Por favor, use um email válido."); 
        return;
    }

    if (!nome) {
        alert('Preencha o campo nome.');
        return;
    }

    if (telemovel && (isNaN(telemovel) || telemovel.length != 9 || !telemovel.startsWith('9'))) {
        alert('Insira um telemovel válido.');
        return;
    }

    let confirmacao = confirm('Mandar mensagem?');
    if (confirmacao){
        alert('Mensagem enviada com sucesso!')
        for(let campo of campos) {
            document.getElementById(campo).value = '';
        }
    }
});

function mostrarGrafico() {
    const container = document.querySelector('.grafico-placeholder');
    const grafico = d3.select('#opportunityChart');
    
    grafico.selectAll("*").remove();

    let valores = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight || 300; 

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = containerHeight - margin.top - margin.bottom;

    grafico.attr("width", containerWidth).attr("height", containerHeight);

    const svg = grafico.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(valores.map((d, i) => i))
        .range([0, innerWidth])
        .padding(0.2); 

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(valores)])
        .range([innerHeight, 0]);

    svg.selectAll("rect")
        .data(valores)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("width", xScale.bandwidth())
        .attr("fill", "var(--color-primary)") 
        .attr("rx", 4) 
        
        //ESTADO INICIAL
        .attr("y", innerHeight)
        .attr("height", 0)
        
        //ANIMAÇÃO
        .transition()
        .duration(800)
        .delay((d, i) => i * 80) 
        
        //ESTADO FINAL
        .attr("y", d => yScale(d))
        .attr("height", d => innerHeight - yScale(d));
}

window.addEventListener('DOMContentLoaded', mostrarGrafico);
window.addEventListener('resize', mostrarGrafico);


const btnTopo = document.getElementById("btn-topo");

btnTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        btnTopo.style.display = "block";
    } else {
        btnTopo.style.display = "none";
    }
});

const carouselItems = document.querySelectorAll('.carousel-item');
const btnPrev = document.querySelector('.carousel-control.prev');
const btnNext = document.querySelector('.carousel-control.next');
let currentSlide = 0;

if (carouselItems.length > 0) {
    function showSlide(index) {
        carouselItems[currentSlide].classList.remove('active');
        currentSlide = (index + carouselItems.length) % carouselItems.length;
        carouselItems[currentSlide].classList.add('active');
    }
    setInterval(() => showSlide(currentSlide + 1), 5000);
}



// No final do seu external-scripts.js, onde começa o código do Three.js:
window.addEventListener('load', () => {
    const container = document.getElementById('logo-3d-container');
    if (!container) return;

    const width = 60;
    const height = 60;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // Melhora a nitidez em ecrãs Retina/4K
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    
    // CARREGAMENTO DA TEXTURA COM CONFIGURAÇÕES DE CENTRAGEM
    const texture = loader.load('./assets/logo-caca.svg', (tex) => {
        // Isso garante que a imagem não fique esticada e use o centro como eixo
        tex.center.set(0.5, 0.5); 
        tex.minFilter = THREE.LinearFilter; // Evita que o ícone fique "pixelizado"
    }, undefined, (err) => {
        console.warn("Erro ao carregar textura. Verifique o caminho ou use Live Server.");
        logoMesh.material.color.setHex(0x1976D2); 
    });

    // Usamos CircleGeometry (um disco plano) para o logo não ficar distorcido como numa esfera
    const geometry = new THREE.CircleGeometry(2, 64);
    
    // IMPORTANTE: MeshBasicMaterial é melhor para ícones 2D pois não precisa de luzes complexas
    const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.DoubleSide // Permite ver o verso do logo quando ele gira
    });

    const logoMesh = new THREE.Mesh(geometry, material);
    scene.add(logoMesh);

    // Posicionamento da câmara
    camera.position.z = 4.5;

    function animate() {
        requestAnimationFrame(animate);
        // Rotação tipo "moeda a girar"
        logoMesh.rotation.y += 0.005; 
        renderer.render(scene, camera);
    }
    animate();
});