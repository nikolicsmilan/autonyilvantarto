import React from "react";
//import { DataGrid } from "@mui/x-data-grid";
import { DataGrid } from "@material-ui/data-grid";
import "./carList.css";

export default function CarLists(props) {
  const columns = [
   
    { field: "gyarto", headerName: "Gyártó", width: 120 },
    { field: "tipus", headerName: "Típus", width: 180 },
    { field: "hengerurtartalom", headerName: "Motor hengerűrtartalom", width: 120 },
    { field: "szin", headerName: "Szín", width: 120 },
    { field: "kivitel", headerName: "Kivitel", width: 120 },
    { field: "gyartasido", headerName: "Gyártási időpont", width: 200 },
    { field: "gyartoweboldal", headerName: "Gyártó weboldala", width: 200 },
  ];

  return (
    <div className="car-list">
      <DataGrid
        autoHeight
        rows={props.autos}
        columns={columns}
        pageSize={7}
        checkboxSelection
      />
    </div>
  );
}
//  rowsPerPageOptions={[5]}
// { field: "id", headerName: "ID", width: 250 },