import React from "react";
import PropTypes from "prop-types";
import { CircularProgress, Box } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

const styles = (theme: any) => ({
  circularProgress: {
    color: theme.palette.secondary.main
  }
});

function ButtonCircularProgress(props: Props) {
  const { size, classes } = props;
  return (
    <Box color="secondary.main" pl={1.5} display="flex">
      <CircularProgress
        size={size ? size : 24}
        thickness={size ? (size / 5) * 24 : 5}
        className={classes.circularProgress}
      />
    </Box>
  );
}

type Props = {
  size?: number,
  classes: any,
};

export default withStyles(styles, { withTheme: true })(ButtonCircularProgress);
