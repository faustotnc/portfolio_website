import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


@Component({
    selector: 'fausto-about-scene',
    templateUrl: './about-scene.component.html',
    styleUrls: ['./about-scene.component.scss']
})
export class AboutSceneComponent implements AfterViewInit {
    @ViewChild("sceneContainer") SCENE_CONTAINER: ElementRef;

    // World Preparation
    private SCENE = new THREE.Scene();
    private CAMERA: THREE.PerspectiveCamera;
    private RENDERER = new THREE.WebGLRenderer();
    private CONTROLS: OrbitControls;

    private WindowAnimation: number;

    // World Objects
    private GraphSpheres: THREE.Mesh[] = [];


    constructor(private RENDER: Renderer2) {
        this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.CONTROLS = new OrbitControls(this.CAMERA, this.RENDERER.domElement);
    }


    public ngAfterViewInit(): void {
        this.RENDERER.setSize(window.innerWidth, window.innerHeight);
        this.RENDER.appendChild(this.SCENE_CONTAINER.nativeElement, this.RENDERER.domElement);

        // Adjust orbit controls
        this.CONTROLS.autoRotate = true;
        this.CONTROLS.enableDamping = true;
        this.CONTROLS.enableZoom = false;
        this.CONTROLS.enablePan = false;

        // Set the camera's position
        this.CAMERA.position.set(0, 0, 12);

        // Adds lights to the scene
        const AmbientLight = new THREE.AmbientLight(0x404040); // Soft white light
        this.SCENE.add(AmbientLight);
        var HemisphericLight = new THREE.HemisphereLight(0xAAAA99, 0x080820, 1); // Light at the top, dark at the bottom
        this.SCENE.add(HemisphericLight);


        // Axes helper
        // var axesHelper = new THREE.AxesHelper(20);
        // this.SCENE.add(axesHelper);


        // Initializes the scene elements
        this.AddRandomStars();
        this.Add3dGraph();
        this.Add3DGraphVertices();


        // Renders the scene
        const animate = () => {
            this.WindowAnimation = requestAnimationFrame(animate);
            // Required if controls.enableDamping or controls.autoRotate are set to true
            this.CONTROLS.update();

            this.AnimationLoop();
            this.RENDERER.render(this.SCENE, this.CAMERA);
        }
        animate();
    }


    private ComputeRandomPosition(upper: number, lower: number) {
        let x = (Math.random() * (upper - lower)) + lower;
        let y = (Math.random() * (upper - lower)) + lower;
        let z = (Math.random() * (upper - lower)) + lower;
        return [x, y, z];
    }



    private Add3DGraphVertices() {
        for (let index = 0; index < this.GraphSpheres.length; index++) {
            const sphere = this.GraphSpheres[index];
            const sPos = sphere.position;

            const sortedGraph = this.GraphSpheres.sort((a, b) => {
                const aPos = a.position;
                const bPos = b.position;

                const distA = Math.sqrt(Math.pow(sPos.x - aPos.x, 2) + Math.pow(sPos.y - aPos.y, 2) + Math.pow(sPos.z - aPos.z, 2));
                const distB = Math.sqrt(Math.pow(sPos.x - bPos.x, 2) + Math.pow(sPos.y - bPos.y, 2) + Math.pow(sPos.z - bPos.z, 2));

                return distA - distB;
            })

            sortedGraph.slice(1, 4).forEach(neighbor => {
                var material = new THREE.LineBasicMaterial({ color: 0xffffff });
                var points = [sPos, neighbor.position];
                var geometry = new THREE.BufferGeometry().setFromPoints(points);
                var line = new THREE.Line(geometry, material);
                this.SCENE.add(line);
            });
        }
    }


    private Add3dGraph() {
        for (let index = 0; index < 56; index++) {
            const colors = [0xE0AB0B, 0xE7545B, 0x7D0F05, 0x305A48, 0x507BDB, 0xC99369];
            const color = colors[Math.floor(Math.random() * 5)];

            const geometry = new THREE.SphereGeometry(0.25, 6, 6);
            const material = new THREE.MeshBasicMaterial({ color: color, vertexColors: true });

            const mesh = new THREE.Mesh(geometry, material);

            // Prevents the spheres to be positioned less than
            // a unit distance from any other sphere.
            let pos;
            while (true) {
                let reStart = false;
                pos = this.ComputeRandomPosition(3.5, -3.5);

                for (let index = 0; index < this.GraphSpheres.length; index++) {
                    const sphere = this.GraphSpheres[index];
                    const sPos = sphere.position;
                    const dist = Math.sqrt(Math.pow(pos[0] - sPos.x, 2) + Math.pow(pos[1] - sPos.y, 2) + Math.pow(pos[2] - sPos.z, 2))

                    if (dist <= 1) {
                        reStart = true;
                        break;
                    }
                }

                if (reStart) continue; else break;
            }

            mesh.position.set(pos[0], pos[1], pos[2]);
            this.GraphSpheres.push(mesh);
            this.SCENE.add(this.GraphSpheres[index])
        }
    }



    private AddRandomStars() {
        for (let index = 0; index < 300; index++) {
            const geometry = new THREE.SphereGeometry(0.025, 3, 3);
            const material = new THREE.MeshBasicMaterial({ vertexColors: true });

            const mesh = new THREE.Mesh(geometry, material);

            // Positions the current cube
            let position = this.ComputeRandomPosition(20, -20);
            mesh.position.set(position[0], position[1], position[2]);

            this.SCENE.add(mesh);
        }
    }


    private AnimationLoop() {
    }
}
