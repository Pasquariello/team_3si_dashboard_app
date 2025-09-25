import { Grid, useTheme} from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { env } from "~/env";
import DashboardCard from "~/routes/providerData/DashboardCard"

export default function ProviderDataCards() {


    const theme = useTheme();

      const [loading, setLoading] = React.useState(true);
    
      // TEMP
      React.useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 3000);
    
        // cleanup in case the component unmounts before 3s
        return () => clearTimeout(timer);
      }, []);

    const getProviderCount = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/providerCount`)
        console.log('response', response)
        console.log('env.VITE_API_ROOT_API_URL', env.VITE_API_ROOT_API_URL)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
    

     const getFlaggedCount = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/flaggedCount`)
        console.log('response', response)
        console.log('env.VITE_API_ROOT_API_URL', env.VITE_API_ROOT_API_URL)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
    

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['cardData'], // Unique key for this query
        // queryFn: async () => { // Async function to fetch data
        // const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/providerCount`)
        // console.log('response', response)
        // console.log('env.VITE_API_ROOT_API_URL', env.VITE_API_ROOT_API_URL)

        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
        // return response.json();
        // },
        queryFn: async () => {
            const [unique_provider_count, dashboardStats] = await Promise.all([
            getProviderCount(),
            getFlaggedCount(),  // another request
            ]);
            return [unique_provider_count, dashboardStats];
        },
    });

 

    //   const [unique_provider_count, dashboardStats] = data;
//   console.log(data[0].unique_provider_count);
 
    
    return (
        <Grid container spacing={2} m={2} columns={{ xs: 12 }}>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='Total Providers'
                description='Active in [state name]'
                value={data?.[0]?.unique_provider_count}
                descColor={theme.palette.cusp_iron.contrastText}
                loading={loading}
            />
            </Grid>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='High Risk Providers'
                description='22.8% of 500'
                value='114'
                valueColor='error'
                descColor={theme.palette.cusp_iron.contrastText}
                loading={loading}
            />
            </Grid>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='Flagged for Review'
                description='50% require immediate attention'
                value='250'
                valueColor='warning'
                descColor={theme.palette.cusp_iron.contrastText}
                loading={loading}
            />
            </Grid>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='Top Risk Factor'
                description='Same as last month'
                value='Risk Factor Name'
                descColor={theme.palette.cusp_iron.contrastText}
                loading={loading}
            />
            </Grid>
        </Grid>
    )
}