import './style.css';
import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';

import texMercury from './textures/mercury.jpg';
import texVenus   from './textures/venus.jpg';
import texEarth   from './textures/earth.jpg';
import texMoon    from './textures/moon.jpg';
import texJupiter from './textures/jupiter.jpg';
import texSaturn  from './textures/saturn.jpg';
import texSaturnRing from './textures/saturn ring.jpg';
import texUranus  from './textures/uranus.jpg';
import texNeptune from './textures/neptune.jpg';
import texSun     from './textures/sun.jpg';
import texMars from './textures/mars.jpg';
import texAsteroid from './textures/asteroid.jpg';

const PLANET_TEXTURES = {
  mercury: texMercury,
  venus: texVenus,
  earth: texEarth,
  mars: texMars,
  jupiter: texJupiter,
  saturn: texSaturn,
  uranus: texUranus,
  neptune: texNeptune,
  asteroid: texAsteroid
};

const textureLoader = new THREE.TextureLoader();

function loadRealTexture(url) {
  const texture = textureLoader.load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  return texture;
}

/* ============================================================
   SISTEMA SOLAR 3D — VERSIÓN MEJORADA
   Compatible con Vite + Three.js
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     DATOS DE LOS PLANETAS
     ============================================================ */

  const PLANETS = [
    {
      key: "mercury",
      name: "Mercurio",
      color: 0x9c948a,
      emissive: 0x25211d,
      relSize: 0.383,
      distAU: 0.39,
      periodDays: 88,
      rotHours: 1408,
      desc: "El planeta más pequeño y cercano al Sol. Su superficie está cubierta de cráteres y presenta enormes cambios de temperatura.",
      diameterKm: 4879,
      moons: 0,
      tempC: "−180 a 430"
    },

    {
      key: "venus",
      name: "Venus",
      color: 0xe8cda0,
      emissive: 0x352918,
      relSize: 0.949,
      distAU: 0.72,
      periodDays: 225,
      rotHours: -5832,
      desc: "Venus posee una atmósfera extremadamente densa y es el planeta más caliente del sistema solar.",
      diameterKm: 12104,
      moons: 0,
      tempC: "~465 °C",
      bands: true
    },

    {
      key: "earth",
      name: "Tierra",
      color: 0x3d7dd6,
      emissive: 0x08182d,
      relSize: 1,
      distAU: 1,
      periodDays: 365.25,
      rotHours: 24,
      desc: "Nuestro planeta. Sus océanos cubren aproximadamente el 71% de su superficie y posee una atmósfera que permite la vida.",
      diameterKm: 12742,
      moons: 1,
      tempC: "−88 a 58 °C",
      hasMoon: true,
      continents: true
    },

    {
      key: "mars",
      name: "Marte",
      color: 0xb1502f,
      emissive: 0x2a1008,
      relSize: 0.532,
      distAU: 1.52,
      periodDays: 687,
      rotHours: 24.6,
      desc: "El planeta rojo. Su color proviene principalmente del óxido de hierro presente en su superficie.",
      diameterKm: 6779,
      moons: 2,
      tempC: "−140 a 20 °C",
      rocky: true
    },

    {
      key: "jupiter",
      name: "Júpiter",
      color: 0xd3ab7f,
      emissive: 0x2d2114,
      relSize: 11.21,
      distAU: 5.2,
      periodDays: 4333,
      rotHours: 9.9,
      desc: "El planeta más grande del sistema solar. Es un gigante gaseoso con bandas atmosféricas y una enorme tormenta conocida como la Gran Mancha Roja.",
      diameterKm: 139820,
      moons: 95,
      tempC: "−145 °C",
      bands: true,
      extraMoons: [
        { name: "Ío", color: 0xe8d18a, size: 0.22, dist: 1.5, speed: 0.4 },
        { name: "Europa", color: 0xcfc8b0, size: 0.19, dist: 1.5, speed: 0.4 },
        { name: "Ganímedes", color: 0x9c8f7a, size: 0.28, dist: 1.5, speed: 0.4 },
        { name: "Calisto", color: 0x6f6559, size: 0.26, dist: 1.75, speed: 0.4 }
      ]
    },

    {
      key: "saturn",
      name: "Saturno",
      color: 0xe3c98f,
      emissive: 0x2e2712,
      relSize: 9.45,
      distAU: 9.58,
      periodDays: 10759,
      rotHours: 10.7,
      desc: "Gigante gaseoso famoso por su impresionante sistema de anillos compuesto principalmente por hielo y fragmentos rocosos.",
      diameterKm: 116460,
      moons: 146,
      tempC: "−178 °C",
      rings: true,
      bands: true,
      extraMoons: [
        { name: "Titán", color: 0xd9a15c, size: 0.3, dist: 3.6, speed: 0.4 },
        { name: "Rea", color: 0xb8b3ab, size: 0.16, dist: 4.1, speed: 0.4 },
        { name: "Encélado", color: 0xf0f4f8, size: 0.13, dist: 4.5, speed: 0.4 }
      ]
    },

    {
      key: "uranus",
      name: "Urano",
      color: 0xcdeef0,
      emissive: 0x162a2d,
      relSize: 4.01,
      distAU: 19.2,
      periodDays: 30687,
      rotHours: -17.2,
      desc: "Gigante de hielo con una inclinación extrema. Su atmósfera contiene metano, responsable de su característico color azul verdoso.",
      diameterKm: 50724,
      moons: 28,
      tempC: "−214 °C",
      tilt: 98
    },

    {
      key: "neptune",
      name: "Neptuno",
      color: 0x4f6fd1,
      emissive: 0x101b32,
      relSize: 3.88,
      distAU: 30.05,
      periodDays: 60190,
      rotHours: 16.1,
      desc: "El planeta más lejano del Sol y uno de los mundos con los vientos más rápidos conocidos del sistema solar.",
      diameterKm: 49244,
      moons: 16,
      tempC: "−218 °C"
    }
  ];

  /* ============================================================
     CONFIGURACIÓN
     ============================================================ */

  const SUN_RADIUS = 6.2;

  function orbitRadius(distAU) {
    return 16 + Math.pow(distAU, 0.55) * 15;
  }

  function planetRadius(relSize) {
    return 0.9 + Math.pow(relSize, 1 / 3) * 1.6;
  }

  /* ============================================================
     ELEMENTOS HTML
     ============================================================ */

  const canvas = document.getElementById("scene");
  const labelsLayer = document.getElementById("labels-layer");
  const infoPanel = document.getElementById("info-panel");

  const LOADING_FACTS = [
    "El Sol representa más del 99% de toda la masa del sistema solar.",
    "Un día en Venus dura más que su propio año.",
    "En Júpiter podrían caber más de 1,300 planetas del tamaño de la Tierra.",
    "Los anillos de Saturno están hechos principalmente de hielo y fragmentos de roca.",
    "En Marte está el Monte Olimpo, el volcán más grande conocido del sistema solar.",
    "Neptuno tarda 165 años terrestres en dar una vuelta completa al Sol.",
    "La Luna se aleja de la Tierra unos 3.8 cm cada año.",
    "Mercurio no tiene atmósfera significativa, por eso sus temperaturas varían drásticamente entre el día y la noche.",
    "Urano gira prácticamente de lado, con una inclinación axial de 98 grados.",
    "El cinturón de asteroides tiene millones de cuerpos rocosos, pero su masa total es menor a la de la Luna."
  ];

  const loaderFactEl = document.getElementById("loader-fact");

  if (loaderFactEl) {
    loaderFactEl.textContent =
      LOADING_FACTS[Math.floor(Math.random() * LOADING_FACTS.length)];
  }

  /* ============================================================
     RENDERER
     ============================================================ */

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.setSize(
    window.innerWidth,
    window.innerHeight,
    false
  );

  renderer.setClearColor(0x000000, 1);

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  renderer.toneMappingExposure = 1.02;

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  /* ============================================================
     ESCENA
     ============================================================ */

  const scene = new THREE.Scene();

  /* ============================================================
     CÁMARA
     ============================================================ */

  const camera = new THREE.PerspectiveCamera(
    48,
    window.innerWidth / window.innerHeight,
    0.01,
    5000
  );

  const cam = {
    target: new THREE.Vector3(0, 0, 0),
    radius: 185,
    minRadius: 2,
    maxRadius: 620,

    theta: Math.PI * 0.32,
    phi: Math.PI * 0.38,

    minPhi: 0.15,
    maxPhi: Math.PI - 0.15
  };

  let camThetaTarget = cam.theta;
  let camPhiTarget = cam.phi;
  let camRadiusTarget = cam.radius;

  function updateCameraPosition() {
    const sp = cam.radius * Math.sin(cam.phi);

    camera.position.x =
      cam.target.x +
      sp * Math.sin(cam.theta);

    camera.position.z =
      cam.target.z +
      sp * Math.cos(cam.theta);

    camera.position.y =
      cam.target.y +
      cam.radius * Math.cos(cam.phi);

    camera.lookAt(cam.target);
  }

  updateCameraPosition();

  const composer = new EffectComposer(renderer);

  composer.addPass(new RenderPass(scene, camera));

  const ssaoPass = new SSAOPass(
    scene,
    camera,
    window.innerWidth,
    window.innerHeight
  );

  ssaoPass.kernelRadius = 4;
  ssaoPass.minDistance = 0.002;
  ssaoPass.maxDistance = 0.05;

  composer.addPass(ssaoPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.75,
    0.5,
    0.18
  );

  composer.addPass(bloomPass);

  const smaaPass = new SMAAPass(
    window.innerWidth * renderer.getPixelRatio(),
    window.innerHeight * renderer.getPixelRatio()
  );

  composer.addPass(smaaPass);

  /* ============================================================
     ILUMINACIÓN
     ============================================================ */

  const hemisphereLight =
    new THREE.HemisphereLight(
      0x8fa7d8,
      0x080910,
      0.32
    );

  scene.add(hemisphereLight);

  const ambientLight =
    new THREE.AmbientLight(
      0x404060,
      0.16
    );

  scene.add(ambientLight);

  const sunLight =
    new THREE.PointLight(
      0xfff1d0,
      2.1,
      0,
      0
    );

  sunLight.position.set(0, 0, 0);

  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2010;
  sunLight.shadow.mapSize.height = 2010;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 400;
  sunLight.shadow.bias = -0.0005;

  scene.add(sunLight);

  /* ============================================================
     ESTRELLAS
     ============================================================ */

  const starLayers = [];

  function createStars(
    count,
    minRadius,
    maxRadius,
    size,
    opacity
  ) {
    const geometry =
      new THREE.BufferGeometry();

    const positions =
      new Float32Array(count * 3);

    const colors =
      new Float32Array(count * 3);

    const palette = [
      [1, 1, 1],
      [0.72, 0.84, 1],
      [1, 0.9, 0.72],
      [0.82, 0.9, 1]
    ];

    for (let i = 0; i < count; i++) {
      const radius =
        minRadius +
        Math.random() *
        (maxRadius - minRadius);

      const theta =
        Math.random() * Math.PI * 2;

      const phi =
        Math.acos(
          Math.random() * 2 - 1
        );

      positions[i * 3] =
        radius *
        Math.sin(phi) *
        Math.cos(theta);

      positions[i * 3 + 1] =
        radius * Math.cos(phi);

      positions[i * 3 + 2] =
        radius *
        Math.sin(phi) *
        Math.sin(theta);

      const color =
        palette[
          Math.floor(
            Math.random() *
            palette.length
          )
        ];

      const brightness =
        0.45 +
        Math.random() * 0.55;

      colors[i * 3] =
        color[0] * brightness;

      colors[i * 3 + 1] =
        color[1] * brightness;

      colors[i * 3 + 2] =
        color[2] * brightness;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(
        colors,
        3
      )
    );

    const material =
      new THREE.PointsMaterial({
        size,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity
      });

    const points =
      new THREE.Points(
        geometry,
        material
      );

    scene.add(points);

    starLayers.push(points);

    return points;
  }

  createStars(
    11000,
    900,
    2300,
    1.35,
    1
  );

  createStars(
    7000,
    1500,
    2500,
    0.8,
    0.6
  );

  /* ============================================================
     SOL
     ============================================================ */

  const sunGroup =
    new THREE.Group();

  const sunCanvas =
    document.createElement("canvas");

  sunCanvas.width = 1024;
  sunCanvas.height = 1024;

  const sunCtx =
    sunCanvas.getContext("2d");

  const sunGradient =
    sunCtx.createRadialGradient(
      512,
      512,
      40,
      512,
      512,
      512
    );

  sunGradient.addColorStop(
    0,
    "#fffde0"
  );

  sunGradient.addColorStop(
    0.22,
    "#ffe9a6"
  );

  sunGradient.addColorStop(
    0.55,
    "#ffc45b"
  );

  sunGradient.addColorStop(
    0.8,
    "#f89a32"
  );

  sunGradient.addColorStop(
    1,
    "#d96920"
  );

  sunCtx.fillStyle =
    sunGradient;

  sunCtx.fillRect(
    0,
    0,
    1024,
    1024
  );

  /* textura granulada del Sol */

  for (let i = 0; i < 5000; i++) {
    const x =
      Math.random() * 1024;

    const y =
      Math.random() * 1024;

    const radius =
      0.4 +
      Math.random() * 4;

    sunCtx.globalAlpha =
      0.08 +
      Math.random() * 0.22;

    sunCtx.fillStyle =
      Math.random() > 0.5
        ? "#fff3bd"
        : "#d86b20";

    sunCtx.beginPath();

    sunCtx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    sunCtx.fill();
  }

  sunCtx.globalAlpha = 1;

    const sunTexture= loadRealTexture(texSun);

  sunTexture.colorSpace =
    THREE.SRGBColorSpace;

  const sunMaterial =
    new THREE.MeshBasicMaterial({
      map: sunTexture
    });

  const sunMesh =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        SUN_RADIUS,
        128,
        96
      ),
      sunMaterial
    );

  sunGroup.add(sunMesh);

  /* ============================================================
     HALO DEL SOL
     ============================================================ */

  const glowCanvas =
    document.createElement("canvas");

  glowCanvas.width = 512;
  glowCanvas.height = 512;

  const glowCtx =
    glowCanvas.getContext("2d");

  const glowGradient =
    glowCtx.createRadialGradient(
      256,
      256,
      0,
      256,
      256,
      256
    );

  glowGradient.addColorStop(
    0,
    "rgba(255,245,190,0.95)"
  );

  glowGradient.addColorStop(
    0.25,
    "rgba(255,205,110,0.55)"
  );

  glowGradient.addColorStop(
    0.55,
    "rgba(255,155,60,0.18)"
  );

  glowGradient.addColorStop(
    1,
    "rgba(255,100,30,0)"
  );

  glowCtx.fillStyle =
    glowGradient;

  glowCtx.fillRect(
    0,
    0,
    512,
    512
  );

  const glowTexture =
    new THREE.CanvasTexture(
      glowCanvas
    );

  const glowMaterial =
    new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      blending:
        THREE.AdditiveBlending,
      depthWrite: false
    });

  const glowSprite =
    new THREE.Sprite(
      glowMaterial
    );

  glowSprite.scale.set(
    SUN_RADIUS * 8,
    SUN_RADIUS * 8,
    1
  );

  sunGroup.add(
    glowSprite
  );

  scene.add(
    sunGroup
  );

  /* ============================================================
     ESPECULARIDAD DEL AGUA (Tierra)
     ============================================================ */

  function applyEarthRoughnessMap(material, imageUrl) {

    const img = new Image();

    img.onload = function () {

      const width = 1024;
      const height = 512;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      let imageData;

      try {
        imageData = ctx.getImageData(0, 0, width, height);
      } catch (e) {
        return;
      }

      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const waterScore = b - (r + g) / 2;
        const isWater = waterScore > 6;

        const value = isWater ? 35 : 210;

        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
      }

      ctx.putImageData(imageData, 0, 0);

      const roughnessTexture = new THREE.CanvasTexture(canvas);

      material.roughness = 1;
      material.metalness = 0.15;
      material.roughnessMap = roughnessTexture;
      material.needsUpdate = true;
    };

    img.src = imageUrl;
  }

  /* ============================================================
     TEXTURAS PROCEDURALES
     ============================================================ */

  function makePlanetTexture(
    baseColorHex,
    options = {}
  ) {
    const width = 2048;
    const height = 1024;

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = width;
    canvas.height = height;

    const ctx =
      canvas.getContext("2d");

    const base =
      new THREE.Color(
        baseColorHex
      );

    ctx.fillStyle =
      base.getStyle();

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    function shade(
      color,
      amount
    ) {
      const result =
        color.clone();

      result.offsetHSL(
        0,
        0,
        amount
      );

      return result;
    }

    /* Tierra */

    if (options.continents) {
      ctx.globalAlpha = 0.72;

      for (
        let i = 0;
        i < 80;
        i++
      ) {
        const x =
          Math.random() * width;

        const y =
          Math.random() * height;

        const rx =
          8 +
          Math.random() * 65;

        const ry =
          5 +
          Math.random() * 35;

        ctx.fillStyle =
          shade(
            new THREE.Color(
              0x3e813e
            ),
            (Math.random() - 0.5) * 0.15
          ).getStyle();

        ctx.beginPath();

        ctx.ellipse(
          x,
          y,
          rx,
          ry,
          Math.random() *
            Math.PI,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      /* nieve / nubes */

      ctx.globalAlpha = 0.3;

      for (
        let i = 0;
        i < 60;
        i++
      ) {
        const x =
          Math.random() * width;

        const y =
          Math.random() * height;

        const rx =
          15 +
          Math.random() * 55;

        const ry =
          3 +
          Math.random() * 12;

        ctx.fillStyle =
          "#ffffff";

        ctx.beginPath();

        ctx.ellipse(
          x,
          y,
          rx,
          ry,
          Math.random() *
            Math.PI,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    }

    /* Júpiter / Saturno */

    else if (options.bands) {
      const bands =
        18;

      for (
        let i = 0;
        i < bands;
        i++
      ) {
        const y =
          (i / bands) *
          height;

        const h =
          height / bands;

        const variation =
          Math.sin(i * 2.4) *
          0.08;

        ctx.fillStyle =
          shade(
            base,
            variation
          ).getStyle();

        ctx.globalAlpha =
          0.5 +
          Math.random() * 0.25;

        ctx.fillRect(
          0,
          y,
          width,
          h * 1.08
        );
      }

      /* manchas atmosféricas */

      for (
        let i = 0;
        i < 50;
        i++
      ) {
        const x =
          Math.random() * width;

        const y =
          Math.random() * height;

        ctx.globalAlpha =
          0.12;

        ctx.fillStyle =
          "#fff1d0";

        ctx.beginPath();

        ctx.ellipse(
          x,
          y,
          15 +
            Math.random() * 45,
          4 +
            Math.random() * 12,
          0,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    }

    /* Planetas rocosos */

    else {
      const amount =
        options.rocky
          ? 5500
          : 2600;

      for (
        let i = 0;
        i < amount;
        i++
      ) {
        const x =
          Math.random() * width;

        const y =
          Math.random() * height;

        const radius =
          0.5 +
          Math.random() *
            (options.rocky
              ? 3.5
              : 2.5);

        ctx.globalAlpha =
          0.15 +
          Math.random() * 0.4;

        ctx.fillStyle =
          shade(
            base,
            (Math.random() -
              0.5) *
              0.25
          ).getStyle();

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;

    const texture =
      new THREE.CanvasTexture(
        canvas
      );

    texture.colorSpace =
      THREE.SRGBColorSpace;

    texture.anisotropy =
      renderer.capabilities.getMaxAnisotropy();

    texture.wrapS =
      THREE.RepeatWrapping;

    return texture;
  }

  /* ============================================================
     PLANETAS
     ============================================================ */

  const planetMeshes = [];
  const orbitLines = [];
  const labelEls = {};

  const orbitsGroup =
    new THREE.Group();

  scene.add(
    orbitsGroup
  );

  PLANETS.forEach(
    function (planet) {

      const orbitR =
        orbitRadius(
          planet.distAU
        );

      const radius =
        planetRadius(
          planet.relSize
        );

      /* ORBITA */

      const curve =
        new THREE.EllipseCurve(
          0,
          0,
          orbitR,
          orbitR,
          0,
          Math.PI * 2,
          false,
          0
        );

      const points =
        curve.getPoints(
          180
        );

      const orbitGeometry =
        new THREE.BufferGeometry().setFromPoints(
          points.map(
            function (point) {
              return new THREE.Vector3(
                point.x,
                0,
                point.y
              );
            }
          )
        );

      const orbitMaterial =
        new THREE.LineBasicMaterial({
          color: 0x5d7ba3,
          transparent: true,
          opacity: 0.4
        });

      const orbitLine =
        new THREE.LineLoop(
          orbitGeometry,
          orbitMaterial
        );

      orbitsGroup.add(
        orbitLine
      );

      orbitLines.push(
        orbitLine
      );

      /* PIVOTE */

      const pivot =
        new THREE.Group();

      scene.add(
        pivot
      );

      /* TEXTURA */

            const texture =
        PLANET_TEXTURES[planet.key]
          ? loadRealTexture(PLANET_TEXTURES[planet.key])
          : makePlanetTexture(
              planet.color,
              {
                bands: !!planet.bands,
                continents: !!planet.continents,
                rocky: !!planet.rocky
              }
            );

      /* MATERIAL */

      const material =
        new THREE.MeshStandardMaterial({
          map: texture,
          color: 0xffffff,

          roughness:
            planet.key === "venus"
              ? 0.95
              : 0.65,

          metalness: 0,

          emissive:
            new THREE.Color(
              planet.emissive
            ),

          emissiveIntensity:
            0.18
        });

      if (planet.key === "earth" && PLANET_TEXTURES.earth) {
        applyEarthRoughnessMap(material, PLANET_TEXTURES.earth);
      }

      /* MALLA */

      const mesh =
        new THREE.Mesh(
          new THREE.SphereGeometry(
            radius,
            128,
            96
          ),
          material
        );

      mesh.position.set(
        orbitR,
        0,
        0
      );

      /* inclinación */

      if (planet.tilt) {
        mesh.rotation.z =
          THREE.MathUtils.degToRad(
            planet.tilt
          );
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      pivot.add(
        mesh
      );

      /* ========================================================
         ATMÓSFERA
         ======================================================== */

      if (
        planet.key === "earth" ||
        planet.key === "venus" ||
        planet.key === "uranus" ||
        planet.key === "neptune"
      ) {

        const atmosphereColors = {
          earth: 0x4da3ff,
          venus: 0xffc978,
          uranus: 0x8ceaf0,
          neptune: 0x668cff
        };

        const atmosphereMaterial =
          new THREE.MeshBasicMaterial({
            color:
              atmosphereColors[
                planet.key
              ],

            transparent: true,

            opacity:
              planet.key === "earth"
                ? 0.15
                : 0.08,

            side:
              THREE.BackSide,

            blending:
              THREE.AdditiveBlending,

            depthWrite: false
          });

        const atmosphere =
          new THREE.Mesh(
            new THREE.SphereGeometry(
              radius * 1.055,
              48,
              48
            ),
            atmosphereMaterial
          );

        mesh.add(
          atmosphere
        );
      }

      /* ========================================================
         ANILLOS DE SATURNO
         ======================================================== */

            if (planet.rings) {

        const ringGeometry =
          new THREE.RingGeometry(
            radius * 1.35,
            radius * 2.65,
            96
          );

        // Mapeo de UV plano para que la foto del anillo se vea correcta
        const pos = ringGeometry.attributes.position;
        const uvArray = [];
        const outerR = radius * 2.65;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          uvArray.push(x / (outerR * 2) + 0.5, y / (outerR * 2) + 0.5);
        }
        ringGeometry.setAttribute(
          "uv",
          new THREE.Float32BufferAttribute(uvArray, 2)
        );

        const ringMaterial =
          new THREE.MeshBasicMaterial({
            map: loadRealTexture(texSaturnRing),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.29,
            depthWrite: false
          });

        const rings =
          new THREE.Mesh(
            ringGeometry,
            ringMaterial
          );

        rings.rotation.x = Math.PI / 2;
        rings.rotation.z = 0.25;

        mesh.add(rings);
      }

      /* ========================================================
         LUNA
         ======================================================== */

      if (planet.hasMoon) {

        const moonPivot =
          new THREE.Group();

        mesh.add(
          moonPivot
        );

        const moonTexture = loadRealTexture(texMoon);

        const moonMaterial =
          new THREE.MeshStandardMaterial({
            map: moonTexture,
            roughness: 1
          });

        const moon =
          new THREE.Mesh(
            new THREE.SphereGeometry(
              radius * 0.27,
              64,
              48
            ),
            moonMaterial
          );

        moon.position.set(
          radius * 2.5,
          0,
          0
        );

        moonPivot.add(
          moon
        );

        planet._moonPivot =
          moonPivot;

        planet._moon =
          moon;
      }

      /* ========================================================
         LUNAS PRINCIPALES (Júpiter / Saturno)
         ======================================================== */

      if (planet.extraMoons) {

        planet._extraMoonPivots = [];

        planet.extraMoons.forEach(function (moonDef) {

          const moonPivot = new THREE.Group();
          moonPivot.rotation.y = Math.random() * Math.PI * 2;

          mesh.add(moonPivot);

          const moonMaterial = new THREE.MeshStandardMaterial({
            color: moonDef.color,
            roughness: 0.9,
            metalness: 0.05
          });

          const moonMesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius * moonDef.size, 24, 20),
            moonMaterial
          );

          moonMesh.position.set(radius * moonDef.dist, 0, 0);

          moonPivot.add(moonMesh);

          planet._extraMoonPivots.push({
            pivot: moonPivot,
            speed: moonDef.speed
          });
        });
      }

      /* ========================================================
         POSICIÓN INICIAL
         ======================================================== */

      pivot.rotation.y =
        Math.random() *
        Math.PI *
        2;

      const entry = {
        mesh,
        pivot,
        data: planet,
        orbitR,
        radius,

        orbitSpeed:
          1 /
          Math.sqrt(
            planet.distAU
          ),

        spinSpeed:
          24 /
          Math.abs(
            planet.rotHours
          )
      };

      planetMeshes.push(
        entry
      );

      /* ========================================================
         ETIQUETA
         ======================================================== */

      const label =
        document.createElement(
          "div"
        );

      label.className =
        "planet-label";

      const hex =
        planet.color
          .toString(16)
          .padStart(6, "0");

      label.innerHTML = `
        <span
          class="dot"
          style="color:#${hex}"
        ></span>

        <span>${planet.name}</span>

        <span class="dist">
          ${planet.distAU} UA
        </span>
      `;

      labelsLayer.appendChild(
        label
      );

      labelEls[
        planet.key
      ] = label;

      label.style.pointerEvents =
        "auto";

      label.style.cursor =
        "pointer";

      label.addEventListener(
        "click",
        function () {
          selectPlanet(entry);
        }
      );
    }
  );

  /* ============================================================
     CINTURÓN DE ASTEROIDES
     ============================================================ */

    let asteroidBelt;

  (function createAsteroidBelt() {

    const inner = orbitRadius(2.1);
    const outer = orbitRadius(3.3);
    const totalCount = 2200;
    const variantCount = 6;
    const perVariant = Math.ceil(totalCount / variantCount);

    asteroidBelt = new THREE.Group();

    const rockMaterial = new THREE.MeshStandardMaterial({
      map: loadRealTexture(texAsteroid),
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.95,
      metalness: 0.04,
      emissive: new THREE.Color(0x555555),
      emissiveIntensity: 0.22
    });

    function makeRockGeometry() {
      const geometry = new THREE.IcosahedronGeometry(1, 3);
      const position = geometry.attributes.position;
      const vertex = new THREE.Vector3();

      const bumps = [];
      const bumpCount = 3 + Math.floor(Math.random() * 3);

      for (let b = 0; b < bumpCount; b++) {
        bumps.push({
          dir: new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
          ).normalize(),
          strength: 0.12 + Math.random() * 0.28,
          sharpness: 1.5 + Math.random() * 2.5
        });
      }

      for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i).normalize();

        let offset = 1;
        bumps.forEach(function (bump) {
          const dot = Math.max(0, vertex.dot(bump.dir));
          offset += bump.strength * Math.pow(dot, bump.sharpness);
        });

        vertex.multiplyScalar(offset);
        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      geometry.computeVertexNormals();
      return geometry;
    }

    const dummy = new THREE.Object3D();

    for (let v = 0; v < variantCount; v++) {

      const geometry = makeRockGeometry();
      const mesh = new THREE.InstancedMesh(geometry, rockMaterial, perVariant);

      for (let i = 0; i < perVariant; i++) {

        const radius = inner + Math.random() * (outer - inner);
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 3;

        dummy.position.set(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );

        const scale = 0.12 + Math.random() * 0.55;
        dummy.scale.setScalar(scale);

        dummy.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );

        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        const shade = 0.75 + Math.random() * 0.4;
        mesh.setColorAt(
          i,
          new THREE.Color(0.85 * shade, 0.85 * shade, 0.85 * shade)
        );
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      asteroidBelt.add(mesh);
    }

    scene.add(asteroidBelt);
  })();

  /* ============================================================
     MARCADOR DE ASTEROIDES
     ============================================================ */

  const asteroidMarker =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        1.6,
        20,
        20
      ),
      new THREE.MeshBasicMaterial({
        color: 0x9a8f7c,
        transparent: true,
        opacity: 0.9
      })
    );

  asteroidMarker.position.set(
    orbitRadius(2.7),
    0,
    0
  );

  scene.add(
    asteroidMarker
  );

  asteroidMarker.visible = false;

  /* ============================================================
     INFORMACIÓN DEL SOL / LUNA / ASTEROIDES
     ============================================================ */

  const SPACE_INFO = {

    sun: {
      key: "sun",
      name: "Sol",
      eyebrow:
        "Estrella · Centro del sistema",
      color: "#ffd27a",

      desc:
        "El Sol es una estrella de tipo G y contiene casi toda la masa del sistema solar. Su energía procede de la fusión nuclear.",

      stats: [
        ["Tipo", "Enana amarilla G2 V"],
        ["Diámetro", "1,391,000 km"],
        ["Edad", "~4,600 millones de años"],
        ["Temperatura", "~5,500 °C"],
        ["Composición", "Hidrógeno y helio"]
      ]
    },

    moon: {
      key: "moon",
      name: "Luna",
      eyebrow:
        "Satélite natural · Tierra",
      color: "#c9c9c9",

      desc:
        "La Luna es el satélite natural de la Tierra. Su superficie presenta numerosos cráteres y grandes regiones basálticas.",

      stats: [
        ["Diámetro", "3,474 km"],
        ["Distancia media", "384,400 km"],
        ["Periodo orbital", "~27.3 días"],
        ["Tipo", "Satélite natural"]
      ]
    },

    asteroid: {
      key: "asteroid",
      name:
        "Cinturón de asteroides",

      eyebrow:
        "Rocas · Marte y Júpiter",

      color: "#b9a88d",

      desc:
        "Región que contiene millones de cuerpos rocosos y metálicos situados principalmente entre Marte y Júpiter.",

      stats: [
        ["Ubicación", "Marte — Júpiter"],
        ["Composición", "Roca y metales"],
        ["Tamaño", "Muy variable"],
        ["Dato", "No es una barrera sólida"]
      ]
    }
  };

  /* ============================================================
     PANEL
     ============================================================ */

  function openSpaceInfo(info) {

    stopSpeech();

    currentInfoKey = info.key;

    const isAsteroid = info.key === "asteroid";

    document.getElementById("ip-compare").style.display = isAsteroid ? "none" : "flex";
    document.getElementById("ip-fps").style.display = isAsteroid ? "none" : "flex";
    document.getElementById("ip-card").style.display = isAsteroid ? "none" : "flex";

    document
      .getElementById("ip-swatch")
      .style.setProperty(
        "--pcolor",
        info.color
      );

    const swatch = document.getElementById("ip-swatch");

    if (info.name === "Sol") {
      swatch.style.backgroundImage = `url(${texSun})`;
    } else if (info.name === "Luna") {
      swatch.style.backgroundImage = `url(${texMoon})`;
    } else if (info.name === "Cinturón de asteroides") {
      swatch.style.backgroundImage = `url(${texAsteroid})`;
    } else {
      swatch.style.backgroundImage = "none";
    }

    document
      .getElementById("ip-eyebrow")
      .textContent =
      info.eyebrow;

    document
      .getElementById("ip-eyebrow")
      .style.color =
      info.color;

    document
      .getElementById("ip-name")
      .textContent =
      info.name;

    document
      .getElementById("ip-desc")
      .textContent =
      info.desc;

    document
      .getElementById("ip-stats")
      .innerHTML =
      info.stats
        .map(
          function (stat) {
            return `
              <div class="ip-stat">
                <span>${stat[0]}</span>
                <span>${stat[1]}</span>
              </div>
            `;
          }
        )
        .join("");

    infoPanel.classList.add(
      "open"
    );

    selected = null;
    focusing = false;

    camRadiusTarget = cam.radius;
  }

  /* ============================================================
     ETIQUETAS ESPECIALES
     ============================================================ */

  const spaceObjects = [];
  const spaceLabels = {};

  function addSpaceLabel(
    key,
    text,
    object,
    info
  ) {

    const label =
      document.createElement(
        "div"
      );

    label.className =
      "space-object-label";

    label.textContent =
      text;

    labelsLayer.appendChild(
      label
    );

    spaceLabels[key] =
      label;

    label.addEventListener(
      "click",
      function (event) {

        event.stopPropagation();

        openSpaceInfo(
          info
        );
      }
    );

    spaceObjects.push({
      key,
      object,
      info
    });
  }

  addSpaceLabel(
    "sun",
    "☀ SOL",
    sunGroup,
    SPACE_INFO.sun
  );

  addSpaceLabel(
    "asteroid",
    "☄ ASTEROIDES",
    asteroidMarker,
    SPACE_INFO.asteroid
  );

  const earthEntry =
    planetMeshes.find(
      function (entry) {
        return (
          entry.data.key ===
          "earth"
        );
      }
    );

  if (
    earthEntry &&
    earthEntry.data._moon
  ) {

    addSpaceLabel(
      "moon",
      "● LUNA",
      earthEntry.data._moon,
      SPACE_INFO.moon
    );
  }

  /* ============================================================
     INTERACCIÓN DE CÁMARA
     ============================================================ */

  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let dragMoved = false;

  /* Inercia de arrastre: al soltar, la cámara sigue girando
     un momento y frena de forma natural, en vez de detenerse
     en seco. */
  let thetaVelocity = 0;
  let phiVelocity = 0;
  let inertiaActive = false;
  const INERTIA_DECAY = 0.88;
  const INERTIA_STOP_EPSILON = 0.00004;

  const raycaster =
    new THREE.Raycaster();

  const pointer =
    new THREE.Vector2();

  function pointerDown(
    x,
    y
  ) {

    isDragging = true;

    dragMoved = false;

    inertiaActive = false;
    thetaVelocity = 0;
    phiVelocity = 0;

    lastX = x;
    lastY = y;

    canvas.classList.add(
      "dragging"
    );
  }

  function pointerMove(
    x,
    y
  ) {

    if (!isDragging)
      return;

    if (impactPhase) return;

    const dx =
      x - lastX;

    const dy =
      y - lastY;

    if (
      Math.abs(dx) +
      Math.abs(dy) >
      2
    ) {
      dragMoved = true;
    }

    if (fpsMode) {

      fpsYaw -= dx * 0.004;
      fpsPitch += dy * 0.004;

      fpsPitch = Math.max(
        -1.4,
        Math.min(1.4, fpsPitch)
      );

      lastX = x;
      lastY = y;

      return;
    }

    const stepTheta =
      -dx * 0.0055;

    const stepPhi =
      -dy * 0.0055;

    camThetaTarget += stepTheta;
    camPhiTarget += stepPhi;

    camPhiTarget =
      Math.max(
        cam.minPhi,
        Math.min(
          cam.maxPhi,
          camPhiTarget
        )
      );

    /* Promedio suavizado de la velocidad angular, para que la
       inercia al soltar parta de un valor estable y no del
       último micro-movimiento (a menudo ruidoso). */
    thetaVelocity =
      thetaVelocity * 0.6 + stepTheta * 0.4;

    phiVelocity =
      phiVelocity * 0.6 + stepPhi * 0.4;

    lastX = x;
    lastY = y;
  }

  function pointerUp(
    x,
    y
  ) {

    isDragging = false;

    canvas.classList.remove(
      "dragging"
    );

    if (
      dragMoved &&
      !fpsMode &&
      (
        Math.abs(thetaVelocity) > INERTIA_STOP_EPSILON ||
        Math.abs(phiVelocity) > INERTIA_STOP_EPSILON
      )
    ) {
      inertiaActive = true;
    } else {
      inertiaActive = false;
    }

    if (!dragMoved) {
      tryPick(
        x,
        y
      );
    }
  }

  canvas.addEventListener(
    "mousedown",
    function (event) {
      pointerDown(
        event.clientX,
        event.clientY
      );
    }
  );

  window.addEventListener(
    "mousemove",
    function (event) {
      pointerMove(
        event.clientX,
        event.clientY
      );
    }
  );

  window.addEventListener(
    "mouseup",
    function (event) {

      if (isDragging) {
        pointerUp(
          event.clientX,
          event.clientY
        );
      }
    }
  );

  /* ============================================================
     TOUCH
     ============================================================ */

  let isPinching = false;
  let pinchStartDist = 0;
  let pinchStartRadius = 0;

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  canvas.addEventListener(
    "touchstart",
    function (event) {

      if (event.touches.length === 2) {

        isPinching = true;
        isDragging = false;

        pinchStartDist = getTouchDistance(event.touches);
        pinchStartRadius = cam.radius;

        return;
      }

      const touch =
        event.touches[0];

      pointerDown(
        touch.clientX,
        touch.clientY
      );
    },
    {
      passive: true
    }
  );

  canvas.addEventListener(
    "touchmove",
    function (event) {

      if (event.touches.length === 2) {

        isPinching = true;

        const newDist = getTouchDistance(event.touches);
        const scale = pinchStartDist / newDist;

        camRadiusTarget = Math.max(
          cam.minRadius,
          Math.min(cam.maxRadius, pinchStartRadius * scale)
        );

        return;
      }

      if (isPinching) return;

      const touch =
        event.touches[0];

      pointerMove(
        touch.clientX,
        touch.clientY
      );
    },
    {
      passive: true
    }
  );

  canvas.addEventListener(
    "touchend",
    function (event) {

      if (event.touches.length === 0) {
        isPinching = false;
      }

      pointerUp(
        lastX,
        lastY
      );
    }
  );

  /* ============================================================
     ZOOM
     ============================================================ */

    canvas.addEventListener(
    "wheel",
    function (event) {

      event.preventDefault();

      if (fpsMode) return;

      if (impactPhase) return;

      camRadiusTarget +=
        event.deltaY *
        0.06 *
        (camRadiusTarget / 120);

      camRadiusTarget =
        Math.max(
          cam.minRadius,
          Math.min(
            cam.maxRadius,
            camRadiusTarget
          )
        );
    },
    {
      passive: false
    }
  );

  /* ============================================================
     SELECCIÓN
     ============================================================ */

  function tryPick(
    x,
    y
  ) {

    if (fpsMode) return;

    if (quizActive) return;

    if (impactPhase) return;


    pointer.x =
      (x /
        window.innerWidth) *
        2 -
      1;

    pointer.y =
      -(
        (y /
          window.innerHeight) *
          2 -
        1
      );

    raycaster.setFromCamera(
      pointer,
      camera
    );

    const objects =
      planetMeshes.map(
        function (entry) {
          return entry.mesh;
        }
      );

    objects.push(
      sunMesh
    );

    objects.push(
      asteroidMarker
    );

    objects.push(
      asteroidBelt
    );

    if (
      earthEntry &&
      earthEntry.data._moon
    ) {
      objects.push(
        earthEntry.data._moon
      );
    }

    const hits =
      raycaster.intersectObjects(
        objects,
        true
      );

    if (!hits.length)
      return;

    const object =
      hits[0].object;

    if (
      object === sunMesh ||
      object.parent ===
        sunGroup
    ) {

      openSpaceInfo(
        SPACE_INFO.sun
      );

      return;
    }

    if (
      object === asteroidMarker ||
      object.parent === asteroidBelt
    ) {

      openSpaceInfo(
        SPACE_INFO.asteroid
      );

      return;
    }

    if (
      earthEntry &&
      object ===
        earthEntry.data._moon
    ) {

      openSpaceInfo(
        SPACE_INFO.moon
      );

      return;
    }

    const found =
      planetMeshes.find(
        function (entry) {
          return (
            entry.mesh ===
              object ||
            object.parent ===
              entry.mesh
          );
        }
      );

    if (found) {
      selectPlanet(
        found
      );
    }
  }

  /* ============================================================
     PANEL DE PLANETAS
     ============================================================ */

  let selected = null;

  let currentInfoKey = null;

  let focusing = false;

  const focusTarget =
    new THREE.Vector3();

  let focusRadius = 100;

  function getWorldPosition(
    entry
  ) {

    const position =
      new THREE.Vector3();

    entry.mesh.getWorldPosition(
      position
    );

    return position;
  }

  function selectPlanet(
    entry
  ) {

    stopSpeech();

    selected = entry;

    const planet =
      entry.data;

    currentInfoKey = planet.key;

    document.getElementById("ip-compare").style.display = "flex";
    document.getElementById("ip-fps").style.display = "flex";
    document.getElementById("ip-card").style.display = "flex";


    const color =
      "#" +
      planet.color
        .toString(16)
        .padStart(6, "0");

    document
      .getElementById(
        "ip-swatch"
      )
      .style.setProperty(
        "--pcolor",
        color
      );

    const swatch = document.getElementById("ip-swatch");
    if (PLANET_TEXTURES[planet.key]) {
      swatch.style.backgroundImage = `url(${PLANET_TEXTURES[planet.key]})`;
    } else {
      swatch.style.backgroundImage = "none";
    }

    document
      .getElementById(
        "ip-eyebrow"
      )
      .textContent =
      "Planeta · " +
      (PLANETS.indexOf(
        planet
      ) + 1) +
      " desde el Sol";

    document
      .getElementById(
        "ip-eyebrow"
      )
      .style.color =
      color;

    document
      .getElementById(
        "ip-name"
      )
      .textContent =
      planet.name;

    document
      .getElementById(
        "ip-desc"
      )
      .textContent =
      planet.desc;

    const stats = [
      [
        "Diámetro",
        planet.diameterKm.toLocaleString(
          "es"
        ) + " km"
      ],

      [
        "Distancia al Sol",
        planet.distAU +
          " UA"
      ],

      [
        "Periodo orbital",
        Math.round(
          planet.periodDays
        ).toLocaleString(
          "es"
        ) + " días"
      ],

      [
        "Día",
        Math.abs(
          planet.rotHours
        ) < 48
          ? Math.abs(
              planet.rotHours
            ).toFixed(1) +
            " h"
          : Math.round(
              Math.abs(
                planet.rotHours
              ) / 24
            ) +
            " días"
      ],

      [
        "Lunas",
        String(
          planet.moons
        )
      ],

      [
        "Temperatura",
        planet.tempC
      ]
    ];

    document
      .getElementById(
        "ip-stats"
      )
      .innerHTML =
      stats
        .map(
          function (stat) {
            const isDistance = stat[0] === "Distancia al Sol";

            return `
              <div class="ip-stat">
                <span>${stat[0]}</span>
                <span>
                  ${stat[1]}${isDistance ? '<br><small class="ip-stat-note">Unidad Astronómica</small>' : ''}
                </span>
              </div>
            `;
          }
        )
        .join("");

    infoPanel.classList.add(
      "open"
    );

    focusTarget.copy(
      getWorldPosition(
        entry
      )
    );

    focusRadius =
      entry.radius * 4 + 6;

    focusing = true;
    inertiaActive = false;
  }

  /* ============================================================
     CERRAR PANEL
     ============================================================ */

  const closeButton =
    document.getElementById(
      "ip-close"
    );

  function closeInfo() {

    stopSpeech();

    infoPanel.classList.remove(
      "open"
    );

    selected = null;

    focusing = false;

    camRadiusTarget = cam.radius;
  }

  /* ============================================================
     COMPARADOR DE PLANETAS
     ============================================================ */

  const compareOverlay = document.getElementById("compare-overlay");
  const compareTrigger = document.getElementById("ip-compare");
  const compareCloseBtn = document.getElementById("compare-close");
  const compareSelect = document.getElementById("compare-select");

  let comparePlanetA = null;

  function planetHex(planet) {
    return "#" + planet.color.toString(16).padStart(6, "0");
  }

  function getComparableStats(planet) {
    return [
      ["Diámetro", planet.diameterKm.toLocaleString("es") + " km"],
      ["Distancia al Sol", planet.distAU + " UA"],
      [
        "Periodo orbital",
        Math.round(planet.periodDays).toLocaleString("es") + " días"
      ],
      [
        "Día",
        Math.abs(planet.rotHours) < 48
          ? Math.abs(planet.rotHours).toFixed(1) + " h"
          : Math.round(Math.abs(planet.rotHours) / 24) + " días"
      ],
      ["Lunas", String(planet.moons)],
      ["Temperatura", planet.tempC]
    ];
  }

  function buildCompareEntity(key) {

    if (key === "sun") {
      return {
        key: "sun",
        name: "Sol",
        colorHex: "#ffd27a",
        texture: texSun,
        stats: [
          ["Diámetro", "1,391,000 km"],
          ["Distancia al Sol", "—"],
          ["Periodo orbital", "—"],
          ["Día", "~27 días"],
          ["Lunas", "—"],
          ["Temperatura", "~5,500 °C"]
        ]
      };
    }

    if (key === "moon") {
      return {
        key: "moon",
        name: "Luna",
        colorHex: "#c9c9c9",
        texture: texMoon,
        stats: [
          ["Diámetro", "3,474 km"],
          ["Distancia al Sol", "1.00 UA (vía Tierra)"],
          ["Periodo orbital", "~27.3 días"],
          ["Día", "~27.3 días"],
          ["Lunas", "0"],
          ["Temperatura", "−173 a 127 °C"]
        ]
      };
    }

    const planet = PLANETS.find(function (p) { return p.key === key; });

    if (!planet) return null;

    return {
      key: planet.key,
      name: planet.name,
      colorHex: planetHex(planet),
      texture: PLANET_TEXTURES[planet.key],
      stats: getComparableStats(planet)
    };
  }

  function renderCompareRows(entityA, entityB) {

    const html = entityA.stats.map(function (row, index) {

      const label = row[0];
      const valA = row[1];
      const valB = entityB ? entityB.stats[index][1] : null;

      return `
        <div class="compare-row">
          <span class="compare-val">${valA}</span>
          <span class="compare-label">${label}</span>
          <span class="compare-val ${valB ? "" : "empty"}">${valB || "—"}</span>
        </div>
      `;
    }).join("");

    document.getElementById("compare-stats").innerHTML = html;
  }

  function fillSwatch(el, entity) {

    el.classList.remove("compare-swatch-empty");
    el.style.setProperty("--pcolor", entity.colorHex);

    if (entity.texture) {
      el.style.backgroundImage = `url(${entity.texture})`;
    } else {
      el.style.backgroundImage = "none";
    }
  }

  function openCompare() {

    if (!currentInfoKey) return;

    comparePlanetA = buildCompareEntity(currentInfoKey);

    if (!comparePlanetA) return;

    fillSwatch(document.getElementById("compare-swatch-a"), comparePlanetA);
    document.getElementById("compare-name-a").textContent = comparePlanetA.name;

    const allKeys = [
      { key: "sun", name: "Sol" },
      { key: "moon", name: "Luna" }
    ].concat(
      PLANETS.map(function (p) { return { key: p.key, name: p.name }; })
    );

    compareSelect.innerHTML =
      '<option value="">Elegir planeta…</option>' +
      allKeys
        .filter(function (item) { return item.key !== comparePlanetA.key; })
        .map(function (item) { return `<option value="${item.key}">${item.name}</option>`; })
        .join("");

    const swatchB = document.getElementById("compare-swatch-b");
    swatchB.style.backgroundImage = "none";
    swatchB.classList.add("compare-swatch-empty");

    let nameB = document.getElementById("compare-name-b");
    if (nameB) nameB.textContent = "";

    renderCompareRows(comparePlanetA, null);

    compareOverlay.classList.add("open");
  }

  function closeCompare() {
    compareOverlay.classList.remove("open");
  }

  if (compareTrigger) {
    compareTrigger.addEventListener("click", openCompare);
  }

  if (compareCloseBtn) {
    compareCloseBtn.addEventListener("click", closeCompare);
  }

  if (compareOverlay) {
    compareOverlay.addEventListener("click", function (event) {
      if (event.target === compareOverlay) closeCompare();
    });
  }

  if (compareSelect) {
    compareSelect.addEventListener("change", function () {

      const key = compareSelect.value;
      const swatchB = document.getElementById("compare-swatch-b");
      const entityB = key ? buildCompareEntity(key) : null;

      if (!entityB) {
        swatchB.style.backgroundImage = "none";
        swatchB.classList.add("compare-swatch-empty");

        const nameB = document.getElementById("compare-name-b");
        if (nameB) nameB.textContent = "";

        renderCompareRows(comparePlanetA, null);
        return;
      }

      fillSwatch(swatchB, entityB);

      let nameB = document.getElementById("compare-name-b");
      if (!nameB) {
        nameB = document.createElement("h3");
        nameB.id = "compare-name-b";
        swatchB.insertAdjacentElement("afterend", nameB);
      }
      nameB.textContent = entityB.name;

      renderCompareRows(comparePlanetA, entityB);
    });
  }

  /* ============================================================
     VISTA EN PRIMERA PERSONA
     ============================================================ */

  let fpsMode = false;
  let fpsPlanet = null;
  let fpsYaw = 0;
  let fpsPitch = 0.1;
  let savedCam = null;

  const fpsTrigger = document.getElementById("ip-fps");
  const fpsExitBtn = document.getElementById("fps-exit");

  function updateFPSCamera() {

    const center = getWorldPosition(fpsPlanet);

    const surfacePoint = fpsPlanet.mesh.localToWorld(
      new THREE.Vector3(0, fpsPlanet.radius * 1.04, 0)
    );

    camera.position.copy(surfacePoint);

    const up = surfacePoint.clone().sub(center).normalize();
    camera.up.copy(up);

    const reference =
      Math.abs(up.y) > 0.9
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 1, 0);

    const east = new THREE.Vector3().crossVectors(up, reference).normalize();
    const north = new THREE.Vector3().crossVectors(east, up).normalize();

    const lookDir = new THREE.Vector3();

    lookDir.addScaledVector(north, Math.cos(fpsYaw) * Math.cos(fpsPitch));
    lookDir.addScaledVector(east, Math.sin(fpsYaw) * Math.cos(fpsPitch));
    lookDir.addScaledVector(up, Math.sin(fpsPitch));
    lookDir.normalize();

    const lookTarget = surfacePoint.clone().addScaledVector(lookDir, 50);

    camera.lookAt(lookTarget);
  }

  function getFPSTarget(key) {

    if (key === "sun") {
      return { mesh: sunMesh, radius: SUN_RADIUS };
    }

    if (key === "moon" && earthEntry && earthEntry.data._moon) {
      return { mesh: earthEntry.data._moon, radius: earthEntry.radius * 0.27 };
    }

    return planetMeshes.find(function (entry) {
      return entry.data.key === key;
    }) || null;
  }

  function enterFPS() {

    if (!currentInfoKey) return;

    const target = getFPSTarget(currentInfoKey);

    if (!target) return;

    fpsPlanet = target;
    fpsMode = true;
    fpsYaw = 0;
    fpsPitch = 0.1;
    inertiaActive = false;

    savedCam = {
      theta: cam.theta,
      phi: cam.phi,
      radius: cam.radius,
      target: cam.target.clone()
    };

    selected = null;
    focusing = false;

    camRadiusTarget = cam.radius;

    infoPanel.classList.remove("open");

    if (fpsExitBtn) fpsExitBtn.style.display = "flex";
  }

  function exitFPS() {

    fpsMode = false;
    fpsPlanet = null;

    camera.up.set(0, 1, 0);

    if (savedCam) {
      cam.theta = savedCam.theta;
      cam.phi = savedCam.phi;
      cam.radius = savedCam.radius;
      cam.target.copy(savedCam.target);
    }

    camThetaTarget = cam.theta;
    camPhiTarget = cam.phi;
    camRadiusTarget = cam.radius;

    updateCameraPosition();

    if (fpsExitBtn) fpsExitBtn.style.display = "none";
  }

  if (fpsTrigger) {
    fpsTrigger.addEventListener("click", enterFPS);
  }

  if (fpsExitBtn) {
    fpsExitBtn.addEventListener("click", exitFPS);
  }

  /* ============================================================
     TOUR GUIADO AUTOMÁTICO
     ============================================================ */

  let tourActive = false;
  let tourIndex = 0;
  let tourTimer = null;
  const TOUR_STEP_MS = 5500;

  const tourButton = document.getElementById("btn-tour");
  const tourBadge = document.getElementById("tour-badge");

  function tourGoToStep() {

    const entry = planetMeshes[tourIndex];

    if (!entry) {
      stopTour();
      return;
    }

    selectPlanet(entry);

    if (tourBadge) {
      tourBadge.style.display = "flex";
      tourBadge.textContent =
        "🚀 Tour: " + entry.data.name +
        " (" + (tourIndex + 1) + "/" + planetMeshes.length + ") · Detener";
    }
  }

  function startTour() {

    tourActive = true;
    tourIndex = 0;

    if (tourButton) tourButton.classList.add("active");

    tourGoToStep();

    tourTimer = setInterval(function () {

      if (!tourActive) return;

      tourIndex++;

      if (tourIndex >= planetMeshes.length) {
        stopTour();
        return;
      }

      tourGoToStep();

    }, TOUR_STEP_MS);
  }

  function stopTour() {

    tourActive = false;

    if (tourTimer) {
      clearInterval(tourTimer);
      tourTimer = null;
    }

    if (tourButton) tourButton.classList.remove("active");
    if (tourBadge) tourBadge.style.display = "none";
  }

  if (tourButton) {
    tourButton.addEventListener("click", function () {
      if (tourActive) {
        stopTour();
      } else {
        startTour();
      }
    });
  }

  if (tourBadge) {
    tourBadge.addEventListener("click", stopTour);
  }

  /* ============================================================
     ATAJOS DE TECLADO
     ============================================================ */

  window.addEventListener("keydown", function (event) {

    const tag =
      document.activeElement &&
      document.activeElement.tagName;

    if (
      tag === "SELECT" ||
      tag === "INPUT" ||
      tag === "TEXTAREA"
    ) return;

    if (event.code === "Space") {

      event.preventDefault();

      if (playButton) playButton.click();

      return;
    }

    const num = parseInt(event.key, 10);

    if (num >= 1 && num <= planetMeshes.length) {

      const entry = planetMeshes[num - 1];

      if (entry) selectPlanet(entry);
    }
  });

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        event.stopPropagation();

        closeInfo();
      }
    );
  }

  /* ============================================================
     NARRACIÓN POR VOZ
     ============================================================ */

  const speakButton = document.getElementById("ip-speak");

  let cachedVoice = null;
  let voicesReady = false;

  const NATURAL_VOICE_HINTS = ["natural", "online", "neural", "google"];

  const PREFERRED_MALE_VOICE_NAMES = [
    "jorge", "pablo", "alvaro", "álvaro", "diego", "miguel",
    "juan", "carlos", "raul", "raúl", "fernando", "enrique",
    "google español", "male"
  ];

  function pickSpanishMaleVoice() {

    const voices = window.speechSynthesis.getVoices();

    if (!voices || !voices.length) return null;

    const spanishVoices = voices.filter(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf("es") === 0;
    });

    const pool = spanishVoices.length ? spanishVoices : voices;

    /* Primero: voces masculinas que además suenan "naturales"
       (las voces Online/Natural/Neural de Windows y Chrome son
       mucho menos robóticas que las voces locales clásicas) */
    for (let i = 0; i < PREFERRED_MALE_VOICE_NAMES.length; i++) {

      const naturalMatch = pool.find(function (v) {

        const lower = v.name.toLowerCase();

        const isMaleName = lower.indexOf(PREFERRED_MALE_VOICE_NAMES[i]) !== -1;
        const isNatural = NATURAL_VOICE_HINTS.some(function (hint) {
          return lower.indexOf(hint) !== -1;
        });

        return isMaleName && isNatural;
      });

      if (naturalMatch) return naturalMatch;
    }

    /* Segundo: cualquier voz masculina, aunque no sea "natural" */
    for (let i = 0; i < PREFERRED_MALE_VOICE_NAMES.length; i++) {

      const match = pool.find(function (v) {
        return v.name.toLowerCase().indexOf(PREFERRED_MALE_VOICE_NAMES[i]) !== -1;
      });

      if (match) return match;
    }

    /* Tercero: cualquier voz en español marcada como "natural" */
    const anyNatural = pool.find(function (v) {

      const lower = v.name.toLowerCase();

      return NATURAL_VOICE_HINTS.some(function (hint) {
        return lower.indexOf(hint) !== -1;
      });
    });

    if (anyNatural) return anyNatural;

    return pool[0];
  }

  function ensureVoicesLoaded(callback) {

    if (voicesReady) {
      callback();
      return;
    }

    const existing = window.speechSynthesis.getVoices();

    if (existing && existing.length) {
      voicesReady = true;
      callback();
      return;
    }

    window.speechSynthesis.onvoiceschanged = function () {
      voicesReady = true;
      callback();
    };
  }

  function stopSpeech() {

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (bgAudio && bgAudioStarted) {
      fadeBgAudioTo(BG_AUDIO_NORMAL_VOLUME, 0.02);
    }

    if (speakButton) {
      speakButton.textContent = "🔊";
      speakButton.classList.remove("active");
    }
  }

    function speakNow() {

    if (bgAudio && bgAudioStarted) {
      fadeBgAudioTo(BG_AUDIO_DUCKED_VOLUME, 0.03);
    }

    const name = document.getElementById("ip-name").textContent;
    const desc = document.getElementById("ip-desc").textContent;

    if (!cachedVoice) cachedVoice = pickSpanishMaleVoice();

    const utterance = new SpeechSynthesisUtterance(name + ". " + desc);

    utterance.lang = "es-ES";
    utterance.rate = 0.93;
    utterance.pitch = 0.85;
    utterance.volume = 1;

    if (cachedVoice) utterance.voice = cachedVoice;

    utterance.onend = function () {

      if (bgAudio && bgAudioStarted) {
        fadeBgAudioTo(BG_AUDIO_NORMAL_VOLUME, 0.02);
      }

      if (speakButton) {
        speakButton.textContent = "🔊";
        speakButton.classList.remove("active");
      }
    };

    window.speechSynthesis.speak(utterance);

    if (speakButton) {
      speakButton.textContent = "⏹";
      speakButton.classList.add("active");
    }
  }

  function toggleSpeech() {

    if (!window.speechSynthesis) return;

    if (window.speechSynthesis.speaking) {
      stopSpeech();
      return;
    }

    ensureVoicesLoaded(speakNow);
  }

  if (speakButton) {
    speakButton.addEventListener("click", toggleSpeech);
  }

  /* ============================================================
     TARJETA COLECCIONABLE
     ============================================================ */

  const cardButton = document.getElementById("ip-card");

  function generateCollectibleCard(key) {

    const entity = buildCompareEntity(key);

    if (!entity) return;

    const cardCanvas = document.createElement("canvas");
    cardCanvas.width = 420;
    cardCanvas.height = 640;

    const ctx = cardCanvas.getContext("2d");

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 640);
    bgGrad.addColorStop(0, "#0b1020");
    bgGrad.addColorStop(1, "#02030a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 420, 640);

    ctx.strokeStyle = "rgba(180,205,245,0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 408, 628);

    function finishCard(img) {

      const cx = 210, cy = 170, r = 110;

      const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, r + 40);
      glow.addColorStop(0, entity.colorHex + "aa");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (img) {
        ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
      } else {
        ctx.fillStyle = entity.colorHex;
        ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      }

      ctx.restore();

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = entity.colorHex;
      ctx.font = "700 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("SISTEMA SOLAR · CONSOLA ORBITAL", 210, 310);

      ctx.fillStyle = "#ffffff";
      ctx.font = "700 34px sans-serif";
      ctx.fillText(entity.name, 210, 355);

      let y = 400;

      entity.stats.forEach(function (row) {

        ctx.fillStyle = "#71809a";
        ctx.font = "600 11px monospace";
        ctx.textAlign = "left";
        ctx.fillText(String(row[0]).toUpperCase(), 40, y);

        ctx.fillStyle = "#e9eff9";
        ctx.font = "700 13px monospace";
        ctx.textAlign = "right";
        ctx.fillText(String(row[1]), 380, y);

        ctx.strokeStyle = "rgba(180,205,245,0.12)";
        ctx.beginPath();
        ctx.moveTo(40, y + 10);
        ctx.lineTo(380, y + 10);
        ctx.stroke();

        y += 34;
      });

      ctx.textAlign = "center";
      ctx.fillStyle = "#5c6883";
      ctx.font = "600 10px monospace";
      ctx.fillText(
        "Generado el " + new Date().toLocaleDateString("es"),
        210,
        610
      );

      cardCanvas.toBlob(function (blob) {

        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "tarjeta-" + entity.key + ".png";
        link.click();

        URL.revokeObjectURL(url);

      }, "image/png");
    }

    if (entity.texture) {

      const img = new Image();
      img.onload = function () { finishCard(img); };
      img.onerror = function () { finishCard(null); };
      img.src = entity.texture;

    } else {

      finishCard(null);
    }
  }

  if (cardButton) {
    cardButton.addEventListener("click", function () {
      if (currentInfoKey) generateCollectibleCard(currentInfoKey);
    });
  }

  /* ============================================================
     COMPARADOR DE TEMPERATURAS (todos los planetas)
     ============================================================ */

  const TEMP_CHART_MIN = -220;
  const TEMP_CHART_MAX = 470;

  const tempChartBtn = document.getElementById("btn-temp-chart");
  const tempOverlay = document.getElementById("temp-overlay");
  const tempCloseBtn = document.getElementById("temp-close");
  const tempChartEl = document.getElementById("temp-chart");

  function parseTempAverage(tempC) {

    const numbers = String(tempC)
      .replace(/−/g, "-")
      .match(/-?\d+(\.\d+)?/g);

    if (!numbers || !numbers.length) return null;

    const values = numbers.map(Number);

    return (Math.min.apply(null, values) + Math.max.apply(null, values)) / 2;
  }

  function renderTempChart() {

    const rows = PLANETS.map(function (planet) {
      return {
        name: planet.name,
        key: planet.key,
        avg: parseTempAverage(planet.tempC)
      };
    }).filter(function (row) { return row.avg !== null; });

    tempChartEl.innerHTML = rows.map(function (row) {

      const clamped = Math.max(TEMP_CHART_MIN, Math.min(TEMP_CHART_MAX, row.avg));
      const percent = ((clamped - TEMP_CHART_MIN) / (TEMP_CHART_MAX - TEMP_CHART_MIN)) * 100;

      return `
        <div class="temp-chart-row ${row.key === "earth" ? "temp-chart-earth" : ""}">
          <div class="temp-chart-head">
            <span class="temp-chart-name">${row.name}</span>
            <span class="temp-chart-value">${row.avg.toFixed(0)}°C</span>
          </div>
          <div class="temp-chart-track">
            <div class="temp-chart-fill" data-target="${percent}"></div>
          </div>
        </div>
      `;
    }).join("");

    const fills = tempChartEl.querySelectorAll(".temp-chart-fill");

    fills.forEach(function (fill) {
      fill.style.width = "0%";
    });

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fills.forEach(function (fill) {
          fill.style.width = fill.getAttribute("data-target") + "%";
        });
      });
    });
  }

  function openTempChart() {
    renderTempChart();
    tempOverlay.classList.add("open");
  }

  function closeTempChart() {
    tempOverlay.classList.remove("open");
  }

  if (tempChartBtn) {
    tempChartBtn.addEventListener("click", openTempChart);
  }

  if (tempCloseBtn) {
    tempCloseBtn.addEventListener("click", closeTempChart);
  }

  if (tempOverlay) {
    tempOverlay.addEventListener("click", function (event) {
      if (event.target === tempOverlay) closeTempChart();
    });
  }

  /* ============================================================
     FILTRO: ROCOSOS / GIGANTES GASEOSOS
     ============================================================ */

  const ROCKY_KEYS = ["mercury", "venus", "earth", "mars"];

  const filterAllBtn = document.getElementById("filter-all");
  const filterRockyBtn = document.getElementById("filter-rocky");
  const filterGiantsBtn = document.getElementById("filter-giants");

  function setActiveFilterButton(activeBtn) {

    [filterAllBtn, filterRockyBtn, filterGiantsBtn].forEach(function (btn) {
      if (btn) btn.classList.toggle("active", btn === activeBtn);
    });
  }

  function applyPlanetFilter(mode, activeBtn) {

    planetMeshes.forEach(function (entry, index) {

      const isRocky = ROCKY_KEYS.indexOf(entry.data.key) !== -1;

      const matches =
        mode === "all" ||
        (mode === "rocky" && isRocky) ||
        (mode === "giants" && !isRocky);

      entry.mesh.material.transparent = true;
      entry.mesh.material.opacity = matches ? 1 : 0.15;

      const label = labelEls[entry.data.key];
      if (label) label.style.opacity = matches ? "1" : "0.3";

      const orbitLine = orbitLines[index];
      if (orbitLine) {
        orbitLine.material.opacity = matches ? 0.4 : 0.1;
      }
    });

    setActiveFilterButton(activeBtn);
  }

  if (filterAllBtn) {
    filterAllBtn.addEventListener("click", function () {
      applyPlanetFilter("all", filterAllBtn);
    });
  }

  if (filterRockyBtn) {
    filterRockyBtn.addEventListener("click", function () {
      applyPlanetFilter("rocky", filterRockyBtn);
    });
  }

  if (filterGiantsBtn) {
    filterGiantsBtn.addEventListener("click", function () {
      applyPlanetFilter("giants", filterGiantsBtn);
    });
  }

  /* ============================================================
     CLASIFICADOR INTERACTIVO (arrastrar y soltar)
     ============================================================ */

  const classifierButton = document.getElementById("btn-classifier");
  const classifierOverlay = document.getElementById("classifier-overlay");
  const classifierCloseBtn = document.getElementById("classifier-close");
  const classifierPool = document.getElementById("classifier-pool");
  const classifierCheckBtn = document.getElementById("classifier-check");
  const classifierFeedback = document.getElementById("classifier-feedback");
  const classifierDrops = document.querySelectorAll(".classifier-bin-drop");

  let classifierSelectedChip = null;

  function createClassifierChip(planet) {

    const chip = document.createElement("div");
    chip.className = "classifier-chip";
    chip.textContent = planet.name;
    chip.dataset.key = planet.key;
    chip.draggable = true;

    chip.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text/plain", planet.key);
    });

    chip.addEventListener("click", function () {

      if (chip.classList.contains("correct") || chip.classList.contains("wrong")) return;

      if (classifierSelectedChip === chip) {
        chip.classList.remove("selected");
        classifierSelectedChip = null;
        return;
      }

      if (classifierSelectedChip) classifierSelectedChip.classList.remove("selected");

      classifierSelectedChip = chip;
      chip.classList.add("selected");
    });

    return chip;
  }

  function resetClassifier() {

    classifierSelectedChip = null;
    classifierFeedback.textContent = "";
    classifierFeedback.className = "classifier-feedback";
    classifierCheckBtn.textContent = "Verificar";

    classifierPool.innerHTML = "";

    const shuffled = shuffleArray(PLANETS);

    shuffled.forEach(function (planet) {
      classifierPool.appendChild(createClassifierChip(planet));
    });

    classifierDrops.forEach(function (drop) {
      drop.innerHTML = "";
    });
  }

  function openClassifier() {
    resetClassifier();
    classifierOverlay.classList.add("open");
  }

  function closeClassifier() {
    classifierOverlay.classList.remove("open");
  }

  classifierDrops.forEach(function (drop) {

    drop.addEventListener("dragover", function (event) {
      event.preventDefault();
      drop.classList.add("drag-over");
    });

    drop.addEventListener("dragleave", function () {
      drop.classList.remove("drag-over");
    });

    drop.addEventListener("drop", function (event) {

      event.preventDefault();
      drop.classList.remove("drag-over");

      const key = event.dataTransfer.getData("text/plain");
      const chip = classifierPool.querySelector('[data-key="' + key + '"]') ||
        document.querySelector('.classifier-bin-drop [data-key="' + key + '"]');

      if (chip) drop.appendChild(chip);
    });

    drop.addEventListener("click", function () {

      if (!classifierSelectedChip) return;

      drop.appendChild(classifierSelectedChip);
      classifierSelectedChip.classList.remove("selected");
      classifierSelectedChip = null;
    });
  });

  if (classifierCheckBtn) {

    classifierCheckBtn.addEventListener("click", function () {

      if (classifierCheckBtn.textContent === "Reintentar") {
        resetClassifier();
        return;
      }

      let correctCount = 0;
      let totalPlaced = 0;

      classifierDrops.forEach(function (drop) {

        const category = drop.getAttribute("data-category");

        Array.from(drop.children).forEach(function (chip) {

          totalPlaced++;

          const isRocky = ROCKY_KEYS.indexOf(chip.dataset.key) !== -1;
          const expectedCategory = isRocky ? "rocky" : "giants";
          const isCorrect = expectedCategory === category;

          chip.classList.add(isCorrect ? "correct" : "wrong");
          chip.draggable = false;

          if (isCorrect) correctCount++;
        });
      });

      const remaining = PLANETS.length - totalPlaced;

      classifierFeedback.className =
        "classifier-feedback " + (correctCount === PLANETS.length ? "quiz-feedback-correct" : "");

      classifierFeedback.textContent =
        remaining > 0
          ? "Te faltan " + remaining + " planetas por clasificar."
          : correctCount === PLANETS.length
            ? "🏆 ¡Perfecto! Clasificaste los 8 planetas correctamente."
            : "Acertaste " + correctCount + " de " + PLANETS.length + ".";

      if (remaining === 0) {
        classifierCheckBtn.textContent = "Reintentar";
      }
    });
  }

  if (classifierButton) {
    classifierButton.addEventListener("click", openClassifier);
  }

  if (classifierCloseBtn) {
    classifierCloseBtn.addEventListener("click", closeClassifier);
  }

  if (classifierOverlay) {
    classifierOverlay.addEventListener("click", function (event) {
      if (event.target === classifierOverlay) closeClassifier();
    });
  }

  /* ============================================================
     MODO IMPACTO
     ============================================================ */

  let impactActive = false;
  let impactPhase = null;
  let impactElapsed = 0;
  let impactShakeElapsed = 0;
  let impactHoldElapsed = 0;
  let impactReturnElapsed = 0;
  let impactRock = null;
  let impactTarget = null;
  let impactStartPos = null;
  let impactEndPos = null;
  let impactCenterStart = null;
  let impactDir = null;
  let impactSavedCam = null;

  let impactFlash = null;
  let impactFlashElapsed = 0;
  let impactDebris = null;
  let impactDebrisElapsed = 0;
  let impactDebrisVelocities = null;

  const IMPACT_TRAVEL_DURATION = 2.2;
  const IMPACT_SHAKE_DURATION = 0.5;
  const IMPACT_HOLD_DURATION = 3.4;
  const IMPACT_RETURN_DURATION = 1.5;
  const IMPACT_FLASH_DURATION = 0.55;
  const IMPACT_DEBRIS_DURATION = 1.3;
  const IMPACT_TARGETS = ["mercury", "venus", "earth", "mars", "moon"];

  const impactButton = document.getElementById("btn-impact");
  const impactOverlay = document.getElementById("impact-overlay");
  const impactCloseBtn = document.getElementById("impact-close");
  const impactSelect = document.getElementById("impact-select");
  const impactStartBtn = document.getElementById("impact-start");
  const impactCaption = document.getElementById("impact-caption");

  function impactEase(t) {
    return t * t * (3 - 2 * t);
  }

  function pickRandomSurfaceDir() {
    const v = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    );
    if (v.lengthSq() < 0.0001) v.set(0, 1, 0);
    return v.normalize();
  }

  function populateImpactSelect() {
    impactSelect.innerHTML = IMPACT_TARGETS.map(function (key) {
      const name = key === "moon" ? "Luna" : PLANETS.find(function (p) { return p.key === key; }).name;
      return '<option value="' + key + '">' + name + '</option>';
    }).join("");
  }

  function openImpactPanel() {
    populateImpactSelect();
    impactOverlay.classList.add("open");
  }

  function closeImpactPanel() {
    impactOverlay.classList.remove("open");
  }

  function createImpactFlash(worldPoint) {

    if (!impactFlash) {

      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;

      const ctx = canvas.getContext("2d");
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);

      gradient.addColorStop(0, "rgba(255,255,240,1)");
      gradient.addColorStop(0.25, "rgba(255,200,120,0.9)");
      gradient.addColorStop(0.6, "rgba(255,120,60,0.35)");
      gradient.addColorStop(1, "rgba(255,80,40,0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);

      const texture = new THREE.CanvasTexture(canvas);

      impactFlash = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );

      scene.add(impactFlash);
    }

    impactFlash.visible = true;
    impactFlash.position.copy(worldPoint);
    impactFlash.material.opacity = 1;
    impactFlash.scale.setScalar(impactTarget.radius * 0.4);
    impactFlashElapsed = 0;
  }

  function createImpactDebris(worldPoint, localNormal) {

    const count = 34;
    const positions = new Float32Array(count * 3);

    impactDebrisVelocities = [];

    for (let i = 0; i < count; i++) {

      positions[i * 3] = worldPoint.x;
      positions[i * 3 + 1] = worldPoint.y;
      positions[i * 3 + 2] = worldPoint.z;

      const spread = new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5),
        (Math.random() - 0.5)
      );

      const dir = localNormal.clone()
        .multiplyScalar(1.4)
        .add(spread)
        .normalize();

      const speed = impactTarget.radius * (0.9 + Math.random() * 1.6);

      impactDebrisVelocities.push(dir.multiplyScalar(speed));
    }

    if (impactDebris) {
      scene.remove(impactDebris);
      impactDebris.geometry.dispose();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffd9a8,
      size: Math.max(0.3, impactTarget.radius * 0.08),
      transparent: true,
      opacity: 1,
      depthWrite: false
    });

    impactDebris = new THREE.Points(geometry, material);
    scene.add(impactDebris);

    impactDebrisElapsed = 0;
  }

  function updateImpactVisuals(delta) {

    if (impactFlash && impactFlash.visible) {

      impactFlashElapsed += delta;

      const t = Math.min(impactFlashElapsed / IMPACT_FLASH_DURATION, 1);

      impactFlash.material.opacity = 1 - t;
      impactFlash.scale.setScalar(impactTarget.radius * (0.4 + t * 0.9));

      if (t >= 1) impactFlash.visible = false;
    }

    if (impactDebris) {

      impactDebrisElapsed += delta;

      const t = Math.min(impactDebrisElapsed / IMPACT_DEBRIS_DURATION, 1);

      const position = impactDebris.geometry.attributes.position;

      for (let i = 0; i < impactDebrisVelocities.length; i++) {

        const velocity = impactDebrisVelocities[i];

        position.array[i * 3] += velocity.x * delta;
        position.array[i * 3 + 1] += velocity.y * delta;
        position.array[i * 3 + 2] += velocity.z * delta;
      }

      position.needsUpdate = true;
      impactDebris.material.opacity = 1 - t;

      if (t >= 1) {
        scene.remove(impactDebris);
        impactDebris.geometry.dispose();
        impactDebris = null;
      }
    }
  }

  function startImpact() {

    const key = impactSelect.value;
    const target = getFPSTarget(key);

    if (!target) return;

    closeImpactPanel();
    closeInfo();
    stopTour();
    if (fpsMode) exitFPS();

    impactTarget = target;

    impactSavedCam = {
      theta: cam.theta,
      phi: cam.phi,
      radius: cam.radius,
      target: cam.target.clone()
    };

    const center = getWorldPosition(target);
    impactCenterStart = center.clone();

    impactDir = pickRandomSurfaceDir();
    impactEndPos = center.clone().addScaledVector(impactDir, target.radius * 1.02);
    impactStartPos = center.clone().addScaledVector(impactDir, target.radius * 26);

    if (!impactRock) {
      const geo = new THREE.IcosahedronGeometry(1, 2);
      const mat = new THREE.MeshStandardMaterial({
        map: loadRealTexture(texAsteroid),
        roughness: 1,
        metalness: 0
      });
      impactRock = new THREE.Mesh(geo, mat);
      scene.add(impactRock);
    }

    impactRock.visible = true;
    impactRock.scale.setScalar(Math.max(0.4, target.radius * 0.18));
    impactRock.position.copy(impactStartPos);

    cam.target.copy(center);
    cam.radius = target.radius * 14;
    updateCameraPosition();

    impactElapsed = 0;
    impactPhase = "traveling";
    impactActive = true;
    inertiaActive = false;

    if (impactButton) impactButton.classList.add("active");
  }

  function finishImpactTravel() {

    impactRock.visible = false;

    const worldPoint = impactEndPos.clone();
    const localPoint = impactTarget.mesh.worldToLocal(worldPoint.clone());
    const localNormalPoint = impactTarget.mesh.worldToLocal(worldPoint.clone().add(impactDir));
    const localNormal = localNormalPoint.clone().sub(localPoint).normalize();

    const craterGeo = new THREE.CircleGeometry(impactTarget.radius * 0.16, 24);
    const craterMat = new THREE.MeshBasicMaterial({
      color: 0x1a1410,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const crater = new THREE.Mesh(craterGeo, craterMat);

    crater.position.copy(localPoint).addScaledVector(localNormal, 0.02);
    crater.lookAt(localPoint.clone().add(localNormal));

    impactTarget.mesh.add(crater);

    const rimGeo = new THREE.RingGeometry(
      impactTarget.radius * 0.16,
      impactTarget.radius * 0.21,
      24
    );
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0xcbb89a,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);

    rim.position.copy(crater.position);
    rim.lookAt(localPoint.clone().add(localNormal));

    impactTarget.mesh.add(rim);

    createImpactFlash(worldPoint);
    createImpactDebris(worldPoint, impactDir);

    impactShakeElapsed = 0;
    impactPhase = "shaking";

    if (impactCaption) {
      impactCaption.textContent =
        "💥 Impacto simulado — los cráteres reales se forman por el choque a alta velocidad de asteroides o cometas contra la superficie.";
      impactCaption.classList.add("show");
    }
  }

  function beginImpactHold() {

    updateCameraPosition();

    impactHoldElapsed = 0;
    impactPhase = "holding";
  }

  function beginImpactReturn() {

    if (impactCaption) impactCaption.classList.remove("show");

    impactReturnElapsed = 0;
    impactPhase = "returning";
  }

  function finishImpact() {

    impactPhase = null;
    impactActive = false;

    if (impactButton) impactButton.classList.remove("active");
  }

  function updateImpact(delta) {

    updateImpactVisuals(delta);

    if (impactPhase === "traveling") {

      impactElapsed += delta;

      const t = Math.min(impactElapsed / IMPACT_TRAVEL_DURATION, 1);
      const eased = impactEase(t);

      impactRock.position.lerpVectors(impactStartPos, impactEndPos, eased);
      impactRock.rotation.x += delta * 3;
      impactRock.rotation.y += delta * 2;

      const wideRadius = impactTarget.radius * 14;
      const closeRadius = impactTarget.radius * 4.2;

      cam.target.lerpVectors(impactCenterStart, impactEndPos, eased);
      cam.radius = wideRadius + (closeRadius - wideRadius) * eased;

      updateCameraPosition();

      if (t >= 1) finishImpactTravel();

    } else if (impactPhase === "shaking") {

      impactShakeElapsed += delta;

      const shakeAmount = Math.max(0, (1 - impactShakeElapsed / IMPACT_SHAKE_DURATION)) * 0.6;

      if (shakeAmount > 0) {
        camera.position.x += (Math.random() - 0.5) * shakeAmount;
        camera.position.y += (Math.random() - 0.5) * shakeAmount;
      }

      if (impactShakeElapsed >= IMPACT_SHAKE_DURATION) {
        beginImpactHold();
      }

    } else if (impactPhase === "holding") {

      impactHoldElapsed += delta;

      if (impactHoldElapsed >= IMPACT_HOLD_DURATION) {
        beginImpactReturn();
      }

    } else if (impactPhase === "returning") {

      impactReturnElapsed += delta;

      const t = Math.min(impactReturnElapsed / IMPACT_RETURN_DURATION, 1);
      const eased = impactEase(t);

      const closeRadius = impactTarget.radius * 4.2;

      cam.theta = cam.theta + (impactSavedCam.theta - cam.theta) * eased * 0.35;
      cam.phi = cam.phi + (impactSavedCam.phi - cam.phi) * eased * 0.35;
      cam.radius = closeRadius + (impactSavedCam.radius - closeRadius) * eased;
      cam.target.lerpVectors(impactEndPos, impactSavedCam.target, eased);

      updateCameraPosition();

      if (t >= 1) {

        cam.theta = impactSavedCam.theta;
        cam.phi = impactSavedCam.phi;
        cam.radius = impactSavedCam.radius;
        cam.target.copy(impactSavedCam.target);

        updateCameraPosition();

        finishImpact();
      }
    }
  }

  if (impactButton) {
    impactButton.addEventListener("click", openImpactPanel);
  }

  if (impactCloseBtn) {
    impactCloseBtn.addEventListener("click", closeImpactPanel);
  }

  if (impactOverlay) {
    impactOverlay.addEventListener("click", function (event) {
      if (event.target === impactOverlay) closeImpactPanel();
    });
  }

  if (impactStartBtn) {
    impactStartBtn.addEventListener("click", startImpact);
  }

  /* ============================================================
     TUTORIAL DE BIENVENIDA
     ============================================================ */


    const ONBOARDING_STEPS = [
    {
      title: "Bienvenido a la Consola Orbital",
      desc: "Explora el sistema solar en 3D: el Sol, los 8 planetas, la Luna, el cinturón de asteroides y sus datos reales, con proporciones simplificadas para verse bien en pantalla."
    },
    {
      title: "Muévete por el espacio",
      desc: "Arrastra con el mouse (o el dedo) para orbitar la cámara, usa la rueda del mouse (o pellizca con dos dedos en celular) para acercar/alejar, y prueba las teclas 1-8 para saltar directo a cada planeta y la barra espaciadora para pausar."
    },
    {
      title: "Inspecciona cualquier cuerpo",
      desc: "Haz clic en un planeta, el Sol, la Luna o el cinturón de asteroides para ver su panel de información con datos reales: diámetro, distancia, periodo orbital, temperatura, lunas y más."
    },
    {
      title: "Comparador, primera persona y tarjetas",
      desc: "Desde el panel de cualquier cuerpo puedes: comparar sus datos contra otro planeta lado a lado, pararte en su superficie en vista de primera persona, revisar sus misiones espaciales reales, y generar una tarjeta coleccionable descargable con su información."
    },
    {
      title: "Tour guiado y examen",
      desc: "El botón 🚀 activa un recorrido automático por los 8 planetas. El botón 📝 te pone a prueba con un examen de 15 preguntas sobre datos reales del sistema solar, y recuerda tu mejor puntaje entre sesiones."
    },
    {
      title: "Filtros y comparador de temperaturas",
      desc: "Usa 🪨 y 🌀 para resaltar solo los planetas rocosos o los gigantes gaseosos, y 🌡️ para ver una gráfica animada comparando la temperatura de los 8 planetas de un vistazo."
    },
    {
      title: "Clasificador y modo impacto",
      desc: "El botón 🧩 te reta a clasificar los 8 planetas en rocosos o gigantes gaseosos arrastrándolos (o tocándolos). El botón 💥 simula el impacto de un asteroide contra el cuerpo que elijas, dejando un cráter real."
    },
    {
      title: "Ambientación y controles",
      desc: "Al interactuar con la página por primera vez, se reproduce un audio de fondo. Los controles inferiores dejan pausar, mostrar/ocultar órbitas y etiquetas, y restablecer la vista en cualquier momento."
    }
  ];

  let onboardingStep = 0;

  const onboardingOverlay = document.getElementById("onboarding-overlay");
  const onboardingDots = document.getElementById("onboarding-dots");
  const onboardingTitle = document.getElementById("onboarding-title");
  const onboardingDesc = document.getElementById("onboarding-desc");
  const onboardingNext = document.getElementById("onboarding-next");
  const onboardingSkip = document.getElementById("onboarding-skip");
  const helpButton = document.getElementById("btn-help");

  function renderOnboardingStep() {

    const step = ONBOARDING_STEPS[onboardingStep];

    onboardingTitle.textContent = step.title;
    onboardingDesc.textContent = step.desc;

    onboardingDots.innerHTML = ONBOARDING_STEPS.map(function (_, i) {
      return `<span class="${i === onboardingStep ? "active" : ""}"></span>`;
    }).join("");

    onboardingNext.textContent =
      onboardingStep === ONBOARDING_STEPS.length - 1 ? "Comenzar" : "Siguiente";
  }

  function openOnboarding() {
    onboardingStep = 0;
    renderOnboardingStep();
    onboardingOverlay.classList.add("open");
  }

  function closeOnboarding() {
    onboardingOverlay.classList.remove("open");
  }

  if (onboardingNext) {
    onboardingNext.addEventListener("click", function () {
      if (onboardingStep < ONBOARDING_STEPS.length - 1) {
        onboardingStep++;
        renderOnboardingStep();
      } else {
        closeOnboarding();
      }
    });
  }

  if (onboardingSkip) {
    onboardingSkip.addEventListener("click", closeOnboarding);
  }

  if (helpButton) {
    helpButton.addEventListener("click", openOnboarding);
  }

  function maybeShowOnboarding() {
    openOnboarding();
  }

  /* ============================================================
     LÍNEA DE TIEMPO DE MISIONES ESPACIALES
     ============================================================ */

  const MISSIONS = {

    mercury: [
      { year: "1974–75", name: "Mariner 10", agency: "NASA", desc: "Primer sobrevuelo de Mercurio; fotografió cerca de la mitad de su superficie." },
      { year: "2011–2015", name: "MESSENGER", agency: "NASA", desc: "Primera nave en orbitar Mercurio; mapeó su superficie casi por completo." },
      { year: "2018 (en camino)", name: "BepiColombo", agency: "ESA / JAXA", desc: "Misión conjunta europea-japonesa rumbo a Mercurio, con llegada prevista en 2025." }
    ],

    venus: [
      { year: "1970", name: "Venera 7", agency: "URSS", desc: "Primera nave en aterrizar con éxito y transmitir datos desde la superficie de otro planeta." },
      { year: "1975", name: "Venera 9", agency: "URSS", desc: "Envió las primeras imágenes tomadas desde la superficie de Venus." },
      { year: "1990–1994", name: "Magallanes", agency: "NASA", desc: "Mapeó el 98% de la superficie de Venus usando radar, a través de sus densas nubes." },
      { year: "2015–actualidad", name: "Akatsuki", agency: "JAXA", desc: "En órbita, estudia la atmósfera y el clima extremo de Venus." }
    ],

    earth: [
      { year: "1957", name: "Sputnik 1", agency: "URSS", desc: "Primer satélite artificial puesto en órbita, marcó el inicio de la era espacial." },
      { year: "1968", name: "Apollo 8", agency: "NASA", desc: "Primeros humanos en orbitar otro cuerpo (la Luna) y ver la Tierra completa desde el espacio." },
      { year: "1998–actualidad", name: "Estación Espacial Internacional", agency: "NASA / Roscosmos / ESA / JAXA / CSA", desc: "Presencia humana continua en órbita terrestre baja desde hace más de dos décadas." }
    ],

    mars: [
      { year: "1965", name: "Mariner 4", agency: "NASA", desc: "Primer sobrevuelo exitoso de Marte; envió las primeras imágenes cercanas de otro planeta." },
      { year: "1976", name: "Viking 1 y 2", agency: "NASA", desc: "Primeros aterrizajes exitosos y operativos en la superficie marciana." },
      { year: "1997", name: "Mars Pathfinder / Sojourner", agency: "NASA", desc: "Primer róver funcional en la superficie de Marte." },
      { year: "2012–actualidad", name: "Curiosity", agency: "NASA", desc: "Róver que estudia la geología y habitabilidad histórica de Marte." },
      { year: "2021–actualidad", name: "Perseverance / Ingenuity", agency: "NASA", desc: "Búsqueda de señales de vida antigua; Ingenuity fue el primer vuelo controlado en otro planeta." }
    ],

    jupiter: [
      { year: "1973", name: "Pioneer 10", agency: "NASA", desc: "Primera nave en sobrevolar Júpiter y enviar imágenes de cerca." },
      { year: "1979", name: "Voyager 1 y 2", agency: "NASA", desc: "Sobrevuelos que revelaron los anillos de Júpiter y la actividad volcánica de su luna Ío." },
      { year: "1995–2003", name: "Galileo", agency: "NASA", desc: "Primera nave en orbitar Júpiter; lanzó una sonda a su atmósfera." },
      { year: "2016–actualidad", name: "Juno", agency: "NASA", desc: "En órbita, estudia el interior, campo magnético y atmósfera profunda de Júpiter." }
    ],

    saturn: [
      { year: "1979", name: "Pioneer 11", agency: "NASA", desc: "Primer sobrevuelo de Saturno." },
      { year: "1980–1981", name: "Voyager 1 y 2", agency: "NASA", desc: "Estudiaron de cerca los anillos y varias lunas de Saturno." },
      { year: "2004–2017", name: "Cassini-Huygens", agency: "NASA / ESA / ASI", desc: "Orbitó Saturno 13 años; Huygens aterrizó en Titán, su luna más grande." }
    ],

    uranus: [
      { year: "1986", name: "Voyager 2", agency: "NASA", desc: "Única nave que ha visitado Urano; sigue siendo la única visión de cerca que tenemos." }
    ],

    neptune: [
      { year: "1989", name: "Voyager 2", agency: "NASA", desc: "Única nave que ha visitado Neptuno; descubrió su Gran Mancha Oscura y la luna Tritón de cerca." }
    ],

    moon: [
      { year: "1959", name: "Luna 2", agency: "URSS", desc: "Primer objeto hecho por humanos en llegar a otro cuerpo celeste." },
      { year: "1969", name: "Apollo 11", agency: "NASA", desc: "Primer alunizaje tripulado; Neil Armstrong y Buzz Aldrin caminaron sobre la Luna." },
      { year: "2019", name: "Chang'e 4", agency: "CNSA", desc: "Primer alunizaje exitoso en la cara oculta de la Luna." },
      { year: "2022–actualidad", name: "Programa Artemis", agency: "NASA", desc: "Busca regresar humanos a la Luna, incluyendo la primera mujer en pisarla." }
    ],

    sun: [
      { year: "1995–actualidad", name: "SOHO", agency: "NASA / ESA", desc: "Observatorio que monitorea el Sol de forma continua desde hace casi 30 años." },
      { year: "2018–actualidad", name: "Parker Solar Probe", agency: "NASA", desc: "La nave más rápida jamás construida; ha volado más cerca del Sol que ninguna otra." }
    ],

    asteroid: [
      { year: "2011–2015", name: "Dawn", agency: "NASA", desc: "Primera nave en orbitar dos cuerpos distintos del cinturón: el asteroide Vesta y el planeta enano Ceres." }
    ]
  };

  function currentInfoName() {

    const planet = PLANETS.find(function (p) { return p.key === currentInfoKey; });
    if (planet) return planet.name;

    if (currentInfoKey === "sun") return "Sol";
    if (currentInfoKey === "moon") return "Luna";
    if (currentInfoKey === "asteroid") return "Cinturón de asteroides";

    return "";
  }

  const missionsButton = document.getElementById("ip-missions");
  const missionsOverlay = document.getElementById("missions-overlay");
  const missionsCloseBtn = document.getElementById("missions-close");
  const missionsTitle = document.getElementById("missions-title");
  const missionsTimeline = document.getElementById("missions-timeline");

  function openMissions() {

    if (!currentInfoKey) return;

    const list = MISSIONS[currentInfoKey];

    missionsTitle.textContent = currentInfoName();

    if (!list || !list.length) {

      missionsTimeline.innerHTML =
        '<p class="missions-empty">Sin misiones registradas para este cuerpo.</p>';

    } else {

      missionsTimeline.innerHTML = list.map(function (m) {
        return `
          <div class="mission-item">
            <div class="mission-year">${m.year}</div>
            <div class="mission-name">${m.name}</div>
            <div class="mission-agency">${m.agency}</div>
            <div class="mission-desc">${m.desc}</div>
          </div>
        `;
      }).join("");
    }

    missionsOverlay.classList.add("open");
  }

  function closeMissions() {
    missionsOverlay.classList.remove("open");
  }

  if (missionsButton) {
    missionsButton.addEventListener("click", openMissions);
  }

  if (missionsCloseBtn) {
    missionsCloseBtn.addEventListener("click", closeMissions);
  }

  if (missionsOverlay) {
    missionsOverlay.addEventListener("click", function (event) {
      if (event.target === missionsOverlay) closeMissions();
    });
  }

  /* ============================================================
     MODO EXAMEN (15 preguntas, basado en datos reales)
     ============================================================ */

  let quizActive = false;
  let quizBank = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizLocked = false;

  const quizButton = document.getElementById("btn-quiz");
  const quizOverlay = document.getElementById("quiz-overlay");
  const quizCloseBtn = document.getElementById("quiz-close");
  const quizCounterEl = document.getElementById("quiz-counter");
  const quizScoreModalEl = document.getElementById("quiz-score-modal");
  const quizQuestionEl = document.getElementById("quiz-question");
  const quizOptionsEl = document.getElementById("quiz-options");
  const quizFeedbackEl = document.getElementById("quiz-feedback");
  const quizProgressBar = document.getElementById("quiz-progress-bar");

  function setLabelsVisible(visible) {

    Object.values(labelEls).forEach(function (label) {
      label.style.display = visible ? "flex" : "none";
    });

    Object.values(spaceLabels).forEach(function (label) {
      label.style.display = visible ? "block" : "none";
    });
  }

  function P(key) {
    return PLANETS.find(function (p) { return p.key === key; });
  }

  function shuffleArray(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  function buildQuizBank() {

    const bank = [
      {
        question: "¿Cuál es el planeta más cercano al Sol?",
        options: [P("mercury").name, P("venus").name, P("mars").name, P("earth").name],
        correct: P("mercury").name
      },
      {
        question: "¿Cuál es el planeta más grande del sistema solar?",
        options: [P("jupiter").name, P("saturn").name, P("neptune").name, P("uranus").name],
        correct: P("jupiter").name
      },
      {
        question: "¿Cuál es el planeta más pequeño del sistema solar?",
        options: [P("mercury").name, P("mars").name, P("venus").name, P("earth").name],
        correct: P("mercury").name
      },
      {
        question: "¿Qué planeta es conocido como 'el planeta rojo'?",
        options: [P("mars").name, P("venus").name, P("mercury").name, P("jupiter").name],
        correct: P("mars").name
      },
      {
        question: "¿Cuál de estos planetas tiene más lunas conocidas?",
        options: [P("saturn").name, P("jupiter").name, P("uranus").name, P("neptune").name],
        correct: P("saturn").name
      },
      {
        question: "En este planeta, un día (una vuelta sobre su propio eje) dura más que su año (una vuelta al Sol). ¿Cuál es?",
        options: [P("venus").name, P("mercury").name, P("mars").name, P("earth").name],
        correct: P("venus").name
      },
      {
        question: "¿Qué planeta tiene el sistema de anillos más visible y prominente?",
        options: [P("saturn").name, P("uranus").name, P("jupiter").name, P("neptune").name],
        correct: P("saturn").name
      },
      {
        question: "¿Cuál es el planeta más lejano del Sol en nuestro sistema solar?",
        options: [P("neptune").name, P("uranus").name, P("saturn").name, P("jupiter").name],
        correct: P("neptune").name
      },
      {
        question: "Este planeta tiene una inclinación axial tan extrema (~98°) que prácticamente 'rueda' en su órbita. ¿Cuál es?",
        options: [P("uranus").name, P("neptune").name, P("saturn").name, P("mars").name],
        correct: P("uranus").name
      },
      {
        question: "El año de Mercurio (su periodo orbital) dura aproximadamente:",
        options: ["88 días", "225 días", "365 días", "687 días"],
        correct: "88 días"
      },
      {
        question: "De estos planetas, ¿cuál tiene la temperatura media más baja?",
        options: [P("neptune").name, P("uranus").name, P("saturn").name, P("jupiter").name],
        correct: P("neptune").name
      },
      {
        question: "¿Cuál de estos planetas NO tiene ninguna luna?",
        options: [P("venus").name, P("mars").name, P("jupiter").name, P("saturn").name],
        correct: P("venus").name
      },
      {
        question: "¿Cuántas lunas tiene la Tierra?",
        options: ["1", "0", "2", "4"],
        correct: "1"
      },
      {
        question: "¿Cuál de estos es un gigante gaseoso, sin superficie sólida?",
        options: [P("jupiter").name, P("mars").name, P("mercury").name, P("earth").name],
        correct: P("jupiter").name
      },
      {
        question: "¿Cuál de estos dos planetas está más cerca del Sol?",
        options: [P("mars").name, P("jupiter").name],
        correct: P("mars").name
      }
    ];

    return shuffleArray(bank).map(function (q) {
      return Object.assign({}, q, { options: shuffleArray(q.options) });
    });
  }

  let quizBestScore = 0;

  function getQuizBest() {
    return quizBestScore;
  }

  function setQuizBest(score) {
    quizBestScore = score;
  }

  function quizUpdateMeta() {

    quizCounterEl.textContent = "Pregunta " + (quizIndex + 1) + " / " + quizBank.length;
    quizScoreModalEl.textContent = "Puntaje: " + quizScore + " · Mejor: " + getQuizBest();

    quizProgressBar.style.width =
      (quizIndex / quizBank.length) * 100 + "%";
  }

  function quizRenderQuestion() {

    if (quizIndex >= quizBank.length) {
      quizFinish();
      return;
    }

    const q = quizBank[quizIndex];

    quizLocked = false;
    quizFeedbackEl.textContent = "";
    quizFeedbackEl.className = "quiz-feedback";
    quizQuestionEl.textContent = q.question;
    quizUpdateMeta();

    quizOptionsEl.innerHTML = "";

    q.options.forEach(function (optionText) {

      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = optionText;

      btn.addEventListener("click", function () {
        quizAnswer(optionText, q.correct, btn);
      });

      quizOptionsEl.appendChild(btn);
    });
  }

  function quizAnswer(picked, correct, btnEl) {

    if (quizLocked) return;
    quizLocked = true;

    const buttons = quizOptionsEl.querySelectorAll(".quiz-option");

    buttons.forEach(function (btn) {

      btn.classList.add("disabled");

      if (btn.textContent === correct) {
        btn.classList.add("correct");
      } else if (btn === btnEl) {
        btn.classList.add("wrong");
      }
    });

    const isCorrect = picked === correct;

    if (isCorrect) quizScore++;

    quizFeedbackEl.textContent = isCorrect
      ? "¡Correcto!"
      : "Incorrecto — la respuesta era: " + correct;

    quizFeedbackEl.className =
      "quiz-feedback " + (isCorrect ? "quiz-feedback-correct" : "quiz-feedback-wrong");

    setTimeout(function () {
      quizIndex++;
      quizRenderQuestion();
    }, 1600);
  }

  function quizFinish() {

    quizProgressBar.style.width = "100%";
    quizCounterEl.textContent = "Examen completado";
    quizScoreModalEl.textContent = "";

    const previousBest = getQuizBest();
    const isNewBest = quizScore > previousBest;

    if (isNewBest) setQuizBest(quizScore);

    quizQuestionEl.textContent =
      "Puntaje final: " + quizScore + " / " + quizBank.length;

    quizOptionsEl.innerHTML = "";

    quizFeedbackEl.textContent = isNewBest
      ? "🏆 ¡Nuevo mejor puntaje!"
      : "Mejor puntaje guardado: " + Math.max(previousBest, quizScore) + " / " + quizBank.length;

    quizFeedbackEl.className =
      "quiz-feedback " + (isNewBest ? "quiz-feedback-correct" : "");

    const restartBtn = document.createElement("button");
    restartBtn.className = "quiz-option";
    restartBtn.textContent = "Reintentar examen";
    restartBtn.addEventListener("click", startQuiz);

    quizOptionsEl.appendChild(restartBtn);
  }

  function startQuiz() {

    quizBank = buildQuizBank();
    quizIndex = 0;
    quizScore = 0;
    quizActive = true;

    closeInfo();
    stopTour();
    if (fpsMode) exitFPS();

    setLabelsVisible(false);

    if (quizButton) quizButton.classList.add("active");
    if (quizOverlay) quizOverlay.classList.add("open");

    quizRenderQuestion();
  }

  function stopQuiz() {

    quizActive = false;

    setLabelsVisible(showLabels);

    if (quizButton) quizButton.classList.remove("active");
    if (quizOverlay) quizOverlay.classList.remove("open");
  }

  if (quizButton) {
    quizButton.addEventListener("click", function () {
      if (quizActive) {
        stopQuiz();
      } else {
        startQuiz();
      }
    });
  }

  if (quizCloseBtn) {
    quizCloseBtn.addEventListener("click", stopQuiz);
  }

  if (quizOverlay) {
    quizOverlay.addEventListener("click", function (event) {
      if (event.target === quizOverlay) stopQuiz();
    });
  }

  /* ============================================================
     AUDIO DE FONDO (archivo real desde Dropbox)
     ============================================================ */

  let bgAudioStarted = false;

  const bgAudio = document.getElementById("bg-audio");

  const BG_AUDIO_NORMAL_VOLUME = 0.6;
  const BG_AUDIO_DUCKED_VOLUME = 0.15;

  let bgFadeInterval = null;

  function fadeBgAudioTo(target, step) {

    if (!bgAudio) return;

    if (bgFadeInterval) clearInterval(bgFadeInterval);

    bgFadeInterval = setInterval(function () {

      const current = bgAudio.volume;
      const diff = target - current;

      if (Math.abs(diff) < step) {
        bgAudio.volume = target;
        clearInterval(bgFadeInterval);
        bgFadeInterval = null;
        return;
      }

      bgAudio.volume = current + (diff > 0 ? step : -step);

    }, 60);
  }

  function startBgAudio() {

    if (bgAudioStarted || !bgAudio) return;
    bgAudioStarted = true;

    bgAudio.volume = 0;
    bgAudio.play().catch(function () {});

    fadeBgAudioTo(BG_AUDIO_NORMAL_VOLUME, 0.02);

    window.removeEventListener("pointerdown", startBgAudio);
    window.removeEventListener("keydown", startBgAudio);
  }

  window.addEventListener("pointerdown", startBgAudio, { once: true });
  window.addEventListener("keydown", startBgAudio, { once: true });  

  /* ============================================================
     CONTROLES
     ============================================================ */

  let playing = true;

  let showOrbits = true;

  let showLabels = true;

  const timeScale = 0.02;

  /* PLAY */

  const playButton =
    document.getElementById(
      "btn-play"
    );

  if (playButton) {

    playButton.addEventListener(
      "click",
      function () {

        playing =
          !playing;

        const icon = this.querySelector(".control-labeled-icon");
        const title = document.getElementById("btn-play-title");

        if (icon) icon.textContent = playing ? "⏸" : "▶";
        if (title) title.textContent = playing ? "Pausar" : "Reanudar";

        this.classList.toggle(
          "active",
          playing
        );
      }
    );
  }

  /* ORBITAS */

  const orbitButton =
    document.getElementById(
      "btn-orbits"
    );

  if (orbitButton) {

    orbitButton.addEventListener(
      "click",
      function () {

        showOrbits =
          !showOrbits;

        this.classList.toggle(
          "active",
          showOrbits
        );

        const orbitsSub = document.getElementById("btn-orbits-sub");
        if (orbitsSub) orbitsSub.textContent = showOrbits ? "Activadas" : "Desactivadas";

        orbitsGroup.visible =
          showOrbits;
      }
    );
  }

  /* ETIQUETAS */

  const labelButton =
    document.getElementById(
      "btn-labels"
    );

  if (labelButton) {

    labelButton.addEventListener(
      "click",
      function () {

        showLabels =
          !showLabels;

        this.classList.toggle(
          "active",
          showLabels
        );

        const labelsSub = document.getElementById("btn-labels-sub");
        if (labelsSub) labelsSub.textContent = showLabels ? "Activadas" : "Desactivadas";

        Object.values(
          labelEls
        ).forEach(
          function (label) {

            label.style.display =
              showLabels
                ? "flex"
                : "none";
          }
        );

        Object.values(
          spaceLabels
        ).forEach(
          function (label) {

            label.style.display =
              showLabels
                ? "block"
                : "none";
          }
        );
      }
    );
  }


  /* RESET */

  const resetButton =
    document.getElementById(
      "btn-reset"
    );

  if (resetButton) {

    resetButton.addEventListener(
      "click",
      function () {

        cam.theta =
          Math.PI * 0.32;

        cam.phi =
          Math.PI * 0.38;

        cam.radius =
          185;

        camThetaTarget = cam.theta;
        camPhiTarget = cam.phi;
        camRadiusTarget = cam.radius;

        cam.target.set(
          0,
          0,
          0
        );

        selected = null;

        focusing = false;

        infoPanel.classList.remove(
          "open"
        );

        updateCameraPosition();
      }
    );
  }

  /* ============================================================
     ANIMACIÓN
     ============================================================ */

  const clock =
    new THREE.Timer();

  let simDays = 0;

  let frameTime = 0;

  const simDaysElement =
    document.getElementById(
      "sim-days"
    );

  function smooth(
    speed,
    delta
  ) {

    return (
      1 -
      Math.pow(
        1 - speed,
        delta * 60
      )
    );
  }

  function animate() {

    requestAnimationFrame(
      animate
    );

    clock.update();

    const delta =
      Math.min(
        clock.getDelta(),
        0.05
      );

    frameTime += delta;

    /* ========================================================
       SIMULACIÓN
       ======================================================== */

    if (playing) {

      const dayStep =
        delta *
        timeScale *
        3;

      simDays +=
        dayStep;

      if (
        simDaysElement
      ) {

        simDaysElement.textContent =
          Math.floor(
            simDays
          ).toLocaleString(
            "es"
          );
      }

      planetMeshes.forEach(
        function (entry) {

          const planet =
            entry.data;

          /* ORBITA */

          entry.pivot.rotation.y +=
            (
              dayStep /
              planet.periodDays
            ) *
            Math.PI *
            2;

          /* ROTACIÓN */

          const rotation =
            dayStep /
            (
              Math.abs(
                planet.rotHours
              ) / 24
            );

          entry.mesh.rotation.y +=
            rotation *
            Math.PI *
            2 *
            (
              planet.rotHours < 0
                ? -1
                : 1
            );

          /* LUNA */

          if (
            planet._moonPivot
          ) {

            planet._moonPivot.rotation.y +=
              delta * 0.8;
          }

          /* LUNAS PRINCIPALES (Júpiter / Saturno) */

          if (planet._extraMoonPivots) {

            planet._extraMoonPivots.forEach(function (item) {
              item.pivot.rotation.y += delta * item.speed;
            });
          }
        }
      );

      /* SOL */

      sunMesh.rotation.y +=
        delta * 0.08;

      /* ASTEROIDES */

      asteroidBelt.rotation.y +=
        delta * 0.018;

      asteroidMarker.rotation.y +=
        delta * 0.1;
    }

    /* ========================================================
       ENFOQUE
       ======================================================== */

    if (impactPhase) {

      updateImpact(delta);

    } else if (fpsMode && fpsPlanet) {

      updateFPSCamera();

    } else if (
      focusing &&
      selected
    ) {

      const position =
        getWorldPosition(
          selected
        );

      const ease =
        smooth(
          0.075,
          delta
        );

      cam.target.lerp(
        position,
        ease
      );

      cam.radius +=
        (
          focusRadius -
          cam.radius
        ) *
        ease;

      updateCameraPosition();
    }

    /* ========================================================
       INERCIA DE ARRASTRE
       ======================================================== */

    if (
      inertiaActive &&
      !isDragging &&
      !fpsMode &&
      !impactPhase
    ) {

      const decay =
        Math.pow(
          INERTIA_DECAY,
          delta * 60
        );

      camThetaTarget += thetaVelocity;
      camPhiTarget += phiVelocity;

      camPhiTarget =
        Math.max(
          cam.minPhi,
          Math.min(
            cam.maxPhi,
            camPhiTarget
          )
        );

      thetaVelocity *= decay;
      phiVelocity *= decay;

      if (
        Math.abs(thetaVelocity) < INERTIA_STOP_EPSILON &&
        Math.abs(phiVelocity) < INERTIA_STOP_EPSILON
      ) {
        inertiaActive = false;
      }
    }

    /* ========================================================
       SUAVIZADO DE CÁMARA (arrastrar / zoom)
       ======================================================== */

    if (!impactPhase && !(fpsMode && fpsPlanet)) {

      const camEase = smooth(0.22, delta);

      let thetaDiff = camThetaTarget - cam.theta;
      thetaDiff = ((thetaDiff + Math.PI) % (Math.PI * 2)) - Math.PI;

      cam.theta += thetaDiff * camEase;
      cam.phi += (camPhiTarget - cam.phi) * camEase;

      if (!(focusing && selected)) {
        cam.radius += (camRadiusTarget - cam.radius) * camEase;
      }

      updateCameraPosition();
    }

    /* ========================================================
       ESTRELLAS
       ======================================================== */

    starLayers.forEach(
      function (
        layer,
        index
      ) {

        layer.rotation.y +=
          delta *
          (
            index === 0
              ? 0.0006
              : 0.00025
          );

        layer.rotation.x +=
          delta *
          (
            index === 0
              ? 0.0001
              : 0.00005
          );
      }
    );

    /* ========================================================
       HALO DEL SOL
       ======================================================== */

    glowSprite.material.opacity =
      0.88 +
      Math.sin(
        frameTime * 1.2
      ) *
      0.08;

    /* ========================================================
       ETIQUETAS
       ======================================================== */

    if (showLabels && !quizActive) {

      const projected =
        new THREE.Vector3();

      planetMeshes.forEach(
        function (entry) {

          const label =
            labelEls[
              entry.data.key
            ];

          entry.mesh.getWorldPosition(
            projected
          );

          projected.project(
            camera
          );

          if (
            projected.z > 1 ||
            Math.abs(
              projected.x
            ) > 1.15 ||
            Math.abs(
              projected.y
            ) > 1.15
          ) {

            label.style.display =
              "none";

            return;
          }

          label.style.display =
            "flex";

          const x =
            (
              projected.x *
                0.5 +
              0.5
            ) *
            window.innerWidth;

          const y =
            (
              -projected.y *
                0.5 +
              0.5
            ) *
            window.innerHeight;

          label.style.left =
            x + "px";

          label.style.top =
            (
              y -
              entry.radius *
                4
            ) + "px";
        }
      );

      const spacePosition =
        new THREE.Vector3();

      spaceObjects.forEach(
        function (item) {

          const label =
            spaceLabels[
              item.key
            ];

          item.object.getWorldPosition(
            spacePosition
          );

          spacePosition.project(
            camera
          );

          if (
            spacePosition.z > 1
          ) {

            label.style.display =
              "none";

            return;
          }

          label.style.display =
            "block";

          label.style.left =
            (
              (
                spacePosition.x *
                  0.5 +
                0.5
              ) *
              window.innerWidth
            ) + "px";

          label.style.top =
            (
              (
                -spacePosition.y *
                  0.5 +
                0.5
              ) *
              window.innerHeight -
              20
            ) + "px";
        }
      );
    }

    /* ========================================================
       CALIDAD ADAPTATIVA (evita caídas de frame en movimiento)
       ======================================================== */

    const cameraIsMoving =
      isDragging ||
      isPinching ||
      inertiaActive ||
      (focusing && selected) ||
      (fpsMode && fpsPlanet) ||
      !!impactPhase ||
      Math.abs(camThetaTarget - cam.theta) > 0.0006 ||
      Math.abs(camPhiTarget - cam.phi) > 0.0006 ||
      Math.abs(camRadiusTarget - cam.radius) > 0.015;

    if (ssaoPass.enabled === cameraIsMoving) {
      ssaoPass.enabled = !cameraIsMoving;
    }

    /* ========================================================
       RENDER
       ======================================================== */

      composer.render();
  }

  /* ============================================================
     RESIZE
     ============================================================ */

  function onResize() {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio ||
          1,
        2
      )
    );

      renderer.setSize(
      window.innerWidth,
      window.innerHeight,
      false
    );

    composer.setSize(
      window.innerWidth,
      window.innerHeight
    );

    ssaoPass.setSize(
      window.innerWidth,
      window.innerHeight
    );

    smaaPass.setSize(
      window.innerWidth * renderer.getPixelRatio(),
      window.innerHeight * renderer.getPixelRatio()
    );
  }

  window.addEventListener(
    "resize",
    onResize
  );

  onResize();

  /* ============================================================
     INICIAR
     ============================================================ */

  const loader =
    document.getElementById(
      "loader"
    );

  if (loader) {

    setTimeout(
      function () {

        loader.style.opacity =
          "0";

        setTimeout(
          function () {

            loader.style.display =
              "none";

            maybeShowOnboarding();

          },
          500
        );

      },
      600
    );
  }

  animate();

})();