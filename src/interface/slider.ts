export interface Slider {
  label: string;
  min: number;
  max: number;
  value: number;
  step: number;
  orientation: 'horizontal' | 'vertical';
}

export interface SliderChangeEvent {
  slider: Slider;
  value: number;
}
