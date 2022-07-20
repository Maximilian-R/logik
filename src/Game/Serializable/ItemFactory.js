import { MVector } from '../../Utilities/MVector';
import {
    AndGate,
    BatteryGate,
    CombinerGate,
    CounterGate,
    KeyGate,
    MeasureGate,
    NotGate,
    OrGate,
    SelectorGate,
    SplitterGate,
    TimerGate,
    ToggleGate,
    XorGate,
} from '../Electronics/Gates';
import { SwitchGate } from '../Electronics/Gates/Switch';
import { Fan } from '../Electronics/Parts/Fan';
import { Light } from '../Electronics/Parts/Light';
import { Wire } from '../Electronics/Wire';

const itemClasses = {
    and: AndGate,
    battery: BatteryGate,
    combiner: CombinerGate,
    counter: CounterGate,
    key: KeyGate,
    measure: MeasureGate,
    not: NotGate,
    or: OrGate,
    selector: SelectorGate,
    splitter: SplitterGate,
    switch: SwitchGate,
    timer: TimerGate,
    toggle: ToggleGate,
    xor: XorGate,
    light: Light,
    fan: Fan,
};

export class ItemFactory {
    constructor() {}

    static createAll(gameObjects) {
        const items = gameObjects
            .filter((gameObject) => gameObject.name !== 'Wire')
            .map((item) => ItemFactory.create(item))
            .filter((item) => !!item);

        const wires = gameObjects.filter((gameObject) => gameObject.name === 'Wire').map((wire) => ItemFactory.createWire(items, wire));
        return [...items, ...wires];
    }

    static create(data) {
        const position = MVector.Create(data.position[0], data.position[1]);
        try {
            const item = new itemClasses[data.name.toLowerCase()](position, data.id);
            if (data.settings) {
                item.applySettings(data.settings);
            }
            return item;
        } catch {
            console.error(`Item Factory: ${data.name} is not a valid item class`);
        }

        return undefined;
    }

    static createWire(items, data) {
        const outputId = data.output;
        const inputId = data.input;

        const outputItem = items.find((item) => item.id === outputId.split(':')[0]);
        const inputItem = items.find((item) => item.id === inputId.split(':')[0]);

        const output = outputItem.findChild(outputId);
        const input = inputItem.findChild(inputId);

        const wire = new Wire(output, input);
        if (data.waypoints) {
            wire.waypoints = data.waypoints.map((position) => MVector.Create(position[0], position[1]));
        }
        return wire;
    }
}
