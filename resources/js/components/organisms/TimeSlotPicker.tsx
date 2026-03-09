import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../atoms/Button";
import { Calendar } from "@/components/ui/calendar";

export interface TimeSlotPickerProps {
  slots: string[]; // formato 'HH:mm'
  selectedSlot?: string;
  onSelect: (slot: string) => void;
  date: Date;
  onDateChange: (date: Date | undefined) => void;
}

const isValidTime = (slot: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(slot);

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelect,
  date,
  onDateChange,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-[#181818] rounded-lg p-4 border border-[#333] mb-2">
        <Calendar
          mode="single"
          required={false}
          selected={date}
          onSelect={onDateChange}
          className="w-full dark bg-[#181818] text-gray-200 border-none"
          modifiersClassNames={{
            selected: "bg-[#D4AF37] text-black",
            today: "border-[#D4AF37] border",
          }}
        />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {slots.map((slot) => (
          <Button
            key={slot}
            className={cn(
              "w-full py-2 text-center text-base font-bold border border-[#333]",
              selectedSlot === slot
                ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg"
                : "bg-[#181818] text-[#D4AF37] hover:bg-[#222]"
            )}
            onClick={() => isValidTime(slot) && onSelect(slot)}
            aria-pressed={selectedSlot === slot}
            type="button"
          >
            {slot}
          </Button>
        ))}
      </div>
    </div>
  );
};
