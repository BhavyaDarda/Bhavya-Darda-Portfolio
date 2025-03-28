declare module 'howler' {
  export class Howl {
    constructor(options: HowlOptions);
    play(spriteOrId?: number | string): number;
    pause(id?: number): this;
    stop(id?: number): this;
    unload(): this;
    volume(vol?: number, id?: number): number | this;
    stereo(pan?: number, id?: number): number | this;
    pos(x?: number, y?: number, z?: number, id?: number): this | [number, number, number];
    seek(seek?: number, id?: number): number | this;
    on(event: string, fn: Function, id?: number): this;
    once(event: string, fn: Function, id?: number): this;
    duration(id?: number): number;
    fade(from: number, to: number, duration: number, id?: number): this;
    state(): 'unloaded' | 'loading' | 'loaded';
    playing(id?: number): boolean;
  }

  export interface HowlOptions {
    src: string | string[];
    volume?: number;
    html5?: boolean;
    loop?: boolean;
    preload?: boolean;
    autoplay?: boolean;
    mute?: boolean;
    rate?: number;
    pool?: number;
    format?: string[];
    onload?: () => void;
    onloaderror?: (id: number, error: unknown) => void;
    onplay?: (id: number) => void;
    onplayerror?: (id: number, error: unknown) => void;
    onend?: (id: number) => void;
    onpause?: (id: number) => void;
    onstop?: (id: number) => void;
    onmute?: (id: number) => void;
    onvolume?: (id: number) => void;
    onrate?: (id: number) => void;
    onseek?: (id: number) => void;
    onfade?: (id: number) => void;
    sprites?: { [key: string]: [number, number] | [number, number, boolean] };
  }
}