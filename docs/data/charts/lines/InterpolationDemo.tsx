import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LineChart } from '@mui/x-charts/LineChart';
import { CurveType } from '@mui/x-charts/models';

const curveTypes: CurveType[] = [
  'catmullRom',
  'linear',
  'monotoneX',
  'monotoneY',
  'natural',
  'step',
  'stepBefore',
  'stepAfter',
];

export default function InterpolationDemo() {
  const [curveType, setCurveType] = React.useState<CurveType>('linear');

  return (
    <Box>
      <TextField
        select
        label="interpolation method"
        value={curveType}
        sx={{ minWidth: 200 }}
        onChange={(event) => setCurveType(event.target.value as CurveType)}
      >
        {curveTypes.map((curve) => (
          <MenuItem key={curve} value={curve}>
            {curve}
          </MenuItem>
        ))}
      </TextField>
      <LineChart
        xAxis={[{ data: [1, 3, 5, 6, 7, 9], min: 0, max: 10 }]}
        series={[
          { curve: curveType, data: [0, 5, 2, 6, 3, 9] },
          { curve: curveType, data: [6, 3, 7, 9, 4, 2] },
        ]}
        width={600}
        height={500}
      />
    </Box>
  );
}
