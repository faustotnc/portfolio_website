import { Injectable } from '@angular/core';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

@Injectable({
    providedIn: 'root'
})
export class Load3dObjectsService {
    // instantiate a loader
    private LOADER = new OBJLoader();

    // Stores the 3D object resource.
    private RESOURCES: { ["string"]: THREE.Group } | {} = {};


    /**
     * Loads a 3D resource.
     * @param resURL The resource's url
     * @param callback The Callback to execute once the resource has loaded
     */
    public load(resURL: string, callback: (obj: THREE.Group) => void): void {
        if (this.RESOURCES[resURL]) {
            callback(this.RESOURCES[resURL])
        } else {
            this.LOADER.load(resURL, obj => {
                this.RESOURCES[resURL] = obj;

                callback(obj);
            });
        }
    }
}
