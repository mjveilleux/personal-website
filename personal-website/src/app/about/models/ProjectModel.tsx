import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Position = [number, number, number];

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

    const createProject = () => {
      const project = new THREE.Group();

      // Foundation
      const foundationGeometry = new THREE.BoxGeometry(5, 0.2, 5);
      const concreteMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
      const foundation = new THREE.Mesh(foundationGeometry, concreteMaterial);
      
      // Scaffolding poles
      const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3);
      const metalMaterial = new THREE.MeshPhongMaterial({ color: 0x404040 });
      
      const positions: Position[] = [
        [-2, 1.5, -2],
        [2, 1.5, -2],
        [-2, 1.5, 2],
        [2, 1.5, 2]
      ];

      positions.forEach(([x, y, z]: Position) => {
        const pole = new THREE.Mesh(poleGeometry, metalMaterial);
        pole.position.set(x, y, z);
        project.add(pole);
      });

      // Crane
      const craneBase = new THREE.BoxGeometry(0.5, 4, 0.5);
      const craneMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd00 });
      const crane = new THREE.Mesh(craneBase, craneMaterial);
      crane.position.set(0, 2, 0);

      const craneArm = new THREE.BoxGeometry(3, 0.2, 0.2);
      const arm = new THREE.Mesh(craneArm, craneMaterial);
      arm.position.set(1.5, 3.5, 0);
      crane.add(arm);

      // Construction blocks
      const blockGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const brickMaterial = new THREE.MeshPhongMaterial({ color: 0xcc8866 });
      
      for (let i = 0; i < 3; i++) {
        const block = new THREE.Mesh(blockGeometry, brickMaterial);
        block.position.set(-1 + i * 0.9, 0.5, 0);
        project.add(block);
      }

      project.add(foundation);
      project.add(crane);

      return project;
    };

    const project = createProject();
    scene.add(project);

    camera.position.set(6, 4, 6);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const animate = () => {
      requestAnimationFrame(animate);
      project.rotation.y += 0.005;
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