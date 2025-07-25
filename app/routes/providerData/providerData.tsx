import type { Route } from "./+types/providerData";
import { Outlet } from "react-router";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Provider Data" },
    { name: "description", content: "providerData" },
  ];
}



import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box'

import {Card, Grid } from '@mui/material';;

import { useNavigate, useLocation } from 'react-router';
import Typography from "@mui/material/Typography";

const tabRoutes = [
  { label: "Annual Provider Data", path: "providerData/annual" },
  { label: "Monthly Provider Data", path: "providerData/monthly" },
  { label: "Provider Trend Analysis", path: "providerData" },

];

export default function ProviderData() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab index by matching current path with tabRoutes paths
  const currentTabIndex = tabRoutes.findIndex(tab =>
    location.pathname.endsWith(tab.path)
  );
  

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    // navigate(tabRoutes[newValue].path);
        navigate(tabRoutes[newValue].path, { relative: "path" });
  };

  return (
    <Box sx={{py: 3, px: 4}}>
      <Grid container spacing={2} mb={2} columns={{xs: 12}}>
        <Grid style={{display: 'flex', flexGrow: 1,}} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <Card sx={{ flex: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', p: 6, }} variant="outlined">
            <Typography variant="h6">Total Providers</Typography>
            <Typography variant="h4" >
              500
            </Typography>
            <Typography  variant="body1" color="#71717A">Active in [state name]</Typography>
          </Card>
        </Grid>
        <Grid style={{display: 'flex', flexGrow: 1,}} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>

          <Card  sx={{ flex: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', p: 6, }} variant="outlined">
            <Typography variant="h6">High Risk Providers</Typography>
            <Typography variant="h4" color="error" >
              114
            </Typography>
            <Typography  variant="body1" color="#71717A">22.8% of 500</Typography>
          </Card>
        </Grid>
        <Grid style={{display: 'flex', flexGrow: 1,}} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>

          <Card sx={{ flex: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', p: 6, }} variant="outlined">
                <Typography variant="h6">Flagged for Review</Typography>
            <Typography variant="h4"  color="warning" >
              250
            </Typography>
            <Typography  variant="body1" color="#71717A">50% require immediate attention</Typography>
          </Card>
        </Grid>
        <Grid style={{display: 'flex', flexGrow: 1,}} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
          <Card  sx={{ flex: 1, justifyContent: 'center', display: 'flex', flexDirection: 'column', p: 6, }} variant="outlined">
                <Typography variant="h6">Top Risk Factor</Typography>
            <Typography variant="h4" >
              Risk Factor Name
            </Typography>
            <Typography  variant="body1" color="#71717A">Same as last month</Typography>
          </Card>
        </Grid>

      </Grid>

      <Tabs value={currentTabIndex === -1 ? 0 : currentTabIndex} onChange={handleChange}>
        {tabRoutes.map(({ label }) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      <Outlet />
    </Box>
  );
}