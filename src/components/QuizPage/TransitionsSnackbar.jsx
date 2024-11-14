import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function TransitionsSnackbar({ error }) {
  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
  });

  const handleClick = (Transition) => () => {
    setState({
      open: true,
      Transition,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };
  useEffect(() => {
    if (error) {
      handleClick(SlideTransition)();
    }
  }, [error]);

  return (
    <div>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        message="poor internet connection. please refresh"
        key={state.Transition.name}
        autoHideDuration={2200}
      />
    </div>
  );
}
