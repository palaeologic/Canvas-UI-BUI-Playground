import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import type { CSSProperties } from "react";

export interface PickerRadioOption {
  value: string;
  label: string;
  color: string;
}

/**
 * Accessible, controlled radio-group adapter for the picker.
 *
 * Base UI owns keyboard navigation, focus, and radio semantics. The app still owns
 * the selected value and all visual styling so changing interaction libraries never
 * changes the recommendation algorithm or the product's design language.
 */
export function PickerRadioGroup({
  name,
  labelId,
  value,
  options,
  onValueChange,
}: {
  name: string;
  labelId: string;
  value: string;
  options: PickerRadioOption[];
  onValueChange: (value: string) => void;
}) {
  return (
    <RadioGroup
      className="picker-radio-group opts"
      name={name}
      aria-labelledby={labelId}
      value={value}
      onValueChange={(nextValue) => onValueChange(String(nextValue))}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="picker-option"
          style={{ ["--c" as string]: option.color } as CSSProperties}
        >
          <Radio.Root className="picker-radio" value={option.value}>
            <Radio.Indicator className="picker-radio-indicator">
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Radio.Indicator>
          </Radio.Root>
          <span className="picker-option-label">{option.label}</span>
        </label>
      ))}
    </RadioGroup>
  );
}
