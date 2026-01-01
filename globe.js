// globe.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 800 / 800, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(800, 800);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const loader = new THREE.TextureLoader();
  const earthDayMap = loader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg');
  const nightMap = loader.load('./assets/textures/earth_night.jpg');
  const cloudMap = loader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/fair_clouds_4k.png');
  const markerTexture = loader.load('./assets/textures/marker.png');

  function getSunDirectionUTC() {
    const now = new Date();
    const seconds = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
    const theta = (seconds / 86400) * 2 * Math.PI;
    return new THREE.Vector3(Math.sin(theta), 0, -Math.cos(theta)).normalize();
  }

  const earthRadius = 3.8;
  const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
  const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: earthDayMap },
      nightTexture: { value: nightMap },
      sunDirection: { value: getSunDirectionUTC() }
    },
    vertexShader: `varying vec2 vUv; varying vec3 vWorldNormal;
      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }`,
    fragmentShader: `uniform sampler2D dayTexture; uniform sampler2D nightTexture; uniform vec3 sunDirection;
      varying vec2 vUv; varying vec3 vWorldNormal;
      void main() {
        float sunDot = dot(normalize(vWorldNormal), normalize(sunDirection));
        float mixAmount = clamp((sunDot + 0.2) / 0.4, 0.0, 1.0);
        vec4 dayColor = texture2D(dayTexture, vUv);
        vec4 nightColor = texture2D(nightTexture, vUv) * 1.4;
        gl_FragColor = mix(nightColor, dayColor, mixAmount);
      }`,
    side: THREE.FrontSide
  });

  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  earthMesh.position.y = 0.5;
  scene.add(earthMesh);

  const cloudGeometry = new THREE.SphereGeometry(earthRadius + 0.03, 64, 64);
  const cloudMaterial = new THREE.MeshLambertMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  earthMesh.add(new THREE.Mesh(cloudGeometry, cloudMaterial));

  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `varying vec3 vNormal;
      void main() {
        float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
        gl_FragColor = vec4(0.1, 0.5, 1.0, 1.0) * intensity;
      }`,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  });
  earthMesh.add(new THREE.Mesh(new THREE.SphereGeometry(earthRadius + 0.12, 64, 64), atmosphereMaterial));

  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  scene.add(new THREE.DirectionalLight(0xffffff, 1.25).position.set(5, 3, 5));
  scene.add(new THREE.DirectionalLight(0x223344, 0.2).position.set(-4, -2, -4));

  camera.position.z = 7.5;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.rotateSpeed = 0.5;

  let rotationSpeed = 0.0015;
  const markerGroup = new THREE.Group();
  scene.add(markerGroup);

  const visitedPlaces = [
    { name: "Paris", lat: 48.8566, lon: 2.3522, description: "City of Light with art, fashion, and the Eiffel Tower." },
    { name: "Kyoto", lat: 35.0116, lon: 135.7681, description: "Historic temples and cherry blossoms." },
    { name: "Cairo", lat: 30.0444, lon: 31.2357, description: "Home of pyramids, pharaohs, and the Nile." },
    { name: "New York", lat: 40.7128, lon: -74.006, description: "The city that never sleeps — skyline, energy, culture." },
    { name: "Mumbai", lat: 19.076, lon: 72.8777, description: "Bustling streets, Bollywood, and the Gateway of India." }
  ];

  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  }

  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.style.position = 'absolute';
  popup.style.pointerEvents = 'none';
  popup.style.transition = 'opacity 0.3s';
  popup.style.opacity = 0;
  document.body.appendChild(popup);

  let selectedMarker = null;

  visitedPlaces.forEach((place) => {
    const markerMaterial = new THREE.SpriteMaterial({ map: markerTexture });
    const marker = new THREE.Sprite(markerMaterial);
    marker.scale.set(0.18, 0.18, 1);
    const pos = latLonToVector3(place.lat, place.lon, earthRadius + 0.4);
    marker.position.copy(pos);
    marker.userData = { ...place, position: pos.clone() };
    markerGroup.add(marker);
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markerGroup.children);

    if (intersects.length > 0) {
      selectedMarker = intersects[0].object;
      const { name, description } = selectedMarker.userData;

      popup.innerHTML = `<h3>${name}</h3><p>${description}</p>`;
      popup.style.opacity = 1;

      rotationSpeed = 0.0002;
    } else {
      popup.style.opacity = 0;
      selectedMarker = null;
      rotationSpeed = 0.0015;
    }
  }

  window.addEventListener('click', onClick);

  function updatePopupPosition() {
    if (!selectedMarker) return;

    const worldPosition = selectedMarker.getWorldPosition(new THREE.Vector3());
    const screenPos = worldPosition.clone().project(camera);
    const rect = renderer.domElement.getBoundingClientRect();
    const x = (screenPos.x + 1) / 2 * rect.width + rect.left;
    const y = (-screenPos.y + 1) / 2 * rect.height + rect.top;

    popup.style.left = `${x + 20}px`;
    popup.style.top = `${y}px`;
  }

  function animate() {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += rotationSpeed;

    markerGroup.children.forEach(marker => {
      marker.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed);
    });

    updatePopupPosition();
    earthMaterial.uniforms.sunDirection.value = getSunDirectionUTC();
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}
