import * as React from 'react';
import { Card } from '@mui/material';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

type DashboardCardProps = Readonly<{
   title: string; 
   description: string; 
   value: string; 
   valueColor?: string;
   descColor?: string; 
   loading: boolean; 
}>;

export default function DashboardCard({title, value, description, valueColor, descColor, loading,}: DashboardCardProps) { 
  return (
    <Card
      sx={{
        flex: 1,
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        p: 6,
      }}
      variant='outlined'
    >
      { loading ?  <Skeleton
        animation="wave"
        height={10}
        width="80%"
        style={{ marginBottom: 6 }}
      /> :   <Typography variant='h6'>{title}</Typography> }

        { loading ?  <Skeleton
        animation="wave"
        height={60}
        width="80%"
        style={{ marginBottom: 6 }}
      /> :    <Typography variant='h4' color={valueColor}>{value}</Typography> }
    
          
            { loading ?  <Skeleton
        animation="wave"
        height={10}
        width="80%"
        style={{ marginBottom: 6 }}
      /> :    <Typography variant='body1' color={descColor}>
        {description}
      </Typography> }
    
    </Card>
  )
}