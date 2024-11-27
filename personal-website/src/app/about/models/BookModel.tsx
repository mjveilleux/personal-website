import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const BookModel = () => {
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
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const createBook = () => {
      const book = new THREE.Group();

      // Cover
      const coverGeometry = new THREE.BoxGeometry(2, 3, 0.2);
      const coverMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a0f0f,
        shininess: 30
      });
      const cover = new THREE.Mesh(coverGeometry, coverMaterial);

      // Pages
      const pagesGeometry = new THREE.BoxGeometry(1.9, 2.9, 0.8);
      const pagesMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf1f1f1,
        shininess: 10
      });
      const pages = new THREE.Mesh(pagesGeometry, pagesMaterial);
      pages.position.z = 0.4;

      // Spine details
      const spineDetailGeometry = new THREE.BoxGeometry(0.1, 2.8, 0.1);
      const spineDetailMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc0c0c0,
        shininess: 50
      });

      // Add spine decorations
      for (let i = -0.4; i <= 0.4; i += 0.2) {
        const spineDetail = new THREE.Mesh(spineDetailGeometry, spineDetailMaterial);
        spineDetail.position.set(-0.9, i, 0.4);
        book.add(spineDetail);
      }

      // Title text (simplified as a rectangle)
      const titleGeometry = new THREE.PlaneGeometry(1.5, 0.3);
      const titleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc0c0c0,
        shininess: 100
      });
      const title = new THREE.Mesh(titleGeometry, titleMaterial);
      title.position.set(0, 0.5, 0.11);

      book.add(cover);
      book.add(pages);
      book.add(title);

      return book;
    };

    const book = createBook();
    book.rotation.x = 0.2;
    scene.add(book);

    camera.position.z = 6;
    camera.position.y = 0.5;

    const animate = () => {
      requestAnimationFrame(animate);
      book.rotation.y += 0.005;
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