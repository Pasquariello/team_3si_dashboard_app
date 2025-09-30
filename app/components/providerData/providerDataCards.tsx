import { Grid, useTheme} from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { env } from "~/env";
import DashboardCard from "~/routes/providerData/DashboardCard"

export default function ProviderDataCards() {

    const riskScores = {
        total_billed_over_capacity: "Children Billed Over",
        total_placed_over_capacity: "Children Placed Over Capacity",
        total_distance_traveled: "Distance Traveled",
        total_same_address: "Providers with Same Address"
    }

    const theme = useTheme();


    const getProviderCount = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/providerCount`)
        console.log('response', response)
        console.log('env.VITE_API_ROOT_API_URL', env.VITE_API_ROOT_API_URL)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    const getProvidersWithHighRiskCount = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/highRiskScoreCount`)
        console.log('response', response)
        console.log('env.VITE_API_ROOT_API_URL', env.VITE_API_ROOT_API_URL)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }


    const getHighestRiskScore = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/highRiskScore`)
        console.log('response', response)
        console.log('env.VITE_API_ROOT_API_URL', env.VITE_API_ROOT_API_URL)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
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
            const [unique_provider_count, dashboardStats, count_over_44, foo] = await Promise.all([
            getProviderCount(),
            getFlaggedCount(),  // another request
            getProvidersWithHighRiskCount(),
            getHighestRiskScore()
            ]);
            return [unique_provider_count, dashboardStats, count_over_44, foo];
        },
    });

 

    //   const [unique_provider_count, dashboardStats] = data;
  console.log(data || 'nothing!');

  const highRiskPercentage = Math.round((data?.[2]?.count_over_44 / data?.[0]?.unique_provider_count) * 100);
  const highestRiskScore = riskScores[data?.[3]?.metric];

  console.log('highestRiskScore === ', highestRiskScore)
    
    return (
        <Grid container spacing={2} mb={2} columns={{ xs: 12 }}>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='Total Providers'
                description={`Active in ${env.STATE_NAME || 'State Name'}`}
                value={data?.[0]?.unique_provider_count}
                descColor={theme.palette.cusp_iron.contrastText}
                loading={isLoading}
            />
            </Grid>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='High Risk Providers'
                description={`${highRiskPercentage}% of ${data?.[0]?.unique_provider_count}`}
                // value='114'
                value={data?.[2]?.count_over_44}
                valueColor='error'
                descColor={theme.palette.cusp_iron.contrastText}
                loading={isLoading}
            />
            </Grid>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='Flagged for Review'
                description='50% require immediate attention'
                value='250'
                valueColor='warning'
                descColor={theme.palette.cusp_iron.contrastText}
                loading={isLoading}
            />
            </Grid>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='Top Risk Factor'
                description='Same as last month'
                value={highestRiskScore || ''}
                descColor={theme.palette.cusp_iron.contrastText}
                loading={isLoading}
            />
            </Grid>
        </Grid>
    )
}