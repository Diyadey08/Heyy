import { useEffect, useRef } from "react";
import * as THREE from "three";
import React from "react";

export default function Chart3D({ data, xKey, yKey }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = 800;  // Increased width
    const height = 600; // Increased height

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.innerHTML = ""; // Clear old canvas
    mountRef.current.appendChild(renderer.domElement);

    const positions = [];
    data.forEach((row, index) => {
      const x = parseFloat(row[xKey]) || 0;
      const y = parseFloat(row[yKey]) || 0;
      const z = index;
      positions.push(x, y, z);
    });

    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
    geometry.setAttribute("position", positionAttribute);

    const material = new THREE.PointsMaterial({ color: 0xff0000, size: 3 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const animate = function () {
      requestAnimationFrame(animate);
      points.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  }, [data, xKey, yKey]);

  return <div ref={mountRef} style={{ width: "800px", height: "600px" }}></div>;
}
