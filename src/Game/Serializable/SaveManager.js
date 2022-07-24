import { Item } from '../Electronics/Item';
import { ItemFactory } from './ItemFactory';

export class SaveManager {
    static async load(onLoad) {
        const json = await SaveManager.getSavegameFile();
        const gameObjects = ItemFactory.createAll(json.gameObjects);
        onLoad(gameObjects);
    }

    static save(gameObjects) {
        const json = {};

        json.gameObjects = gameObjects.map((gameObject) => gameObject.serialize());
        SaveManager.saveToFile(JSON.stringify(json));
    }

    static async saveToFile(file) {
        const filePicker = await window.showSaveFilePicker();
        const writableStream = await filePicker.createWritable();
        await writableStream.write(file);
        await writableStream.close();
    }

    static async getSavegameFile() {
        const filePickerOptions = {
            types: [
                {
                    accept: {
                        'application/json': ['.json'],
                    },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
        };

        const [fileHandle] = await window.showOpenFilePicker(filePickerOptions);
        const file = await fileHandle.getFile();
        const fileReader = new FileReader();

        return new Promise((resolve, reject) => {
            fileReader.addEventListener('loadend', () => {
                resolve(JSON.parse(fileReader.result));
            });

            fileReader.readAsText(file);
        });
    }
}
