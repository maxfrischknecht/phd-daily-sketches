  import * as THREE from 'three';

  /*__ B A S I C S _________________________________*/

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // Move camera out so its not at the same pos as the cube
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  /*__ D A T A _________________________________
  Create an array of ten objects, each with a color property. 
  For instance, you can use the RGB values to define colors like this:
  */

  const objects = [
    { color: new THREE.Color(1, 0, 0) }, // red
    { color: new THREE.Color(0, 1, 0) }, // green
    { color: new THREE.Color(0, 0, 1) }, // blue
    { color: new THREE.Color(1, 1, 0) }, // yellow
    { color: new THREE.Color(1, 0, 1) }, // magenta
    { color: new THREE.Color(0, 1, 1) }, // cyan
    { color: new THREE.Color(1, 1, 1) }, // white
    { color: new THREE.Color(0.5, 0.5, 0.5) }, // gray
    { color: new THREE.Color(0.7, 0.2, 0.8) }, // purple
    { color: new THREE.Color(0, 0, 0) } // black
  ];

  /*__ S H A D E R _________________________________
  Create a shader program that will cluster items based on their color property. 
  You can use a fragment shader and define a uniform variable for 
  the color you want to group by. Then, compare each object's color 
  with the uniform color and set a varying variable to 1 if they match, else 0. 
  Finally, use the varying variable to color the object accordingly.
  */

  const vertexShader = `
    // vertex shader code here
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;

  const fragmentShader = `
    uniform vec3 colorToGroupBy;
    varying float shouldColor;

    void main() {
      if (shouldColor == 1.0) {
        gl_FragColor = vec4(colorToGroupBy, 1.0);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
    }
  `;

  /*__ D R A W I N G _________________________________
  Create a Three.js mesh object for each item in the array, 
  and set its material to the shader program with the colorToGroupBy 
  uniform set to the desired color.
  */

  for (let i = 0; i < objects.length; i++) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        colorToGroupBy: { value: objects[i].color }
      },
      vertexShader,
      fragmentShader
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  }



  /*__ R E N D E R I N G _________________________________*/

  function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();