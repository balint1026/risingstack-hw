'use client';

import React from 'react';
import { Wheel } from 'react-custom-roulette';

type WheelComponentProps = {
  mustSpin: boolean;
  prizeIndex: number;
  onStopSpinning: () => void;
  data: { option: string; style: { backgroundColor: string; textColor: string } }[];
};

export default function WheelComponent({
  mustSpin,
  prizeIndex,
  onStopSpinning,
  data,
}: WheelComponentProps) {
  return (
    <div className="flex justify-center items-center bg-gray-800 p-4 rounded-lg overflow-hidden">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeIndex}
        data={data}
        onStopSpinning={onStopSpinning}
        backgroundColors={data.map((item) => item.style.backgroundColor)}
        textColors={[data[0].style.textColor]}
        outerBorderColor="#000000"
        outerBorderWidth={5}
        radiusLineColor="#000000"
        radiusLineWidth={2}
        fontSize={16}
      />
    </div>
  );
}