import THREE from "./three"

var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    r = 450,
    mouseY = 0,
    mouseX = 0,
    windowHalfY = SCREEN_HEIGHT / 2,
    windowHalfX = SCREEN_WIDTH / 2,

    camera, scene, renderer;
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.z = 50;
    scene = new THREE.Scene();

    var i, line, material, p,
        parameters = [
            [0.25, "#00fff2", 1]
        ];
    var geometry = createGeometry();
    for (i = 0; i < parameters.length; ++i) {
        p = parameters[i];
        material = new THREE.LineBasicMaterial({
            color: p[1],
            opacity: p[2]
        });
        line = new THREE.LineSegments(geometry, material);
        line.scale.x = line.scale.y = line.scale.z = p[0];
        line.userData.originalScale = p[0];
        line.rotation.y = Math.random() * Math.PI;
        line.rotation.x = Math.random() * Math.PI;

        line.updateMatrix();
        scene.add(line);
    }

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    document.body.appendChild(renderer.domElement);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);


    //
    window.addEventListener('resize', onWindowResize, false);
}

// Creates the sphere with vertices
function createGeometry() {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];
    var vertex = new THREE.Vector3();
    for (var i = 0; i < 500; i++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.normalize();
        vertex.multiplyScalar(r);
        vertices.push(vertex.x, vertex.y, vertex.z);
        vertex.multiplyScalar(Math.random() * 0.09 + 1);
        vertices.push(vertex.x, vertex.y, vertex.z);
    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//
function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x += (400 - camera.position.x) * .05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);

    var time = Date.now() * 0.0001;
    for (var i = 0; i < scene.children.length; i++) {
        var object = scene.children[i];
        if (object.isLine) {
            object.rotation.y = time * (i < 4 ? (i + 1) : -(i + 1));
            if (i < 5) {
                var scale = object.userData.originalScale * (i / 5 + 1) * (1 + 0.5 * Math.sin(7 * time));
                object.scale.x = object.scale.y;
            }
        }
    }

}