import type { Route } from "./+types/providerData";
import { Outlet } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Provider Data" },
    { name: "description", content: "providerData" },
  ];
}

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import Card from "@mui/material/Card";

import { useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import { getCurrentDate } from "~/utils/dates";
// TODO: use a user set filter if the user changes the filter value
const currentDate = getCurrentDate();

const tabRoutes = [
  { id: 0, label: "Annual Provider Data", path: "providerData/annual" },
  {
    id: 1,
    label: "Monthly Provider Data",
    path: `providerData/monthly/${currentDate}`,
  },
  {
    id: 2,
    label: "Provider Trend Analysis",
    path: "providerData",
  },
];

export default function ProviderData() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);

  React.useEffect(() => {
    navigate(tabRoutes[activeTab].path, { relative: "path" });
  }, [activeTab]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(() => newValue);
  };

  return (
    <Box sx={{ py: 3, px: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Card
          sx={{ display: "flex", flexDirection: "column", flex: 1, p: 6 }}
          variant="outlined"
        >
          <Typography variant="h6">Total Providers</Typography>
          <Typography variant="h4">500</Typography>
          <Typography variant="body1" color="#71717A">
            Active in [state name]
          </Typography>
        </Card>
        <Card
          sx={{ display: "flex", flexDirection: "column", flex: 1, p: 6 }}
          variant="outlined"
        >
          <Typography variant="h6">High Risk Providers</Typography>
          <Typography variant="h4" color="error">
            114
          </Typography>
          <Typography variant="body1" color="#71717A">
            22.8% of 500
          </Typography>
        </Card>
        <Card
          sx={{ display: "flex", flexDirection: "column", flex: 1, p: 6 }}
          variant="outlined"
        >
          <Typography variant="h6">Flagged for Review</Typography>
          <Typography variant="h4" color="warning">
            250
          </Typography>
          <Typography variant="body1" color="#71717A">
            50% require immediate attention
          </Typography>
        </Card>
        <Card
          sx={{ display: "flex", flexDirection: "column", flex: 1, p: 6 }}
          variant="outlined"
        >
          <Typography variant="h6">Top Risk Factor</Typography>
          <Typography variant="h4">Risk Factor Name</Typography>
          <Typography variant="body1" color="#71717A">
            Same as last month
          </Typography>
        </Card>
      </Box>

      <Tabs value={activeTab} onChange={handleChange}>
        {tabRoutes.map(({ label, id }) => (
          <Tab key={label} label={label} value={id} />
        ))}
      </Tabs>

      <Outlet />
    </Box>
  );
}
