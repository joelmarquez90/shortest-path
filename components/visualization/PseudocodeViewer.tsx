'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface PseudocodeViewerProps {
  code: string[];
  currentLine: number;
  title?: string;
}

export function PseudocodeViewer({
  code,
  currentLine,
  title = 'Pseudocódigo',
}: PseudocodeViewerProps) {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-0">
        <div className="font-mono text-xs overflow-x-auto">
          {code.map((line, index) => (
            <div
              key={index}
              className={`px-4 py-0.5 transition-colors ${
                index === currentLine
                  ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="inline-block w-6 text-slate-400 select-none">
                {index + 1}
              </span>
              <span className="whitespace-pre">{line || ' '}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
