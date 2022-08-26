import React, { useState, useCallback, useRef, Fragment } from "react";
import { FormHelperText, TextField, Button, Checkbox, Typography, FormControlLabel } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import FormDialog from "../../../shared/components/FormDialog";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import { useUserApi } from "../../../api/userApi";
import { HttpError } from "../../../api/api";

const styles = (theme: any) => ({
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
});

function RegisterDialog(props: Props) {
  const { setStatus, theme, onClose, openTermsDialog, status, classes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [hasTermsOfServiceError, setHasTermsOfServiceError] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState<HttpError | undefined>();
  const registerEmail = useRef<HTMLInputElement>();
  const registerTermsCheckbox = useRef<HTMLInputElement | null>(null);
  const registerPassword = useRef<HTMLInputElement>();
  const registerPasswordRepeat = useRef<HTMLInputElement>();
  const userApi = useUserApi()

  const register = useCallback(async () => {
    if (!registerTermsCheckbox.current?.checked) {
      setHasTermsOfServiceError(true);
      return;
    }
    if (registerPassword.current?.value !== registerPasswordRepeat.current?.value) {
      setStatus("passwordsDontMatch");
      return;
    }
    setStatus(undefined);
    setIsLoading(true);
    try {
      await userApi.add(registerEmail.current!!.value)
      if (typeof (window as any).gtag !== 'undefined') (window as any).gtag("event", "beta_register")
      setStatus('accountCreated')
    } catch (e: any) { setFormSubmitError(e); console.error(e) }
    setIsLoading(false);
  }, [
    setIsLoading, setStatus, setHasTermsOfServiceError, registerPassword, registerPasswordRepeat, registerTermsCheckbox, userApi,
    registerEmail
  ]);

  return (
    <FormDialog
      loading={isLoading}
      onClose={onClose}
      open
      headline="Register"
      onFormSubmit={(e: any) => {
        e.preventDefault();
        register();
      }}
      hideBackdrop
      hasCloseIcon
      content={
        status === "accountCreated" ?
          <Fragment>
            <HighlightedInformation>
              Congrats! We've created your account. Please check your email for the next steps.
            </HighlightedInformation>
            <video loop autoPlay muted className={classes.image} style={{ boxShadow: 'none', maxHeight: '200px' }}>
              <source src={`${process.env.PUBLIC_URL}/images/logged_out/success-video.mp4`} type="video/mp4" />
            </video>
          </Fragment> :
          <Fragment>
            {/* {isLoading && <FullScreenLoading />} */}
            <TextField
              inputRef={registerEmail}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              error={status === "invalidEmail"}
              label="Email Address"
              autoFocus
              autoComplete="off"
              type="email"
              onChange={() => {
                if (status === "invalidEmail") {
                  setStatus(undefined);
                }
              }}
              FormHelperTextProps={{ error: true }}
            />
            <FormControlLabel
              style={{ marginRight: 0 }}
              control={
                <Checkbox
                  color="primary"
                  inputRef={registerTermsCheckbox}
                  onChange={() => {
                    setHasTermsOfServiceError(false);
                  }}
                />
              }
              label={
                <Typography variant="body1">
                  I agree to the
                  <span
                    className={classes.link}
                    onClick={isLoading ? () => { } : openTermsDialog}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(event) => {
                      // For screenreaders listen to space and enter events
                      if (
                        (!isLoading && event.keyCode === 13) ||
                        event.keyCode === 32
                      ) {
                        openTermsDialog();
                      }
                    }}
                  >
                    {" "}
                    terms of service
                  </span>
                </Typography>
              }
            />
            {hasTermsOfServiceError && (
              <FormHelperText
                error
                style={{
                  display: "block",
                  marginTop: theme.spacing(-1),
                }}
              >
                In order to create an account, you have to accept our terms of
                service.
              </FormHelperText>
            )}
            {formSubmitError && (
              <FormHelperText
                error
                style={{
                  display: "block",
                  marginTop: theme.spacing(-1),
                }}
              >{formSubmitError.message}</FormHelperText>
            )}
          </Fragment>
      }
      actions={
        status === "accountCreated" ?
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="secondary"
            onClick={onClose}
          >
            Done
          </Button> :
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            color="secondary"
            disabled={isLoading}
          >
            Register
          </Button>
      }
    />
  );
}

type Props = {
  theme: any,
  onClose: () => void,
  openTermsDialog: () => void,
  status?: string,
  setStatus: (status?: string) => void,
  classes: any,
};

export default withStyles(styles, { withTheme: true })(RegisterDialog);
