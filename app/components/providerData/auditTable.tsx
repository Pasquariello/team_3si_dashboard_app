import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const audits = [
  {
    date: "2023-10-15",
    auditor: "Jane Smith",
    notes:
      "Identified multiple billing discrepancies in Q3 claims. Documentation missing for 15% of reviewed claims. Provider placed on review status. Follow-up audit scheduled for 30 days.",
  },
  {
    date: "2023-07-22",
    auditor: "Michael Johnson",
    notes:
      "Routine audit found minor documentation issues. Overall compliance satisfactory. Provider advised on documentation requirements. No further action needed.",
  },
  {
    date: "2023-03-10",
    auditor: "Sarah Williams",
    notes:
      "Initial baseline audit. No significant issues identified. Scheduled for routine follow-up in 6 months.",
  },
];

export default function AuditLogTable() {
  return (
    <TableContainer
      sx={{
    
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                fontWeight: 600,
                color: "text.secondary",
                borderBottom: "1px solid #e0e0e0",
              },
            }}
          >
            <TableCell>Date</TableCell>
            <TableCell>Auditor</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {audits.map((row, i) => (
            <React.Fragment key={i}>
              <TableRow
                sx={{
                  "& td": {
                    borderBottom: i === audits.length - 1 ? "none" : "1px solid #eee",
                    verticalAlign: "top",
                    paddingY: 2,
                  },
                }}
              >
                <TableCell>
                  <Typography fontWeight={700}>{row.date}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.auditor}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.notes}</Typography>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
