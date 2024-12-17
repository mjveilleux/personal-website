import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Helper function to convert degrees to radians for THREE.js rotations
 * This is needed because THREE.js uses radians internally while degrees
 * are often more intuitive for humans to work with
 */
const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};


export const ProjectModel = () => {
  // Reference to the container div for our THREE.js canvas
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Store our random rotation speed - persists during component lifetime
  const rotationSpeedRef = useRef<number>(0.1);

  useEffect(() => {
    // Early return if mount point doesn't exist
    if (!mountRef.current) return;

    // Store mount element reference for cleanup
    const mountElement = mountRef.current;

    // Set up THREE.js scene and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(320, 320);
    mountElement.appendChild(renderer.domElement);

    // Set up lighting system
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    /**
     * Creates a detailed 3D hammer model with handle, head, and claw
     * The hammer consists of three main parts:
     * 1. Wooden handle (cylinder)
     * 2. Metal head (box)
     * 3. Claw end (cone)
     */
    const createHammer = () => {
      const hammer = new THREE.Group();

      // Create wooden handle with a rich brown color
      const handleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
      const handleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x8B4513,
        shininess: 30
      });
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);
      hammer.add(handle);

      // Create metallic hammer head
      const headGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.4);
      const headMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x888888,
        shininess: 80,
        specular: 0x444444
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(0, 1.1, 0);
      hammer.add(head);

      // Create claw end using the same material as the head
      const clawGeometry = new THREE.CylinderGeometry(0, 0.15, 0.4, 16);
      const claw = new THREE.Mesh(clawGeometry, headMaterial);
      claw.position.set(0.6, 1.1, 0);
      claw.rotation.z = Math.PI / 2;
      hammer.add(claw);

      return hammer;
    };

    // Create and position the hammer in the scene
    const hammer = createHammer();
    hammer.rotation.x = -Math.PI / 4;
    hammer.rotation.z = Math.PI / 4;
    scene.add(hammer);

    // State for handling mouse interactions
    let isRotating = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };

    /**
     * Mouse event handlers for interactive rotation
     * These allow users to drag the model to view it from different angles
     */
    const startRotation = (event: MouseEvent) => {
      isRotating = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const stopRotation = () => {
      isRotating = true;
    };

    const rotate = (event: MouseEvent) => {
      if (!isRotating) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      // Calculate rotation based on mouse movement
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

    // Add mouse event listeners
    mountElement.addEventListener('mousedown', startRotation);
    mountElement.addEventListener('mousemove', rotate);
    mountElement.addEventListener('mouseup', stopRotation);
    mountElement.addEventListener('mouseout', stopRotation);

    // Position camera to get a good view of the hammer
    camera.position.set(4, 2, 4);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    /**
     * Animation loop with consistent rotation speed
     * Uses the random speed generated at component mount
     */
    const animate = () => {
      requestAnimationFrame(animate);
      hammer.rotation.y += rotationSpeedRef.current;
      renderer.render(scene, camera);
    };

    animate();

    /**
     * Handle window resize events
     * Ensures the model looks correct at any screen size
     */
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      // Ensure mount element exists before cleanup
      if (mountElement) {
        // Remove event listeners
        mountElement.removeEventListener('mousedown', startRotation);
        mountElement.removeEventListener('mousemove', rotate);
        mountElement.removeEventListener('mouseup', stopRotation);
        mountElement.removeEventListener('mouseout', stopRotation);
      }

      // Remove window resize listener
      window.removeEventListener('resize', handleResize);

      // Dispose of THREE.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();

      // Safely remove renderer element
      if (mountElement && renderer.domElement.parentElement) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array since we don't need to re-run the effect

  return <div ref={mountRef} className="w-80 h-80" />;
};