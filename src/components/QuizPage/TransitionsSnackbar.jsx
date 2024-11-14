import React from "react";
import Snackbar from "@mui/material/Snackbar";

export default function TransitionsSnackbar({ state, handleClose }) {
  return (
    <div>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message="poor internet connection"
        key={state.Transition.name}
        autoHideDuration={2200}
      />
    </div>
  );
}
