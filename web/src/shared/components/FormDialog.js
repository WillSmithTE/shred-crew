import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent, Box } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import DialogTitleWithCloseIcon from "./DialogTitleWithCloseIcon";
import { FullScreenLoading } from "../../logged_out/components/FullScreenLoading";

const styles = theme => ({
  dialogPaper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: theme.spacing(3),
    maxWidth: 420
  },
  actions: {
    marginTop: theme.spacing(2)
  },
  dialogPaperScrollPaper: {
    maxHeight: "none"
  },
  dialogContent: {
    paddingTop: 0,
    paddingBottom: 0
  }
});

/**
 * A Wrapper around the Dialog component to create centered
 * Login, Register or other Dialogs.
 */
function FormDialog(props) {
  const {
    classes,
    open,
    onClose,
    loading,
    headline,
    onFormSubmit,
    content,
    actions,
    hideBackdrop,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={loading}
      classes={{
        paper: classes.dialogPaper,
        paperScrollPaper: classes.dialogPaperScrollPaper
      }}
      hideBackdrop={hideBackdrop ? hideBackdrop : false}>
      {loading && <FullScreenLoading />}
      <DialogTitleWithCloseIcon
        title={headline}
        onClose={onClose}
        disabled={loading}
        paddingBottom={0}
      />
      <DialogContent className={classes.dialogContent}>
        <form onSubmit={onFormSubmit}>
          <div>{content}</div>
          <Box width="100%" className={classes.actions}>
            {actions}
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
}

FormDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  headline: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  content: PropTypes.element.isRequired,
  actions: PropTypes.element.isRequired,
  hideBackdrop: PropTypes.bool.isRequired,
};

export default withStyles(styles, { withTheme: true })(FormDialog);
