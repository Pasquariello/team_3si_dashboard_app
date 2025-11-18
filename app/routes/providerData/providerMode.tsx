import { useParams } from "react-router";
import AnnualProviderData from "./annualProviderData";
import MonthlyProviderData from "./monthlyProviderData";
import { useOutletContext } from "react-router";

export default function ProviderMode() {
const { annual, monthly, setAnnualViewData, setMonthlyViewData } = useOutletContext();
  const { mode, date } = useParams();    


  if (!mode || !date) {
    throw new Error("Missing required parameters");
  }

  if (mode === "annual") {
    return <AnnualProviderData selectedYear={annual} setAnnualViewData={setAnnualViewData} />;
  }

  if (mode === "monthly") {
    return <MonthlyProviderData selectedDate={monthly} setMonthlyViewData={setMonthlyViewData} />;
  }

  throw new Response("Not found", { status: 404 });
}
