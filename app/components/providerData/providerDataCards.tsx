import { Grid, useTheme} from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import { env } from "~/env";
import DashboardCard from "~/routes/providerData/DashboardCard"
import { useParams } from "react-router";
import { useEffect } from "react";

export default function ProviderDataCards() {

    const { selectedYear } = useParams();

    const riskScoreStrings = {
        total_billed_over_capacity: "Children Billed Over",
        total_placed_over_capacity: "Children Placed Over Capacity",
        total_distance_traveled: "Distance Traveled",
        total_same_address: "Providers with Same Address"
    }

    const theme = useTheme();


    const getProviderCount = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/providerCount/${selectedYear}`)
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    const getProvidersWithHighRiskCount = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/highRiskScoreCount/${selectedYear}`)
       

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    const getHighestRiskScore = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/highRiskScore/${selectedYear}`)
        console.log(' getHighestRiskScore response', response)
        console.log('env.VITE_API_ROOT_API_URL', env.VITE_API_ROOT_API_URL)

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    }

    const getFlaggedCount = async () => {

        const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/flaggedCount/${selectedYear}`)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
    

    const { data, isLoading, isError, error } = useQuery({
        // queryKey: ['cardData'], // Unique key for this query
        // queryFn: async () => { // Async function to fetch data
        // const response = await fetch(`${env.VITE_API_ROOT_API_URL}/providerData/providerCount`)
        // console.log('response', response)
        // console.log('env.VITE_API_ROOT_API_URL', env.VITE_API_ROOT_API_URL)

        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
        // return response.json();
        // },
        queryKey: ['selectedYear', selectedYear],
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
  console.log('data?.[3]', data?.[3]);
//   const highestRiskScore = riskScores[data?.[3]?.metric];

  const sortScores = (arr) => {
    if (!arr) {
        return;
    }
    arr.sort((a, b) => {
        const nameA = a.metric.toUpperCase(); // Convert to uppercase for case-insensitive sorting
        const nameB = b.metric.toUpperCase(); // Convert to uppercase for case-insensitive sorting

        if (nameA < nameB) {
            return -1; // nameA comes before nameB
        }
        if (nameA > nameB) {
            return 1; // nameA comes after nameB
        }
        return 0; // names are equal
        });
    
    return arr
  }

  const highestRiskScoreTitle = (riskScores: any) => {
    const arr = sortScores(riskScores);
    console.log('arr', arr)
    // let metric = arr?.filter(riskScore => riskScore.year === Number(selectedYear));
    if (arr?.length > 1) {
        const [metric1, metric2] = arr;
        return `${riskScoreStrings[metric1?.metric]} and ${riskScoreStrings[metric2?.metric]}` 
    } else {
        return riskScoreStrings[arr?.[0]?.metric]
    }
  }

//   let baz = [{ year: 2023, metric: "total_placed_over_capacity", total_value: 55659 }, { year: 2023, metric: "total_distance_traveled", total_value: 55659 }, { year: 2024, metric: "total_billed_over_capacity", total_value: 56028 }]
  let baz = [{ year: 2023, metric: "total_billed_over_capacity", total_value: 55659 },{ year: 2024, metric: "total_billed_over_capacity", total_value: 56028 }]

  const highestRiskScoreDesc = () => {
    const riskScores =  data?.[3]; 

    let thisYear = riskScores?.filter(riskScore => riskScore.year === Number(selectedYear));
    let lastYear = baz?.filter(riskScore => riskScore.year === (Number(selectedYear) - 1));

    let foo = highestRiskScoreTitle(thisYear);
    let bar = highestRiskScoreTitle(lastYear)
    console.log('thisyear', thisYear, foo)
    console.log('lastyear', lastYear, bar)

    if (foo === bar) {
        return 'same as last year'
    } else {
        return `last year: ${bar}`
    }
  }


  useEffect(() => {
    highestRiskScoreDesc()
    // let title = highestRiskScoreTitle(data?.[3])
  }, [ data?.[3]])
  
    let currentYearArr = data?.[3].filter(riskScore => riskScore.year === Number(selectedYear));
    let title = highestRiskScoreTitle(currentYearArr)
    
    return (
        <Grid container spacing={2} m={2} columns={{ xs: 12 }}>
            <Grid style={{ display: 'flex', flexGrow: 1 }} size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
            <DashboardCard
                title='Total Providers'
                description={`Active in ${env.VITE_STATE_NAME || 'State Name'}`}
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
                description={highestRiskScoreDesc() || ``}
                value={title || ''}
                descColor={theme.palette.cusp_iron.contrastText}
                loading={isLoading}
            />
            </Grid>
        </Grid>
    )
}