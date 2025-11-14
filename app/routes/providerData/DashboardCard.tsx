import * as React from 'react';
import { Box, Card } from '@mui/material';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

type DashboardCardProps = Readonly<{
   title: string; 
   description: string; 
   value: any; 
   valueColor?: string;
   descColor?: string; 
   loading: boolean; 
}>;

export default function DashboardCard({title, value, description, descColor, loading,}: DashboardCardProps) { 
  return (
    <Card
      sx={{
        flex: 1,
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        borderRadius:  3,
      }}
      variant='outlined'
    >
      { loading ?  <Skeleton
        animation="wave"
        height={10}
        width="80%"
        style={{ marginBottom: 6 }}
      /> : <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>{title}</Box>}

        { loading ?  <Skeleton
        animation="wave"
        height={60}
        width="80%"
        style={{ marginBottom: 6 }}
      /> :    value }
    
          
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