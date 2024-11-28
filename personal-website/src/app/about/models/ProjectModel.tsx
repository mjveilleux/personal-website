import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ProjectModel = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(320, 320);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const createHammer = () => {
      const hammer = new THREE.Group();

      // Handle
      const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
      const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      hammer.add(handle);

      // Head
      const headGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.4);
      const headMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(0, 1.1, 0);
      hammer.add(head);

      // Claw
      const clawGeometry = new THREE.CylinderGeometry(0, 0.15, 0.4, 16);
      const claw = new THREE.Mesh(clawGeometry, headMaterial);
      claw.position.set(0.6, 1.1, 0);
      claw.rotation.z = Math.PI / 2;
      hammer.add(claw);

      return hammer;
    };

const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

    const hammer = createHammer();
    hammer.rotation.x = -Math.PI / 4;
    hammer.rotation.z = Math.PI / 4;
    scene.add(hammer);
    
    // Add event listeners for interaction
    let isRotating = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };
    
    const startRotation = (event: MouseEvent) => {
      isRotating = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };
    
    const stopRotation = () => {
      isRotating = false;
    };
    
    const rotate = (event: MouseEvent) => {
      if (!isRotating) return;
    
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };
    
      const deltaRotationQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(
          toRadians(deltaMove.y * 0.5),
          toRadians(deltaMove.x * 0.5),
          0,
          'XYZ'
        ));
    
      hammer.quaternion.multiplyQuaternions(deltaRotationQuaternion, hammer.quaternion);
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };
    
    mountRef.current.addEventListener('mousedown', startRotation);
    mountRef.current.addEventListener('mousemove', rotate);
    mountRef.current.addEventListener('mouseup', stopRotation);
    mountRef.current.addEventListener('mouseout', stopRotation);

    camera.position.set(4, 2, 4);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const animate = () => {
      requestAnimationFrame(animate);
      hammer.rotation.y += 0.5;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-80 h-80" />;
};