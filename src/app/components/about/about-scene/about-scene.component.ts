import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import {
    Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, HemisphereLight, LineBasicMaterial,
    BufferGeometry, SphereGeometry, Mesh, MeshBasicMaterial, Line, TorusKnotBufferGeometry, MeshNormalMaterial
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'fausto-about-scene',
    template: '<div class="scene-container" #sceneContainer></div>',
    styleUrls: ['./about-scene.component.scss']
})
export class AboutSceneComponent implements AfterViewInit, OnDestroy {
    @ViewChild("sceneContainer") SCENE_CONTAINER: ElementRef;

    // World Preparation
    private SCENE: Scene;
    private CAMERA: PerspectiveCamera;
    private RENDERER: WebGLRenderer;
    private CONTROLS: OrbitControls;

    private WindowAnimation: number;

    // World Objects
    private GraphSpheres: Mesh[] = [];


    constructor(private RENDER: Renderer2, @Inject(PLATFORM_ID) private platform: object) {
        if (isPlatformBrowser(platform)) {
            this.SCENE = new Scene();
            this.RENDERER = new WebGLRenderer();
            this.CAMERA = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
            this.CAMERA.position.set(0, 0, 12);

            // Adds lights to the scene
            const ambient_light = new AmbientLight(0x404040); // Soft white light
            this.SCENE.add(ambient_light);
            var HemisphericLight = new HemisphereLight(0xAAAA99, 0x080820, 1); // Light at the top, dark at the bottom
            this.SCENE.add(HemisphericLight);


            // Axes helper
            // var axesHelper = new AxesHelper(20);
            // this.SCENE.add(axesHelper);


            // Initializes the scene elements
            this.AddRandomStars();
            // this.addTorusKnot();
            this.Add3dGraph();
            this.Add3DGraphVertices();


            // Renders the scene
            const animate = () => {
                this.WindowAnimation = requestAnimationFrame(animate);
                // Required if controls.enableDamping or controls.autoRotate are set to true
                this.CONTROLS.update();

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



    /**
     * Adds the vertices of the 3D graph.
     * TODO: Make this more efficient.
     */
    private Add3DGraphVertices() {
        for (let index = 0; index < this.GraphSpheres.length; index++) {
            const sphere = this.GraphSpheres[index];
            const sPos = sphere.position;

            // Sorts the graph from smallest to largest distance from the
            // distance of the current sphere.
            const sortedGraph = this.GraphSpheres.sort((a, b) => {
                const aPos = a.position;
                const bPos = b.position;

                const distA = Math.sqrt(Math.pow(sPos.x - aPos.x, 2) + Math.pow(sPos.y - aPos.y, 2) + Math.pow(sPos.z - aPos.z, 2));
                const distB = Math.sqrt(Math.pow(sPos.x - bPos.x, 2) + Math.pow(sPos.y - bPos.y, 2) + Math.pow(sPos.z - bPos.z, 2));

                return distA - distB;
            })

            // Draws a line between the current sphere and its 3 closest neighbors.
            sortedGraph.slice(1, 4).forEach(neighbor => {
                var material = new LineBasicMaterial({ color: 0xffffff });
                var points = [sPos, neighbor.position];
                var geometry = new BufferGeometry().setFromPoints(points);
                var line = new Line(geometry, material);
                this.SCENE.add(line);
            });
        }
    }



    /** Generates random spheres around the origin (0, 0, 0) of the 3D world. */
    private Add3dGraph() {
        for (let index = 0; index < 56; index++) {
            const colors = [0xE0AB0B, 0xE7545B, 0x7D0F05, 0x305A48, 0x507BDB, 0xC99369];
            const color = colors[Math.floor(Math.random() * 5)];

            const geometry = new SphereGeometry(0.25, 6, 6);
            const material = new MeshBasicMaterial({ color: color, vertexColors: true });

            const mesh = new Mesh(geometry, material);

            // Prevents the spheres to be positioned less than
            // a unit distance from any other sphere.
            let pos: number[];
            chooseNewPos: while (true) {
                pos = this.ComputeRandomPosition(3.5, -3.5);

                // Compare the current position to the position of all the other spheres
                for (let index = 0; index < this.GraphSpheres.length; index++) {
                    const sphere = this.GraphSpheres[index];
                    const sPos = sphere.position;
                    const dist = Math.sqrt(Math.pow(pos[0] - sPos.x, 2) + Math.pow(pos[1] - sPos.y, 2) + Math.pow(pos[2] - sPos.z, 2))

                    // Chose another position for the sphere if the
                    // current position is too close to another sphere.
                    if (dist <= 1.5) continue chooseNewPos;
                }

                // Break the loop once we have found a position
                // that is not too close to other spheres.
                break;
            }

            mesh.position.set(pos[0], pos[1], pos[2]);
            this.GraphSpheres.push(mesh);
            this.SCENE.add(this.GraphSpheres[index])
        }
    }



    private addTorusKnot() {
        var geometry = new TorusKnotBufferGeometry(2.5, 1, 83, 8, 1, 3);
        var material = new MeshNormalMaterial({ wireframe: true });
        var torus = new Mesh(geometry, material);
        this.SCENE.add(torus);
    }



    /** Generates a simple starfield */
    private AddRandomStars() {
        for (let index = 0; index < 300; index++) {
            const geometry = new SphereGeometry(0.025, 3, 3);
            const material = new MeshBasicMaterial({ vertexColors: true });

            const mesh = new Mesh(geometry, material);

            // Positions the current cube
            let position = this.ComputeRandomPosition(20, -20);
            mesh.position.set(position[0], position[1], position[2]);

            this.SCENE.add(mesh);
        }
    }
}
