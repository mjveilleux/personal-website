import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BridgeModel = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(320, 320); // Match your image dimensions
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Create the bridge
    const createBridge = () => {
      const bridgeGroup = new THREE.Group();

      // Main towers
      const towerGeometry = new THREE.BoxGeometry(0.5, 4, 0.5);
      const towerMaterial = new THREE.MeshPhongMaterial({ color: 0xcd0000 }); // Red color
      
      const tower1 = new THREE.Mesh(towerGeometry, towerMaterial);
      tower1.position.set(-2, 0, 0);
      
      const tower2 = new THREE.Mesh(towerGeometry, towerMaterial);
      tower2.position.set(2, 0, 0);

      // Bridge deck
      const deckGeometry = new THREE.BoxGeometry(5, 0.2, 1);
      const deckMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
      const deck = new THREE.Mesh(deckGeometry, deckMaterial);
      deck.position.set(0, -1, 0);

      // Cables
      const curvePoints = [];
      curvePoints.push(new THREE.Vector3(-2, 2, 0));
      curvePoints.push(new THREE.Vector3(0, 1, 0));
      curvePoints.push(new THREE.Vector3(2, 2, 0));

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      const cableGeometry = new THREE.TubeGeometry(curve, 50, 0.05, 8, false);
      const cableMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
      const cable = new THREE.Mesh(cableGeometry, cableMaterial);

      // Add all elements to the group
      bridgeGroup.add(tower1);
      bridgeGroup.add(tower2);
      bridgeGroup.add(deck);
      bridgeGroup.add(cable);

      return bridgeGroup;
    };

    const bridge = createBridge();
    scene.add(bridge);

    // Position camera
    camera.position.z = 8;
    camera.position.y = 1;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the bridge slowly
      bridge.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-80 h-80" />;
};

export default BridgeModel;