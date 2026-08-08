import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Same uniform-in-sphere sampling maath's random.inSphere uses, inlined
// with Math.random() (maath's RNG resolves broken/NaN under CRA's webpack).
function randomInSphere(buffer, radius) {
  for (let i = 0; i < buffer.length; i += 3) {
    const u = Math.pow(Math.random(), 1 / 3);
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    let z = Math.random() * 2 - 1;
    const mag = Math.sqrt(x * x + y * y + z * z);
    x = (u * x) / mag;
    y = (u * y) / mag;
    z = (u * z) / mag;
    buffer[i] = x * radius;
    buffer[i + 1] = y * radius;
    buffer[i + 2] = z * radius;
  }
  return buffer;
}

// Ported from space-portfolio's components/main/star-background.tsx
// (react-three-fiber rotating star sphere), rebuilt in plain three.js
// so it runs on this app's React 17 / CRA setup.
function StarBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.z = Math.PI / 4;
    scene.add(group);

    const sphere = randomInSphere(new Float32Array(5000), 1.2);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(sphere, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.002,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    group.add(points);

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      const delta = clock.getDelta();
      points.rotation.x -= delta / 10;
      points.rotation.y -= delta / 15;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -10,
      }}
    />
  );
}

export default StarBackground;
