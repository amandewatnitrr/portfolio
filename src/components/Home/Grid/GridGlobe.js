import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeGlobe from "three-globe";
import countries from "../../../Assets/globe.json";

// Ported from next-portfolio's components/ui/globe.tsx + grid-globe.tsx.
// That version drives three-globe through react-three-fiber, which needs
// React 18+; this app is on React 17, so it's rebuilt here as plain
// three.js (same pattern StarBackground.js already uses) driving the
// same three-globe object directly.

const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const full = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

const sampleArcs = [
  { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -1.303396, endLng: 36.852443, arcAlt: 0.5, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 2, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 2, startLat: 51.5072, startLng: -0.1276, endLat: 3.139, endLng: 101.6869, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 2, startLat: -15.785493, startLng: -47.909029, endLat: 36.162809, endLng: -115.119411, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 3, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 3, startLat: 21.3099, startLng: -157.8581, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 3, startLat: -6.2088, startLng: 106.8456, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 4, startLat: 11.986597, startLng: 8.571831, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.5, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 4, startLat: -34.6037, startLng: -58.3816, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.7, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 4, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.1, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 5, startLat: 14.5995, startLng: 120.9842, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 5, startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 5, startLat: 34.0522, startLng: -118.2437, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 6, startLat: -15.432563, startLng: 28.315853, endLat: 1.094136, endLng: -63.34546, arcAlt: 0.7, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 6, startLat: 37.5665, startLng: 126.978, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.1, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 6, startLat: 22.3193, startLng: 114.1694, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 7, startLat: -19.885592, startLng: -43.951191, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.1, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 7, startLat: 48.8566, startLng: -2.3522, endLat: 52.52, endLng: 13.405, arcAlt: 0.1, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 7, startLat: 52.52, startLng: 13.405, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 8, startLat: -8.833221, startLng: 13.264837, endLat: -33.936138, endLng: 18.436529, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 8, startLat: 49.2827, startLng: -123.1207, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 8, startLat: 1.3521, startLng: 103.8198, endLat: 40.7128, endLng: -74.006, arcAlt: 0.5, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 9, startLat: 51.5072, startLng: -0.1276, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 9, startLat: 22.3193, startLng: 114.1694, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.7, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 9, startLat: 1.3521, startLng: 103.8198, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.5, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 10, startLat: -22.9068, startLng: -43.1729, endLat: 28.6139, endLng: 77.209, arcAlt: 0.7, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 10, startLat: 34.0522, startLng: -118.2437, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 10, startLat: -6.2088, startLng: 106.8456, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 11, startLat: 41.9028, startLng: 12.4964, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 11, startLat: -6.2088, startLng: 106.8456, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 11, startLat: 22.3193, startLng: 114.1694, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 12, startLat: 34.0522, startLng: -118.2437, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.1, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 12, startLat: 35.6762, startLng: 139.6503, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.2, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 12, startLat: 22.3193, startLng: 114.1694, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 13, startLat: 52.52, startLng: 13.405, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 13, startLat: 11.986597, startLng: 8.571831, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 13, startLat: -22.9068, startLng: -43.1729, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.1, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
  { order: 14, startLat: -33.936138, startLng: 18.436529, endLat: 21.395643, endLng: 39.883798, arcAlt: 0.3, color: colors[Math.floor(Math.random() * (colors.length - 1))] },
];

// No requestIdleCallback in Safari; setTimeout(fn, 1) is the standard fallback.
// Bound to window - native timer functions throw "Illegal invocation" if
// called detached from their owning object.
const scheduleIdle =
  typeof window !== "undefined" && window.requestIdleCallback
    ? window.requestIdleCallback.bind(window)
    : (fn) => window.setTimeout(fn, 1);
const cancelIdle =
  typeof window !== "undefined" && window.cancelIdleCallback
    ? window.cancelIdleCallback.bind(window)
    : window.clearTimeout.bind(window);

function GridGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    // Building the globe (hex-polygon geometry from full country geojson,
    // a second WebGL context, its own rAF loop) is heavy synchronous work.
    // Home mounts this the instant the route changes, right as the
    // route-warp fade-in and StarBackground's own rAF loop are already
    // competing for the main thread — doing it inline here caused the
    // stutter reported when navigating to Home. Deferring construction to
    // an idle callback lets that transition paint first.
    let disposed = false;
    let cleanup = () => {};
    const idleId = scheduleIdle(() => {
      if (disposed) return;
      cleanup = setupGlobe(mount);
    });

    return () => {
      disposed = true;
      cancelIdle(idleId);
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className="grid-globe-canvas" />;
}

function setupGlobe(mount) {
  const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x04071d, 400, 2000);

    const camera = new THREE.PerspectiveCamera(50, width / height, 180, 1800);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffaaff, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight("#38bdf8", 0.6));

    const dirLight1 = new THREE.DirectionalLight("#ffffff");
    dirLight1.position.set(-400, 100, 400);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight("#ffffff");
    dirLight2.position.set(-200, 500, 200);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight("#ffffff", 0.8);
    pointLight.position.set(-200, 500, 200);
    scene.add(pointLight);

    const globe = new ThreeGlobe();
    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor("#FFFFFF")
      .atmosphereAltitude(0.1)
      .hexPolygonColor(() => "rgba(255,255,255,0.7)");

    const globeMaterial = globe.globeMaterial();
    globeMaterial.color = new THREE.Color("#062056");
    globeMaterial.emissive = new THREE.Color("#062056");
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.9;

    // Endpoints of every arc, deduped by lat/lng - used for the glowing
    // points + the propagating "rings" effect.
    const points = [];
    sampleArcs.forEach((arc) => {
      const rgb = hexToRgb(arc.color);
      const colorFn = (t) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`;
      points.push({ size: 4, order: arc.order, color: colorFn, lat: arc.startLat, lng: arc.startLng });
      points.push({ size: 4, order: arc.order, color: colorFn, lat: arc.endLat, lng: arc.endLng });
    });
    const filteredPoints = points.filter(
      (v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i
    );

    globe
      .arcsData(sampleArcs)
      .arcStartLat((d) => d.startLat)
      .arcStartLng((d) => d.startLng)
      .arcEndLat((d) => d.endLat)
      .arcEndLng((d) => d.endLng)
      .arcColor((e) => e.color)
      .arcAltitude((e) => e.arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(0.9)
      .arcDashInitialGap((e) => e.order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => 1000);

    globe
      .pointsData(sampleArcs)
      .pointColor((e) => e.color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globe
      .ringsData([])
      .ringColor((e) => (t) => e.color(t))
      .ringMaxRadius(3)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod((1000 * 0.9) / 1);

    scene.add(globe);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 300;
    controls.maxDistance = 300;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;

    const ringInterval = setInterval(() => {
      const numbersOfRings = genRandomNumbers(
        0,
        filteredPoints.length,
        Math.floor((filteredPoints.length * 4) / 5)
      );
      globe.ringsData(filteredPoints.filter((d, i) => numbersOfRings.includes(i)));
    }, 2000);

    let frameId;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(ringInterval);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
}

export default GridGlobe;
