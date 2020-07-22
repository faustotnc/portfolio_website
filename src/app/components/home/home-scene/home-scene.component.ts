import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Load3dObjectsService } from '../../../services/load-3d-objects.service';
import { isPlatformBrowser } from '@angular/common';



@Component({
    selector: 'fausto-home-scene',
    templateUrl: './home-scene.component.html',
    styleUrls: ['./home-scene.component.scss']
})
export class HomeSceneComponent implements AfterViewInit, OnDestroy {
    @ViewChild("sceneContainer") SCENE_CONTAINER: ElementRef;
    private SCENE: THREE.Scene;
    private CAMERA: THREE.PerspectiveCamera;
    private RENDERER: THREE.WebGLRenderer;
    private CONTROLS: OrbitControls;

    // Scene Elements
    private Cubes: [THREE.Mesh, number][] = [];
    private Computers: [THREE.Group, number][] = [];
    private Prisms: [THREE.Group, number][] = [];

    private WindowAnimation: number;


    constructor(
        private RENDER: Renderer2,
        private Load3DObject: Load3dObjectsService,
        @Inject(PLATFORM_ID) private platform: object
    ) {
        if (isPlatformBrowser(platform)) {
            this.SCENE = new THREE.Scene();
            this.RENDERER = new THREE.WebGLRenderer();
            this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.CONTROLS = new OrbitControls(this.CAMERA, this.RENDERER.domElement);
        }
    }


    /** Fired when the components of the page are initialized. */
    public ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platform)) {
            this.RENDERER.setSize(window.innerWidth, window.innerHeight);
            this.RENDER.appendChild(this.SCENE_CONTAINER.nativeElement, this.RENDERER.domElement);

            // Adjust orbit controls
            this.CONTROLS.autoRotate = true;
            this.CONTROLS.enableDamping = true;
            this.CONTROLS.enableZoom = false;
            this.CONTROLS.enablePan = false;

            // Set the camera's position
            this.CAMERA.position.set(0, 0, 5);

            // Adds lights to the scene
            const AmbientLight = new THREE.AmbientLight(0x404040); // Soft white light
            this.SCENE.add(AmbientLight);
            var HemisphericLight = new THREE.HemisphereLight(0xAAAA99, 0x080820, 1); // Light at the top, dark at the bottom
            this.SCENE.add(HemisphericLight);


            // Axes helper
            // var axesHelper = new THREE.AxesHelper(20);
            // this.SCENE.add(axesHelper);


            // Initializes the scene elements
            this.AddRandomCubes();
            this.AddComputers();
            this.addPrisms();
            this.AddRandomStars();


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
    }



    /** Fired when the component is destroyed. */
    public ngOnDestroy(): void {
        if (isPlatformBrowser(this.platform)) {
            window.cancelAnimationFrame(this.WindowAnimation);
            // Dispose of the scene
            this.SCENE.dispose();
        }
    }



    /** Resizes the world on window resize. */
    @HostListener('window:resize', ['$event']) public resize() {
        this.RENDERER.setSize(window.innerWidth, window.innerHeight);
        this.CAMERA.aspect = window.innerWidth / window.innerHeight;
        this.CAMERA.updateProjectionMatrix();
    }



    /**
     * Computes a random float from upper to lower.
     * @param upper The upper limit
     * @param lower The lower limit
     */
    private ComputeRandomPosition(upper: number, lower: number) {
        let x = (Math.random() * (upper - lower)) + lower;
        let y = (Math.random() * (upper - lower)) + lower;
        let z = (Math.random() * (upper - lower)) + lower;
        return [x, y, z];
    }



    /** Adds floating multicolor prisms to the 3D world. */
    private addPrisms() {
        for (let index = 0; index < 20; index++) {
            const group = new THREE.Group();
            group.scale.set(0.5, 0.5, 0.5)
            const colors = [0xE0AB0B, 0xE7545B, 0x7D0F05, 0x305A48, 0x507BDB, 0xC99369]

            for (let index = 0; index < 6; index++) {
                const geometry = new THREE.BoxGeometry();
                const material = new THREE.MeshBasicMaterial({ color: colors[index], vertexColors: true });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.z = index - 2.5;

                group.add(mesh);
            }


            // Adds the cube and it's assigned rotation to the Cubes array of tuples
            let rotation = (Math.random() * 3) - 1;
            this.Prisms.push([group, rotation]);

            // Positions the current computer
            let pos = this.ComputeRandomPosition(20, -20);
            this.Prisms[index][0].position.set(pos[0], pos[1], pos[2]);

            // Adds the current prism to the scene.
            this.SCENE.add(this.Prisms[index][0]);
        }
    }



    /** Adds floating computers (Custom 3D object) to the 3D world. */
    private AddComputers() {
        this.Load3DObject.load('assets/3d/oldmac_obj.obj', object => {
            object.scale.set(0.01, 0.01, 0.01);

            for (let index = 0; index < 30; index++) {
                let obj = object.clone();

                // Adds the cube and it's assigned rotation to the Cubes array of tuples
                let rotation = (Math.random() * 3) - 1;
                this.Computers.push([obj, rotation]);

                // Positions the current computer
                let pos = this.ComputeRandomPosition(20, -20);
                this.Computers[index][0].position.set(pos[0], pos[1], pos[2]);

                // Adds the current cube to the scene.
                this.SCENE.add(this.Computers[index][0]);
            }
        });
    }



    /** Adds floating multi-colored cubes to the 3D world. */
    private AddRandomCubes() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ vertexColors: true });

        for (let index = 0; index < 20; index++) {
            const mesh = new THREE.Mesh(geometry, material);

            // Yellow Face
            mesh.geometry.faces[0].color.setHex(0xE0AB0B);
            mesh.geometry.faces[1].color.setHex(0xE0AB0B);
            // Pink Face
            mesh.geometry.faces[2].color.setHex(0xE7545B);
            mesh.geometry.faces[3].color.setHex(0xE7545B);
            // Red Face
            mesh.geometry.faces[4].color.setHex(0x7D0F05);
            mesh.geometry.faces[5].color.setHex(0x7D0F05);
            // Green Face
            mesh.geometry.faces[6].color.setHex(0x305A48);
            mesh.geometry.faces[7].color.setHex(0x305A48);
            // Blue Face
            mesh.geometry.faces[8].color.setHex(0x507BDB);
            mesh.geometry.faces[9].color.setHex(0x507BDB);
            // Beige Face
            mesh.geometry.faces[10].color.setHex(0xC99369);
            mesh.geometry.faces[11].color.setHex(0xC99369);

            // Adds the cube and its assigned rotation to the Cubes array of tuples
            let rotation = (Math.random() * 5) - 2;
            this.Cubes.push([mesh, rotation]);

            // Positions the current cube
            let pos = this.ComputeRandomPosition(20, -20);
            this.Cubes[index][0].position.set(pos[0], pos[1], pos[2]);

            // Adds the current cube to the scene.
            this.SCENE.add(this.Cubes[index][0])

        }
    }



    /** Generates a simple starfield */
    public AddRandomStars() {
        for (let index = 0; index < 300; index++) {
            const geometry = new THREE.SphereGeometry(0.025, 3, 3);
            const material = new THREE.MeshBasicMaterial({ vertexColors: true });

            const mesh = new THREE.Mesh(geometry, material);

            // Positions the current cube
            let pos = this.ComputeRandomPosition(20, -20);
            mesh.position.set(pos[0], pos[1], pos[2]);

            this.SCENE.add(mesh);
        }
    }


    /** The animation loop. */
    private AnimationLoop() {
        // Rotates the cubes.
        this.Cubes.forEach(cube => {
            cube[0].rotation.x += cube[1] / 100;
            cube[0].rotation.y += cube[1] / 100;
        })

        // Rotates the prisms.
        this.Computers.forEach(computer => {
            computer[0].rotation.x += computer[1] / 100;
            computer[0].rotation.y += computer[1] / 100;
        });

        // Rotates the computers.
        this.Prisms.forEach(prism => {
            prism[0].rotation.x += prism[1] / 100;
            prism[0].rotation.y += prism[1] / 100;
        });
    }
}
